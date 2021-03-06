import TruffleContractFactory from 'truffle-contract'
import { internalTask } from 'hardhat/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from 'hardhat/builtin-tasks/task-names'

import * as marketplace from 'marketplace-contracts/artifacts/contracts/marketplace/Marketplace.sol/Marketplace.json'

import '@nomiclabs/hardhat-truffle5'


internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()

  const Contract = TruffleContractFactory(marketplace)
  Contract.setProvider(env.network.provider)

  env.artifacts['Marketplace'] = Contract

  return env
})
