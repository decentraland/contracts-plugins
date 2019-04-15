import TruffleContractFactory from 'truffle-contract'
import { internalTask } from '@nomiclabs/buidler/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from '@nomiclabs/buidler/builtin-tasks/task-names'
import '@nomiclabs/buidler-web3'
import '@nomiclabs/buidler-truffle5'

import * as erc20 from 'decentraland-mana/build/contracts/MANAToken.json'

internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()
  const Contract = TruffleContractFactory(erc20)

  const MANA = env.artifacts['provisioner'].provision(Contract, env.artifacts)

  global['MANA'] = MANA
})
