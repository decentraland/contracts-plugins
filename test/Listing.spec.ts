import env from 'hardhat'

import { Listing, ADDRESS_INDEXES } from '../src'

const web3 = env['web3'] as any
const BN = web3.utils.BN
const expect = require('chai').use(require('bn-chai')(BN)).expect

describe('Listing', function () {
  this.timeout(10000)
  let accounts
  let deployer
  let listing: Listing

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts()
    deployer = accounts[ADDRESS_INDEXES.deployer]

    const creationParams = {
      from: deployer,
      gas: 6e6,
      gasPrice: 21e9
    }

    listing = new Listing({ accounts, artifacts: env.artifacts }) // should be artifacts

    await listing.deploy({ txParams: creationParams })
  })

  it('should be deployed', async function () {
    const erc721 = listing.getERC721Contract()
    const mana = listing.getMANAContract()
    const marketplace = listing.getMarketplaceContract()
    const bid = listing.getBidContract()

    expect(erc721.address).to.be.not.equal(undefined)
    expect(mana.address).to.be.not.equal(undefined)
    expect(marketplace.address).to.be.not.equal(undefined)
    expect(bid.address).to.be.not.equal(undefined)
  })
})
