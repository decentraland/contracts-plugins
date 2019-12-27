import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types'
import { extendEnvironment, usePlugin } from '@nomiclabs/buidler/config'

usePlugin('@nomiclabs/buidler-web3')

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
  ] = env.web3.eth.getAccounts

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
