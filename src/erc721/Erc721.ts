import { TxParams } from '../'

export class Erc721 {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  erc721Contract: any

  constructor({ accounts, artifacts }) {
    this.artifacts = artifacts
    this.accounts = accounts
  }

  async deploy(options) {
    const { txParams } = options
    const { ERC721 } = this.artifacts

    this.txParams = txParams
    this.erc721Contract = await ERC721.new(this.txParams)

    await this.mintInitialTokens()

    return this.erc721Contract
  }

  async mintInitialTokens() {
    const [, user, anotherUser] = this.accounts

    return Promise.all([
      this.mintTokens(user, ['1']),
      this.mintTokens(anotherUser, ['2'])
    ])
  }

  async mintTokens(to: string, ids: string[]) {
    const contract = this.getContract()
    await Promise.all(ids.map(id => contract.mint(to, id, this.txParams)))
  }

  async authorize(address: string) {
    return Promise.all(
      this.accounts.map(account =>
        this.erc721Contract.setApprovalForAll(address, true, { from: account })
      )
    )
  }

  getContract() {
    return this.erc721Contract
  }
}
