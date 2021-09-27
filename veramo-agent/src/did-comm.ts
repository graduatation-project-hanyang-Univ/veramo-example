import { agent } from "./veramo/setup";
import {IEventListener, IIdentifier} from "@veramo/core";




async function main() {
    const ids = await agent.didManagerFind();
    const id: IIdentifier = ids[0];

    const packedMessage = await agent.packDIDCommMessage({
        packing: 'none',
        message: {
            type: 'test',
            to: id.did,
            id: 'test-1',
            body: {
                hello: 'world',
            },
        },
    });
    console.log('packed message:')
    console.log(packedMessage)

    const result = await agent.sendDIDCommMessage({
        messageId: 'test-id-1',
        packedMessage,
        recipientDidUrl: id.did,
    })

    console.log(result)

}

main().catch(console.log);