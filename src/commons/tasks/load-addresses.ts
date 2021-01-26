import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { extendEnvironment } from 'hardhat/config'

import '@nomiclabs/hardhat-web3'

extendEnvironment(async (env: HardhatRuntimeEnvironment) => {
  const [
    deployer,
    user,
    anotherUser,
    operator,
    anotherOperator,
    updateOperator,
    anotherUpdateOperator,
    buyer,
    anotherBuyer,
    bidder,
    anotherBidder,
    hacker
  ] = await env['web3'].eth.getAccounts()

  env['accounts'] = {
    deployer,
    user,
    anotherUser,
    operator,
    anotherOperator,
    updateOperator,
    anotherUpdateOperator,
    buyer,
    anotherBuyer,
    bidder,
    anotherBidder,
    hacker
  }

  return env
})
