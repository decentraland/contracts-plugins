import { Marketplace, Bid, Erc721, Mana, TxParams, CreationParams } from '../'
import { DeployOptions } from './types'

export class Listing {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  erc721: Erc721
  mana: Mana
  marketplace: Marketplace
  bid: Bid

  constructor(params: CreationParams) {
    Object.assign(this, params)
  }

  async deploy(options: DeployOptions) {
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

  async setFees(fee: number) {
    const marketplaceContract = this.getMarketplaceContract()
    const bidContract = this.getBidContract()

    await Promise.all([
      marketplaceContract.setOwnerCutPerMillion(fee, this.txParams),
      bidContract.setOwnerCutPerMillion(fee, this.txParams)
    ])
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

  getContracts() {
    return {
      manaContract: this.getMANAContract(),
      erc721Contract: this.getERC721Contract(),
      marketplaceContract: this.getMarketplaceContract(),
      bidContract: this.getBidContract()
    }
  }
}
