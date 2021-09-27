import {agent} from "./veramo/setup";
import {IIdentifier} from "@veramo/core";
import {ISelectiveDisclosureRequest} from "@veramo/selective-disclosure";

async function main() {
    const ids = await agent.didManagerFind();
    const id: IIdentifier = ids[0];

    const vc = await agent.createVerifiableCredential({
        credential: {
            issuer: { id: id.did},
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            issuanceDate: new Date().toISOString(),
            credentialSubject: {
                seat: 'r7'
            },
        },
        proofFormat: 'jwt',
        save: true,
    })

    console.log('vc creation : ');
    console.log(vc); // 이 정보를 QR로 제공한다고 생각.
}

main().catch(console.log)