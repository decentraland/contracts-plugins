import { Mana, Erc721, ORDERS, TxParams, CreationParams } from '../'
import { DeployOptions } from './types'

export class Marketplace {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  legacyNFT: Erc721
  mana: Mana
  marketplaceContract: any

  constructor(params: CreationParams) {
    Object.assign(this, params)
  }

  async deploy(options: DeployOptions) {
    const { mana, erc721, txParams } = options
    const { Marketplace } = this.artifacts

    this.txParams = txParams

    // Deploy Mana
    if (!mana) {
      this.mana = new Mana({
        artifacts: this.artifacts,
        accounts: this.accounts
      })
      await this.mana.deploy(options)
    } else {
      this.mana = mana
    }

    // Deploy Erc721
    if (!erc721) {
      this.legacyNFT = new Erc721({
        artifacts: this.artifacts,
        accounts: this.accounts
      })
      await this.legacyNFT.deploy(options)
    } else {
      this.legacyNFT = erc721
    }

    // Deploy Marketplace
    this.marketplaceContract = await Marketplace.new(txParams)

    await this.authorize()
    await this.initialize()
    await this.createInitialOrders()

    return this.marketplaceContract
  }

  async initialize() {
    const manaContract = this.getMANAContract()
    const legacyNFTContract = this.getLegacyNFTContract()

    await this.marketplaceContract.methods[
      'initialize(address,address,address)'
    ](
      manaContract.address,
      legacyNFTContract.address,
      this.txParams.from,
      this.txParams
    )
  }

  async authorize() {
    const address = this.marketplaceContract.address

    return Promise.all([
      this.mana.authorize(address),
      this.legacyNFT.authorize(address)
    ])
  }

  async createInitialOrders() {
    const { one, two } = ORDERS
    const legacyNFTContract = this.getLegacyNFTContract()

    return Promise.all([
      this.createOrders(
        legacyNFTContract.address,
        [one.tokenId],
        one.price,
        Date.now() + one.duration,
        this.accounts[one.seller]
      ),
      this.createOrders(
        legacyNFTContract.address,
        [two.tokenId],
        two.price,
        Date.now() + two.duration,
        this.accounts[two.seller]
      )
    ])
  }

  async createOrders(
    tokenAddress: string,
    tokenIds: string[],
    price: string,
    endTime: number,
    from: string
  ) {
    const contract = this.getContract()
    return Promise.all(
      tokenIds.map(tokenId =>
        contract.methods['createOrder(address,uint256,uint256,uint256)'](
          tokenAddress,
          tokenId,
          price,
          endTime,
          { from }
        )
      )
    )
  }

  getMANAContract() {
    return this.mana.getContract()
  }

  getLegacyNFTContract() {
    return this.legacyNFT.getContract()
  }

  getContract() {
    return this.marketplaceContract
  }
}
