import TruffleContractFactory from 'truffle-contract'
import '@nomiclabs/buidler-truffle5'
import { internalTask } from '@nomiclabs/buidler/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from '@nomiclabs/buidler/builtin-tasks/task-names'

import * as marketplace from 'marketplace-contracts/build/contracts/Marketplace.json'

internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()

  const Contract = TruffleContractFactory(marketplace)
  const Marketplace = env.artifacts['provisioner'].provision(
    Contract,
    env.artifacts
  )

  global['Marketplace'] = Marketplace
})
