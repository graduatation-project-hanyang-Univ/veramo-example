import {agent} from "./veramo/setup";

async function main() {

  const res = await agent.dataStoreORMGetVerifiableCredentials()
  console.log(JSON.stringify(res,null,2));

}

main().catch(console.log)
