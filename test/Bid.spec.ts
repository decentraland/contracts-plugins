import { Bid, ONE_ETH, SIX_MONTHS_IN_SECONDS, LISTING_PRICE } from '../src'

const web3 = global['web3']
const BN = web3.utils.BN
const expect = require('chai').use(require('bn-chai')(BN)).expect

describe('Bid', function() {
  this.timeout(10000)
  let accounts
  let deployer
  let bidder
  let anotherBidder
  let bid: Bid
  let bidContract

  beforeEach(async function() {
    accounts = await web3.eth.getAccounts()
    deployer = accounts[0]
    bidder = accounts[9]
    anotherBidder = accounts[10]

    const creationParams = {
      from: deployer,
      gas: 6e6,
      gasPrice: 21e9
    }

    bid = new Bid({ accounts, artifacts: global }) // should be artifacts

    bidContract = await bid.deploy({ txParams: creationParams })
  })

  it('should create bids', async function() {
    const erc721 = bid.getERC721Contract()
    let order = await bidContract.getBidByToken(erc721.address, 1, 0)
    expect(order[1]).to.be.equal(bidder)
    expect(order[2]).to.eq.BN(LISTING_PRICE)

    order = await bidContract.getBidByToken(erc721.address, 2, 0)
    expect(order[1]).to.be.equal(anotherBidder)
    expect(order[2]).to.eq.BN(LISTING_PRICE)
  })

  it('should create more bids', async function() {
    const erc721 = bid.getERC721Contract()
    let order = await bidContract.getBidByToken(erc721.address, 1, 0)
    expect(order[1]).to.be.equal(bidder)
    expect(order[2]).to.eq.BN(LISTING_PRICE)

    await bid.createBids(
      erc721.address,
      ['1'],
      ONE_ETH,
      SIX_MONTHS_IN_SECONDS,
      bidder
    )

    order = await bidContract.getBidByToken(erc721.address, 1, 0)
    expect(order[1]).to.be.equal(bidder)
    expect(order[2]).to.eq.BN(ONE_ETH)
  })
})
