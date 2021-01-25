import TruffleContractFactory from 'truffle-contract'
import { internalTask } from 'hardhat/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from 'hardhat/builtin-tasks/task-names'

import * as erc20 from 'decentraland-mana/build/contracts/MANAToken.json'

require('@nomiclabs/hardhat-web3')
require('@nomiclabs/hardhat-truffle5')

internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()

  const Contract = TruffleContractFactory(erc20)
  Contract.setProvider(env.network.provider)

  env.artifacts['MANA'] = Contract

  return env
})
