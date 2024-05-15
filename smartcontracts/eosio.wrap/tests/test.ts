import { build, chainInit, walletInit } from 'eosio-testify'
import { describe, after } from 'mocha'

function generateRandomLetters() {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const length = 4

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

const token = generateRandomLetters()
const chain = new chainInit(
  'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
  'https://waxtestnet.greymass.com',
)
const wallet = new walletInit(
  '5JmvsVfJ68S7EaCUAmwAnWwJZG1hh7P3THbGXwDe3q8jKExWssu',
  'active',
  'hookbuilders',
  chain,
)

const wasmPath =
  '/Users/nikko/Desktop/github/github/EOSIO/smartcontracts/eosio.token/eosio.token.wasm'
const abiPath =
  '/Users/nikko/Desktop/github/github/EOSIO/smartcontracts/eosio.token/eosio.token.abi'

describe('Deploy contract', () => {
  it('Deploy contract', async () => {
    await build(
      '/Users/nikko/Desktop/github/github/EOSIO/smartcontracts/eosio.token',
      'eosio-cpp -abigen -I include -R ricardian -contract eosio.token -o eosio.token.wasm src/eosio.token.cpp',
    )

    await wallet.deployContract(abiPath, wasmPath)
  }).timeout(15000)
})

describe('Create token', async () => {
  it('create token', async () => {
    const data = await wallet.pushTransaction([
      {
        to: wallet.walletName,
        action: 'create',
        data: {
          issuer: wallet.walletName,
          maximum_supply: '1000.00000000 ' + token,
        },
      },
    ])
  }).timeout(10000)

  it('Check token in table', async () => {
    try {
      const data = await chain.getTableRows({
        code: wallet.walletName,
        scope: token,
        table: 'stat',
        lower_bound: '',
        upper_bound: '',
        index_position: '1',
        key_type: 'i64',
        limit: 10,
        reverse: false,
        json: true,
        show_payer: false,
      })
    } catch (e) {
      console.error(e?.message)
    }
  }).timeout(5000)
})

describe('Issue token', async () => {
  it('Issue Token', async () => {
    await wallet.pushTransaction([
      {
        to: wallet.walletName,
        action: 'issue',
        data: {
          to: wallet.walletName,
          quantity: '1000.00000000 ' + token,
          memo: '',
        },
      },
    ])
  })
})

describe('Transfer token', async () => {
  it('Transfer token', async () => {
    await wallet.pushTransaction([
      {
        to: wallet.walletName,
        action: 'transfer',
        data: {
          from: wallet.walletName,
          to: 'eosio.token',
          quantity: '1.00000000 TEST',
          memo: '',
        },
      },
    ])
  })
})

describe('Retire token', async () => {
  it('Retire func', async () => {
    await wallet.pushTransaction([
      {
        to: wallet.walletName,
        action: 'retire',
        data: {
          quantity: '1.00000000 TEST',
          memo: '0',
        },
      },
    ])
  })
})

after(async () => {
  wallet.cleanContract()
})
