import { INITIAL_VALUE, APPROVAL_VALUE, TxParams, CreationParams } from '../'
import { DeployOptions } from './types'

export class Mana {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  manaContract: any
  fakeAccount = '0x0000000000000000000000000000000000000001' // OpCode

  constructor(params: CreationParams) {
    Object.assign(this, params)
  }

  async deploy(options: DeployOptions) {
    const { txParams } = options
    const { MANA } = this.artifacts

    this.txParams = txParams
    this.manaContract = await MANA.new(txParams)

    await this.setInitialBalances()
    return this.manaContract
  }

  async setInitialBalances() {
    await this.addBalances(this.accounts, INITIAL_VALUE)
  }

  async addBalances(accounts: string[], amount: string) {
    const { manaContract, txParams } = this
    await Promise.all(
      accounts.map(account => manaContract.mint(account, amount, txParams))
    )
  }

  async removeBalances(accounts: string[]) {
    return Promise.all(
      accounts.map(async account => {
        const balance = await this.manaContract.balanceOf(account)

        return this.manaContract.transfer(this.fakeAccount, balance, {
          from: account
        })
      })
    )
  }

  async authorize(address: string) {
    return Promise.all(
      this.accounts.map(account =>
        this.manaContract.approve(address, APPROVAL_VALUE, { from: account })
      )
    )
  }

  getContract() {
    return this.manaContract
  }
}
