import env from '@nomiclabs/buidler'

import { Marketplace, ONE_ETH, ADDRESS_INDEXES, ORDERS } from '../src'

const web3 = env.web3
const BN = web3.utils.BN
const expect = require('chai').use(require('bn-chai')(BN)).expect

describe('Marketplace', function() {
  this.timeout(10000)
  let accounts
  let deployer
  let user
  let anotherUser
  let marketplace: Marketplace
  let marketplaceContract

  beforeEach(async function() {
    accounts = (await web3.eth.getAccounts()).slice(0, 3)
    deployer = accounts[ADDRESS_INDEXES.deployer]
    user = accounts[ADDRESS_INDEXES.user]
    anotherUser = accounts[ADDRESS_INDEXES.anotherUser]

    const creationParams = {
      from: deployer,
      gas: 6e6,
      gasPrice: 21e9
    }

    marketplace = new Marketplace({ accounts, artifacts: global }) // should be artifacts

    marketplaceContract = await marketplace.deploy({ txParams: creationParams })
  })

  it('should create orders', async function() {
    const { one, two } = ORDERS
    const erc721 = marketplace.getLegacyNFTContract()

    let order = await marketplaceContract.orderByAssetId(
      erc721.address,
      one.tokenId
    )
    expect(order[1]).to.be.equal(user)
    expect(order[3]).to.eq.BN(one.price)

    order = await marketplaceContract.orderByAssetId(
      erc721.address,
      two.tokenId
    )
    expect(order[1]).to.be.equal(anotherUser)
    expect(order[3]).to.eq.BN(two.price)
  })

  it('should create more orders', async function() {
    const { one } = ORDERS
    const erc721 = marketplace.getLegacyNFTContract()

    let order = await marketplaceContract.orderByAssetId(
      erc721.address,
      one.tokenId
    )
    expect(order[1]).to.be.equal(user)
    expect(order[3]).to.eq.BN(one.price)

    const endTime = Date.now() + one.duration
    await marketplace.createOrders(
      erc721.address,
      [one.tokenId],
      ONE_ETH,
      endTime,
      user
    )

    order = await marketplaceContract.orderByAssetId(
      erc721.address,
      one.tokenId
    )
    expect(order[1]).to.be.equal(user)
    expect(order[3]).to.eq.BN(ONE_ETH)
  })
})
