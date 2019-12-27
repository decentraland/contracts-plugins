import TruffleContractFactory from 'truffle-contract'
import { internalTask, usePlugin } from '@nomiclabs/buidler/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from '@nomiclabs/buidler/builtin-tasks/task-names'

import * as bid from 'bid-contract/build/contracts/ERC721Bid.json'

usePlugin('@nomiclabs/buidler-truffle5')

internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()

  const Contract = TruffleContractFactory(bid)
  const Bid = env.artifacts['_provisioner'].provision(Contract, env.artifacts)

  global['Bid'] = Bid
})
