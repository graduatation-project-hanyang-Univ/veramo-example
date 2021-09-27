import { agent } from './veramo/setup'

async function main() {
    const identity = await agent.didManagerCreate()

    console.log(`New identity created`)
    console.log(JSON.stringify(identity,null, 2))
}

main().catch(console.log)