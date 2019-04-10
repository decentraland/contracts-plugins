import { Mana, Erc721, BIDS, TxParams, CreationParams } from '../'
import { DeployOptions } from './types'

export class Bid {
  accounts: string[]
  artifacts: any
  txParams: TxParams
  erc721: Erc721
  mana: Mana
  bidContract: any

  constructor(params: CreationParams) {
    Object.assign(this, params)
  }

  async deploy(options: DeployOptions) {
    const { mana, erc721, txParams } = options
    const { Bid } = this.artifacts

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
      this.erc721 = new Erc721({
        artifacts: this.artifacts,
        accounts: this.accounts
      })
      await this.erc721.deploy(options)
    } else {
      this.erc721 = erc721
    }

    const manaContract = this.getMANAContract()

    // Deploy Bid
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
    const { one, two } = BIDS
    const legacyNFTContract = this.getERC721Contract()

    return Promise.all([
      this.createBids(
        legacyNFTContract.address,
        [one.tokenId],
        one.price,
        one.duration,
        this.accounts[one.bidder]
      ),
      this.createBids(
        legacyNFTContract.address,
        [two.tokenId],
        two.price,
        two.duration,
        this.accounts[two.bidder]
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
