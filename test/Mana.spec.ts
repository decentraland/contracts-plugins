import env from 'hardhat'

import {
  Mana,
  INITIAL_VALUE,
  INCREASED_INITIAL_VALUE,
  APPROVAL_VALUE,
  ADDRESS_INDEXES
} from '../src'

const web3 = env['web3'] as any
const BN = web3.utils.BN
const expect = require('chai').use(require('bn-chai')(BN)).expect

describe('MANA', function () {
  let accounts
  let deployer
  let mana: Mana
  let manaContract

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts()
    deployer = accounts[ADDRESS_INDEXES.deployer]

    mana = new Mana({ accounts, artifacts: env.artifacts })
    manaContract = await mana.deploy({
      txParams: {
        from: deployer,
        gas: 6e6,
        gasPrice: 21e9
      }
    })
  })

  it('should set initial balances', async function () {
    for (let account of accounts) {
      let balance = await manaContract.balanceOf(account)
      expect(balance).to.eq.BN(INITIAL_VALUE)
    }
  })

  it('should set increase initial balances', async function () {
    await mana.addBalances(accounts, INITIAL_VALUE)

    for (let account of accounts) {
      let balance = await manaContract.balanceOf(account)
      expect(balance).to.eq.BN(INCREASED_INITIAL_VALUE)
    }
  })

  it('should clean balance after prev test', async function () {
    for (let account of accounts) {
      let balance = await manaContract.balanceOf(account)
      expect(balance).to.eq.BN(INITIAL_VALUE)
    }
  })

  it('should burn', async function () {
    await mana.removeBalances(accounts)

    for (let account of accounts) {
      let balance = await manaContract.balanceOf(account)
      expect(balance).to.eq.BN(0)
    }
  })

  it('should authorize', async function () {
    for (const account of accounts) {
      const allowance = await manaContract.allowance(
        account,
        manaContract.address
      )
      expect(allowance).to.eq.BN(0)
    }

    await mana.authorize(manaContract.address)

    for (const account of accounts) {
      const allowance = await manaContract.allowance(
        account,
        manaContract.address
      )
      expect(allowance).to.eq.BN(APPROVAL_VALUE)
    }
  })
})
