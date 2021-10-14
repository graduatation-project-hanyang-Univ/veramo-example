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
        save: false,
    })

    console.log('vc creation : ');
    console.log(vc); // 이 정보를 QR로 제공한다고 생각.

    const data:any = await agent.handleMessage({
        raw: vc.proof.jwt,
    });
    console.log('data: ');
    console.log(data);
    console.log(data.credentials);

    for(const credential of data.credentials) {
        const hash = await agent.dataStoreSaveVerifiableCredential({
            verifiableCredential: credential,
        })
        console.log(hash);

    }



}

main().catch(console.log)
