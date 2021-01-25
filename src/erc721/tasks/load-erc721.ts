import TruffleContractFactory from 'truffle-contract'
import { internalTask } from 'hardhat/config'
import { TASK_TEST_SETUP_TEST_ENVIRONMENT } from 'hardhat/builtin-tasks/task-names'

import * as erc721 from 'openzeppelin-solidity/build/contracts/ERC721Mintable.json'

require('@nomiclabs/hardhat-web3')
require('@nomiclabs/hardhat-truffle5')

internalTask(TASK_TEST_SETUP_TEST_ENVIRONMENT, async (_, env, runSuper) => {
  await runSuper()

  const Contract = TruffleContractFactory(erc721)
  Contract.setProvider(env.network.provider)

  env.artifacts['ERC721'] = Contract

  return env
})
