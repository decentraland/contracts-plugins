import TruffleContractFactory from 'truffle-contract'
import { internalTask } from 'hardhat/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from 'hardhat/builtin-tasks/task-names'

import * as bid from 'bid-contract/build/contracts/ERC721Bid.json'

import '@nomiclabs/hardhat-web3'

import '@nomiclabs/hardhat-truffle5'


internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()

  const Contract = TruffleContractFactory(bid)
  Contract.setProvider(env.network.provider)

  env.artifacts['Bid'] = Contract

  return env
})
