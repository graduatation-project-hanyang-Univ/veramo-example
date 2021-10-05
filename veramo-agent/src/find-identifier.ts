import { agent } from './veramo/setup'

async function main() {
  const getId = await agent.didManagerGetOrCreate({
    alias: 'default',
  });

  console.log(getId);
}

main().catch(console.log)
