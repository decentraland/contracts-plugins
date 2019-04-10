import { Marketplace, Bid, Erc721, Mana, TxParams } from '../'

export class Listing {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  erc721: Erc721
  mana: Mana
  marketplace: Marketplace
  bid: Bid

  constructor({ accounts, artifacts }) {
    this.artifacts = artifacts
    this.accounts = accounts
  }

  async deploy(options: any) {
    const { mana, erc721, txParams } = options

    const params = {
      artifacts: this.artifacts,
      accounts: this.accounts
    }

    this.txParams = txParams
    if (!mana) {
      this.mana = new Mana(params)
      await this.mana.deploy(options)
    } else {
      this.mana = mana
    }

    if (!erc721) {
      this.erc721 = new Erc721(params)
      await this.erc721.deploy(options)
    } else {
      this.erc721 = erc721
    }

    this.marketplace = new Marketplace(params)
    await this.marketplace.deploy({
      mana: this.mana,
      erc721: this.erc721,
      txParams
    })

    this.bid = new Bid(params)
    await this.bid.deploy({ mana: this.mana, erc721: this.erc721, txParams })
  }

  getMANAContract() {
    return this.mana.getContract()
  }

  getERC721Contract() {
    return this.erc721.getContract()
  }

  getMarketplaceContract() {
    return this.marketplace.getContract()
  }

  getBidContract() {
    return this.bid.getContract()
  }
}
