import {agent} from "./veramo/setup";
import {IIdentifier} from "@veramo/core";

async function main() {
    const ids = await agent.didManagerFind();
    const id: IIdentifier = ids[0];

    // issuer에서 QR로 제공
    const jwt = await agent.createSelectiveDisclosureRequest({
        data: {
            issuer: id.did,
            claims: [
                {
                    reason: 'We need it',
                    claimType: 'seat',
                    essential: true,
                },
            ],
        },
    });
    console.log(jwt)

    
    // QR로 받은 정보 해석 후 분석
    const sdr:any = await agent.handleMessage({
        raw: jwt,
    });
    console.log(sdr);

    const gathered = await agent.getVerifiableCredentialsForSdr({
        sdr: sdr.data,
    });

    console.log(JSON.stringify(gathered, null, 2))

    const presented = await agent.createVerifiablePresentation({
        presentation: {
            verifier: [id.did],
            holder: id.did,
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiablePresentation'],
            issuanceDate: new Date().toISOString(),
            verifiableCredential: gathered[0].credentials.map((c) => c.verifiableCredential),
        },
        proofFormat: 'jwt',
    })

    const validated = await agent.validatePresentationAgainstSdr({
        presentation: presented,
        sdr: sdr.data,
    });
    console.log('validated: ')
    console.log(validated)
}

main().catch(console.log)