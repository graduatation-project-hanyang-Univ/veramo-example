import { agent } from "./veramo/setup";

async function main() {
    const did = 'did:ethr:rinkeby:0x03c5394ea78f702eecf786a9dc155f56a915d163594c4fe8e519b028781587525f';

    const didDoc = await agent.resolveDid({
        didUrl: did,
    });

    console.log('resolved :')
    console.log(didDoc)


}

main().catch(console.log)