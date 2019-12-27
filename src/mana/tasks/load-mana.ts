import TruffleContractFactory from 'truffle-contract'
import { internalTask, usePlugin } from '@nomiclabs/buidler/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from '@nomiclabs/buidler/builtin-tasks/task-names'

import * as erc20 from 'decentraland-mana/build/contracts/MANAToken.json'

usePlugin('@nomiclabs/buidler-web3')
usePlugin('@nomiclabs/buidler-truffle5')


internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()
  const Contract = TruffleContractFactory(erc20)

  const MANA = env.artifacts['_provisioner'].provision(Contract, env.artifacts)

  global['MANA'] = MANA
})
