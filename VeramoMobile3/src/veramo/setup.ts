// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
  IMessageHandler,
  IEventListener,
} from '@veramo/core';

// Core identity manager plugin
import {DIDManager} from '@veramo/did-manager';

// Ethr did identity provider
import {EthrDIDProvider} from '@veramo/did-provider-ethr';

// Web did identity provider
import {WebDIDProvider} from '@veramo/did-provider-web';

// Core key manager plugin
import {AbstractKeyStore, KeyManager} from '@veramo/key-manager';

// Custom key management system for RN
import {KeyManagementSystem, SecretBox} from '@veramo/kms-local';

// Custom resolvers
import {DIDResolverPlugin} from '@veramo/did-resolver';
import {Resolver} from 'did-resolver';
import {getResolver as ethrDidResolver} from 'ethr-did-resolver';
import {getResolver as webDidResolver} from 'web-did-resolver';

// Storage plugin using TypeOrm
import {
  Entities,
  KeyStore,
  DIDStore,
  IDataStoreORM,
  PrivateKeyStore,
  DataStore,
  DataStoreORM,
  migrations,
} from '@veramo/data-store';

// TypeORM is installed with `@veramo/data-store`
import {createConnection} from 'typeorm';
import {MessageHandler} from '@veramo/message-handler';
import {
  DIDComm,
  DIDCommHttpTransport,
  DIDCommMessageHandler,
  IDIDComm,
} from '@veramo/did-comm';
import {JwtMessageHandler} from '@veramo/did-jwt';
import {
  CredentialIssuer,
  ICredentialIssuer,
  W3cMessageHandler,
} from '@veramo/credential-w3c';
import {
  ISelectiveDisclosure,
  SdrMessageHandler,
  SelectiveDisclosure,
} from '@veramo/selective-disclosure';

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = '2b64268fa545491f90167f46698876db';
const secretKey =
  '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c';

// Create react native db connection
const dbConnection = createConnection({
  type: 'react-native',
  database: 'veramo.sqlite',
  location: 'default',
  synchronize: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
});

export const agent = createAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IDataStoreORM &
    IResolver &
    IMessageHandler &
    IDIDComm &
    ICredentialIssuer &
    ISelectiveDisclosure
>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(
          new PrivateKeyStore(dbConnection, new SecretBox(secretKey)),
        ),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:ethr:rinkeby',
      providers: {
        'did:ethr:rinkeby': new EthrDIDProvider({
          defaultKms: 'local',
          network: 'rinkeby',
          rpcUrl: 'https://rinkeby.infura.io/v3/' + INFURA_PROJECT_ID,
          gas: 1000001,
          ttl: 60 * 60 * 24 * 30 * 12 + 1,
        }),
        'did:web': new WebDIDProvider({
          defaultKms: 'local',
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({infuraProjectId: INFURA_PROJECT_ID}),
        ...webDidResolver(),
      }),
    }),
    new DataStore(dbConnection),
    new DataStoreORM(dbConnection),
    new MessageHandler({
      messageHandlers: [
        new DIDCommMessageHandler(),
        new JwtMessageHandler(),
        new W3cMessageHandler(),
        new SdrMessageHandler(),
      ],
    }),
    new DIDComm([new DIDCommHttpTransport()]),
    new CredentialIssuer(),
    new SelectiveDisclosure(),
  ],
});
