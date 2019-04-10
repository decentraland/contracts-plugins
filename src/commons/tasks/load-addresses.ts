import '@nomiclabs/buidler-web3'
import { extendEnvironment } from '@nomiclabs/buidler/config'
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types'

extendEnvironment(async (env: BuidlerRuntimeEnvironment) => {
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
  ] = await env.web3.eth.getAccounts()

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
})
