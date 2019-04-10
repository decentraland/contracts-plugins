import {
  Mana,
  Erc721,
  LISTING_PRICE,
  SIX_MONTHS_IN_SECONDS,
  TxParams
} from '../'

export class Bid {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  erc721: Erc721
  mana: Mana
  bidContract: any

  constructor({ accounts, artifacts }) {
    this.artifacts = artifacts
    this.accounts = accounts
  }

  async deploy(options: any) {
    const { mana, erc721, txParams } = options
    const { Bid } = this.artifacts

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
      this.erc721 = new Erc721({
        artifacts: this.artifacts,
        accounts: this.accounts
      })
      await this.erc721.deploy(options)
    } else {
      this.erc721 = erc721
    }

    const manaContract = this.getMANAContract()
    this.bidContract = await Bid.new(
      manaContract.address,
      txParams.from,
      txParams
    )

    await this.authorize()
    await this.createInitialBids()

    return this.bidContract
  }

  async authorize() {
    return this.mana.authorize(this.bidContract.address)
  }

  async createInitialBids() {
    const legacyNFTContract = this.getERC721Contract()

    return Promise.all([
      this.createBids(
        legacyNFTContract.address,
        ['1'],
        LISTING_PRICE,
        SIX_MONTHS_IN_SECONDS,
        this.accounts[9]
      ),
      this.createBids(
        legacyNFTContract.address,
        ['2'],
        LISTING_PRICE,
        SIX_MONTHS_IN_SECONDS,
        this.accounts[10]
      )
    ])
  }

  async createBids(
    tokenAddress: string,
    tokenIds: string[],
    price: string,
    endTime: number,
    from: string
  ) {
    const contract = this.getContract()
    return Promise.all(
      tokenIds.map(tokenId =>
        contract.methods['placeBid(address,uint256,uint256,uint256)'](
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

  getERC721Contract() {
    return this.erc721.getContract()
  }

  getContract() {
    return this.bidContract
  }
}
