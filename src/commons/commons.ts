import Web3 from 'web3'

const web3 = new Web3()

// Wei Values
export const ONE_ETH = web3.utils.toWei('1', 'ether')
export const INITIAL_VALUE = web3.utils.toWei('1000', 'ether')
export const INCREASED_INITIAL_VALUE = web3.utils.toWei('2000', 'ether')
export const APPROVAL_VALUE = web3.utils.toWei('1000000000000', 'ether')
export const LISTING_PRICE = web3.utils.toWei('10', 'ether')

// Times
export const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 30 * 6

// Addresses
export const ADDRESS_INDEXES = {
  deployer: 0,
  user: 1,
  anotherUser: 2,
  operator: 3,
  anotherOperator: 4,
  updateOperator: 5,
  anotherUpdateOperator: 6,
  buyer: 7,
  anotherBuyer: 8,
  bidder: 9,
  anotherBidder: 10,
  hacker: 11
}

// ERC721 tokens
export const ERC721_TOKENS = {
  one: { id: '1', owner: ADDRESS_INDEXES.user },
  two: { id: '2', owner: ADDRESS_INDEXES.anotherUser }
}

// Orders
export const ORDERS = {
  one: {
    tokenId: '1',
    seller: ADDRESS_INDEXES.user,
    price: LISTING_PRICE,
    duration: SIX_MONTHS_IN_SECONDS
  },
  two: {
    tokenId: '2',
    seller: ADDRESS_INDEXES.anotherUser,
    price: LISTING_PRICE,
    duration: SIX_MONTHS_IN_SECONDS
  }
}

// Bids
export const BIDS = {
  one: {
    tokenId: '1',
    bidder: ADDRESS_INDEXES.bidder,
    price: LISTING_PRICE,
    duration: SIX_MONTHS_IN_SECONDS,
    index: 0
  },
  two: {
    tokenId: '2',
    bidder: ADDRESS_INDEXES.anotherBidder,
    price: LISTING_PRICE,
    duration: SIX_MONTHS_IN_SECONDS,
    index: 0
  }
}
