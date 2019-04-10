import TruffleContractFactory from 'truffle-contract'
import '@nomiclabs/buidler-truffle5'
import { internalTask } from '@nomiclabs/buidler/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from '@nomiclabs/buidler/builtin-tasks/task-names'

import * as bid from 'bid-contract/build/contracts/ERC721Bid.json'

internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()

  const Contract = TruffleContractFactory(bid)
  const Bid = env.artifacts['provisioner'].provision(Contract, env.artifacts)

  global['Bid'] = Bid
})
