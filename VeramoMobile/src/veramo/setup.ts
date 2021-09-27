// Core interfaces
import {createAgent, IDIDManager, IResolver, IDataStore, IKeyManager, IMessageHandler} from '@veramo/core'

// Core identity manager plugin
import { DIDManager } from '@veramo/did-manager'

// Ethr did identity provider
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

// Core key manager plugin
import { KeyManager } from '@veramo/key-manager'

// Custom key management system for RN
import { KeyManagementSystem } from '@veramo/kms-local'

// Custom resolver
// Custom resolvers
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

// Storage plugin using TypeOrm
import { Entities, KeyStore, DIDStore, IDataStoreORM } from '@veramo/data-store'

// TypeORM is installed with '@veramo/data-store'
import { createConnection } from 'typeorm'
import {MessageHandler} from "@veramo/message-handler";
import {DIDCommMessageHandler} from "@veramo/did-comm";
import {JwtMessageHandler} from "@veramo/did-jwt";
import {W3cMessageHandler} from "@veramo/credential-w3c";
import {
    ISelectiveDisclosure,
    ISelectiveDisclosureRequest,
    SdrMessageHandler,
    SelectiveDisclosure
} from "@veramo/selective-disclosure";
import {UrlMessageHandler} from "@veramo/url-handler";

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = '2b64268fa545491f90167f46698876db'

// Create react native db connection
const dbConnection = createConnection({
    type: 'react-native',
    database: 'veramo.sqlite',
    location: 'default',
    synchronize: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
})

export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & IMessageHandler & ISelectiveDisclosure  >({
    plugins: [
        new KeyManager({
            store: new KeyStore(dbConnection),
            kms: {
                local: new KeyManagementSystem(),
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
            },
        }),
        new DIDResolverPlugin({
            resolver: new Resolver({
                ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
                ...webDidResolver(),
            }),
        }),

        new MessageHandler({
            messageHandlers: [
                new DIDCommMessageHandler(),
                new JwtMessageHandler(),
                new W3cMessageHandler(),
                new SdrMessageHandler(),
                new UrlMessageHandler(),
            ],
        }),

        new SelectiveDisclosure()
    ],
})