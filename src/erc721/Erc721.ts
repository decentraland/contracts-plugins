import { TxParams, CreationParams, ERC721_TOKENS } from '../'
import { DeployOptions } from './types'

export class Erc721 {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  erc721Contract: any

  constructor(params: CreationParams) {
    Object.assign(this, params)
  }

  async deploy(options: DeployOptions) {
    const { txParams } = options
    const { ERC721 } = this.artifacts

    this.txParams = txParams
    this.erc721Contract = await ERC721.new(this.txParams)

    await this.mintInitialTokens()

    return this.erc721Contract
  }

  async mintInitialTokens() {
    const { one, two } = ERC721_TOKENS

    return Promise.all([
      this.mintTokens(this.accounts[one.owner], [one.id]),
      this.mintTokens(this.accounts[two.owner], [two.id])
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
