import {
  Marketplace,
  ONE_ETH,
  SIX_MONTHS_IN_SECONDS,
  LISTING_PRICE
} from '../src'

const web3 = global['web3']
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
    deployer = accounts[0]
    user = accounts[1]
    anotherUser = accounts[2]

    const creationParams = {
      from: deployer,
      gas: 6e6,
      gasPrice: 21e9
    }

    marketplace = new Marketplace({ accounts, artifacts: global }) // should be artifacts

    marketplaceContract = await marketplace.deploy({ txParams: creationParams })
  })

  it('should create orders', async function() {
    const erc721 = marketplace.getLegacyNFTContract()
    let order = await marketplaceContract.orderByAssetId(erc721.address, 1)
    expect(order[1]).to.be.equal(user)
    expect(order[3]).to.eq.BN(LISTING_PRICE)

    order = await marketplaceContract.orderByAssetId(erc721.address, 2)
    expect(order[1]).to.be.equal(anotherUser)
    expect(order[3]).to.eq.BN(LISTING_PRICE)
  })

  it('should create more orders', async function() {
    const erc721 = marketplace.getLegacyNFTContract()
    let order = await marketplaceContract.orderByAssetId(erc721.address, 1)
    expect(order[1]).to.be.equal(user)
    expect(order[3]).to.eq.BN(LISTING_PRICE)

    const endTime = Date.now() + SIX_MONTHS_IN_SECONDS
    await marketplace.createOrders(
      erc721.address,
      ['1'],
      ONE_ETH,
      endTime,
      user
    )

    order = await marketplaceContract.orderByAssetId(erc721.address, 1)
    expect(order[1]).to.be.equal(user)
    expect(order[3]).to.eq.BN(ONE_ETH)
  })
})
