import { Erc721 } from '../src'

const web3 = global['web3']
const BN = web3.utils.BN
const expect = require('chai').use(require('bn-chai')(BN)).expect

describe('ERC721', function() {
  let accounts
  let deployer
  let user
  let anotherUser
  let erc721: Erc721
  let erc721Contract

  beforeEach(async function() {
    accounts = await web3.eth.getAccounts()
    deployer = accounts[0]
    user = accounts[1]
    anotherUser = accounts[2]

    erc721 = new Erc721({ accounts, artifacts: global })
    erc721Contract = await erc721.deploy({
      txParams: {
        from: deployer,
        gas: 6e6,
        gasPrice: 21e9
      }
    })
  })

  it('should mint tokens', async function() {
    let owner = await erc721Contract.ownerOf(1)
    expect(owner).to.be.equal(user)

    owner = await erc721Contract.ownerOf(2)
    expect(owner).to.be.equal(anotherUser)
  })

  it('should mint more tokens', async function() {
    await erc721.mintTokens(user, ['3', '4'])

    let owner = await erc721Contract.ownerOf(1)
    expect(owner).to.be.equal(user)

    owner = await erc721Contract.ownerOf(3)
    expect(owner).to.be.equal(user)

    owner = await erc721Contract.ownerOf(4)
    expect(owner).to.be.equal(user)
  })

  it('should authorize', async function() {
    for (const account of accounts) {
      const isApproved = await erc721Contract.isApprovedForAll(
        account,
        erc721Contract.address
      )
      expect(isApproved).to.be.equal(false)
    }

    await erc721.authorize(erc721Contract.address)

    for (const account of accounts) {
      const isApproved = await erc721Contract.isApprovedForAll(
        account,
        erc721Contract.address
      )
      expect(isApproved).to.be.equal(true)
    }
  })
})
