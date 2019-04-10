# Contracts Plugins

⚠️ Work in progress - Collaboration is accepted

⚠️ Buidler Tasks are work in progress

Contracts Plugins is a set of usefull classes to deploy Decentraland contracts for testing purposes.

# Table

- [Install](#install)
- [Get started](#get-started)
- [Addresses](#addresses)
- [Contracts](#contracts)
  - [MANA](#mana)
  - [ERC721](#erc721)
  - [Marketplace](#marketplace)
  - [Bid](#bid)

## Install

`npm i --save-dev contracts-plugins`

## Get started

To deploy your Decentraland fake contracts just import the contract you want to use and `deploy` it. Every contract is deployed within initial settings to let you focus **only** in testing your new contracts.

_exchange.spec.ts_

```typescript
import { Mana, ADDRESS_INDEXES } from 'contracts-plugins'

const BN = web3.utils.BN
const expect = require('chai').use(require('bn-chai')(BN)).expect

describe('Exchange', function() {
  let accounts
  let deployer
  let mana
  let manaContract

  beforeEach(async function() {
    accounts = await web3.eth.getAccounts()
    deployer = accounts[ADDRESS_INDEXES.deployer]

    mana = new Mana({ accounts, artifacts })
    manaContract = await mana.deploy({
      txParams: {
        from: deployer,
        gas: 6e6,
        gasPrice: 21e9
      }
    })
  })

  it('should set initial balances', async function() {
    for (let account of accounts) {
      let balance = await manaContract.balanceOf(account)
      expect(balance).to.eq.BN(web3.utils.toWei('1000', 'ether'))
    }
  })
})
```

Contracts could need other contract addresses to be deployed and be ready for testing as the [Marketplace contract](#marketplace).

## Addresses

The contracts allowed are based on the accounts from set when running ganache:

| index | name                  |
| ----- | --------------------- |
| 0     | deployer              |
| 1     | user                  |
| 2     | anotherUser           |
| 3     | operator              |
| 4     | anotherOperator       |
| 5     | updateOperator        |
| 6     | anotherUpdateOperator |
| 7     | buyer                 |
| 8     | anotherBuyer          |
| 9     | bidder                |
| 10    | anotherBidder         |
| 11    | hacker                |

Use ths [script](#link_al_script)

## Contracts

Every contract is deployed by the `deployer` account.

### MANA

Simulates Decentraland MANA contract

#### deploy

Deploy the MANA contract, set initial balances for all the accounts and return the contrcact reployed

```typescript
mana.deploy(options)
```

#### addBalances

Min `amount` into every account of `accounts`.

```typescript
mana.addBalances(accounts: string[], amount: string)
```

#### removeBalances

Remove balances from `accounts`.

```typescript
mana.removeBalances(accounts: string[])
```

#### getContract

Get the deployed MANA contract

```typescript
mana.getContract()
```

### ERC721

ERC721 generic contract

#### deploy

Deploy an ERC721 contract and mint initial tokens:

- `1` to [user](#addresses)
- `2` to [anotherUser](#addresses)

#### getContract

Get the deployed erc721 contract

### Marketplace

#### deploy

The marketplace contract needs to be initialized with an erc20 token as the accepted token
and an erc721 token as the legacyNFT (related to marketplace v1).
This contracts can be passed as properties of the deploy options. If not they will instanceated and deployed.

_options_

```typescript
type Marketplaceptions = {
  mana: Mana | null
  erc721: Erc721 | null
  txParams: TxParams
}
```
