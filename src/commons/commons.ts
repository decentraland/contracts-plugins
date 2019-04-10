import Web3 = require('web3')

const web3 = new Web3()

// Wei Values
export const ONE_ETH = web3.utils.toWei('1', 'ether')
export const INITIAL_VALUE = web3.utils.toWei('1000', 'ether')
export const INCREASED_INITIAL_VALUE = web3.utils.toWei('2000', 'ether')
export const APPROVAL_VALUE = web3.utils.toWei('1000000000000', 'ether')
export const LISTING_PRICE = web3.utils.toWei('10', 'ether')

// Times
export const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 30 * 6

// ERC721 tokens
export const TOKEN_IDS = {
  one: { id: '1', owner: 'user' },
  two: { id: '2', owner: 'anotherUser' }
}

// Marketplace orders
export const MARKETPLACE_ORDERS = {
  one: { id: '1', seller: 'user', price: LISTING_PRICE },
  two: { id: '2', owner: 'anotherUser', price: LISTING_PRICE }
}

// export const getCreationParams({accounts}) {
//   if (!accounts) {
//     throw new Error(
//       'Accounts is undefined. Please add load-addresses tasks before this one'
//     )
//   }

//   const params = {
//     from: accounts.deployer,
//     gas: 6e6,
//     gasPrice: 21e9
//   }
// }
