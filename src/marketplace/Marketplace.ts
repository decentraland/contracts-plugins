import {
  Mana,
  Erc721,
  LISTING_PRICE,
  SIX_MONTHS_IN_SECONDS,
  TxParams
} from '../'

export class Marketplace {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  legacyNFT: Erc721
  mana: Mana
  marketplaceContract: any

  constructor({ accounts, artifacts }) {
    this.artifacts = artifacts
    this.accounts = accounts
  }

  async deploy(options: any) {
    const { mana, erc721, txParams } = options
    const { Marketplace } = this.artifacts

    this.txParams = txParams
    if (!mana) {
      this.mana = new Mana({
        artifacts: this.artifacts,
        accounts: this.accounts
      })
      await this.mana.deploy(options)
    } else {
      this.mana = mana
    }

    if (!erc721) {
      this.legacyNFT = new Erc721({
        artifacts: this.artifacts,
        accounts: this.accounts
      })
      await this.legacyNFT.deploy(options)
    } else {
      this.legacyNFT = erc721
    }

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
    const legacyNFTContract = this.getLegacyNFTContract()
    const endTime = Date.now() + SIX_MONTHS_IN_SECONDS
    return Promise.all([
      this.createOrders(
        legacyNFTContract.address,
        ['1'],
        LISTING_PRICE,
        endTime,
        this.accounts[1]
      ),
      this.createOrders(
        legacyNFTContract.address,
        ['2'],
        LISTING_PRICE,
        endTime,
        this.accounts[2]
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
