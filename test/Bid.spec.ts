import env from 'hardhat'

import { Bid, ONE_ETH, ADDRESS_INDEXES, BIDS } from '../src'

const web3 = env['web3']
const BN = web3.utils.BN
const expect = require('chai').use(require('bn-chai')(BN)).expect

describe('Bid', function () {
  this.timeout(10000)
  let accounts
  let deployer
  let bidder
  let anotherBidder
  let bid: Bid
  let bidContract

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts()

    deployer = accounts[ADDRESS_INDEXES.deployer]
    bidder = accounts[ADDRESS_INDEXES.bidder]
    anotherBidder = accounts[ADDRESS_INDEXES.anotherBidder]

    const creationParams = {
      from: deployer,
      gas: 6e6,
      gasPrice: 21e9
    }

    bid = new Bid({ accounts, artifacts: env.artifacts }) // should be artifacts

    bidContract = await bid.deploy({ txParams: creationParams })
  })

  it('should create bids', async function () {
    const { one, two } = BIDS
    const erc721 = bid.getERC721Contract()
    let order = await bidContract.getBidByToken(
      erc721.address,
      one.tokenId,
      one.index
    )
    expect(order[1]).to.be.equal(bidder)
    expect(order[2]).to.eq.BN(one.price)

    order = await bidContract.getBidByToken(
      erc721.address,
      two.tokenId,
      two.index
    )
    expect(order[1]).to.be.equal(anotherBidder)
    expect(order[2]).to.eq.BN(two.price)
  })

  it('should create more bids', async function () {
    const { one } = BIDS
    const erc721 = bid.getERC721Contract()
    let order = await bidContract.getBidByToken(
      erc721.address,
      one.tokenId,
      one.index
    )
    expect(order[1]).to.be.equal(bidder)
    expect(order[2]).to.eq.BN(one.price)

    await bid.createBids(
      erc721.address,
      [one.tokenId],
      ONE_ETH,
      one.duration,
      bidder
    )

    order = await bidContract.getBidByToken(
      erc721.address,
      one.tokenId,
      one.index
    )
    expect(order[1]).to.be.equal(bidder)
    expect(order[2]).to.eq.BN(ONE_ETH)
  })
})
