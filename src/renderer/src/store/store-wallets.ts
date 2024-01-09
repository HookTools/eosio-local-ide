import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import { makeAutoObservable, observable } from 'mobx'
// eslint-disable-next-line import/no-cycle
import storeDeploy from './store-deploy'
import { sleep } from '@renderer/shared/sleep'
import { deployWith } from '@renderer/shared/fs'

export interface Wallets {
  wallet: string
  permission?: string
  privateKey?: string
  network?: 'testnet' | 'mainnet'
}
const transport = new AnchorLinkBrowserTransport()

class StoreWallet {
  wallets: Wallets[]
  @observable waxMainnetRPC: string
  @observable waxTestnetRPC: string
  @observable network: 'testnet' | 'mainnet'
  anchor: string | null
  connect: 'anchor' | 'key'
  link: any = new AnchorLink({
    transport,
    chains: [
      {
        chainId:
          'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
        nodeUrl: 'https://waxtestnet.greymass.com',
      },
    ],
  })

  wallet: Wallets | null
  constructor() {
    makeAutoObservable(this)
    this.wallet = localStorage.getItem('wallet')
      ? JSON.parse(localStorage.getItem('wallet') as string)
      : null
    this.waxMainnetRPC = 'https://wax.greymass.com/'
    this.waxTestnetRPC = 'https://waxtestnet.greymass.com'
    this.wallets = localStorage.getItem('wallets')
      ? JSON.parse(localStorage.getItem('wallets') as string)
      : []
    this.network =
      (localStorage.getItem('network') as 'mainnet' | 'testnet' | null) ||
      'testnet'
    this.anchor = null
    if (this.network === 'mainnet') {
      this.link = new AnchorLink({
        transport,
        chains: [
          {
            chainId:
              '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
            nodeUrl: 'https://wax.greymass.com',
          },
        ],
      })
    } else {
      this.link = new AnchorLink({
        transport,
        chains: [
          {
            chainId:
              'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
            nodeUrl: 'https://waxtestnet.greymass.com',
          },
        ],
      })
    }
    this.connect = localStorage.getItem('connect') || 'anchor'
  }

  setConnect = (data: 'anchor' | 'key') => {
    this.connect = data
    localStorage.setItem('connect', data)
    if (data === 'anchor') {
      this.wallet = this.anchor ? { wallet: this.anchor } : null
      localStorage.setItem('wallet', JSON.stringify(this.wallet))
    } else {
      this.wallet = null
      localStorage.removeItem('wallet')
    }
  }

  setWallet = (data: Wallets | null) => {
    this.wallet = data
    if (this.wallet) {
      localStorage.setItem('wallet', JSON.stringify(this.wallet))
    } else {
      localStorage.removeItem('wallet')
    }
  }

  setWaxMainnetRPC = (RPC: string) => {
    this.waxMainnetRPC = RPC
    localStorage.setItem('waxMainnetRPC', RPC)
  }

  setWaxTestnnetRPC = (RPC: string) => {
    this.waxTestnetRPC = RPC
    localStorage.setItem('waxTestnetRPC', RPC)
  }

  changeNetWork = (network: 'mainnet' | 'testnet') => {
    this.network = network
    this.anchor = null
    this.link.restoreSession('mydapp').then((session: any) => {
      if (session) {
        session.remove()
        this.setWallet(null)
        this.setAnchor(null)
      }
    })
    localStorage.setItem('network', network)
    if (network === 'mainnet') {
      this.link = new AnchorLink({
        transport,
        chains: [
          {
            chainId:
              '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
            nodeUrl: 'https://wax.greymass.com',
          },
        ],
      })
    } else {
      this.link = new AnchorLink({
        transport,
        chains: [
          {
            chainId:
              'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
            nodeUrl: 'https://waxtestnet.greymass.com',
          },
        ],
      })
    }
  }

  setAnchor = (wallet: string | null) => {
    this.anchor = wallet
  }

  addPrivate = (data: Wallets) => {
    this.wallets = [...this.wallets, data]
    localStorage.setItem('wallets', JSON.stringify(this.wallets))
  }

  removePrivate = (privateKey: string) => {
    this.wallets = this.wallets.filter(
      (data) => data.privateKey !== privateKey && this.network === data.network,
    )
    if (this.wallets.length === 0) {
      localStorage.removeItem('wallets')
    } else {
      localStorage.setItem('wallets', JSON.stringify(this.wallets))
    }
  }

  acceptMsig = async (abiData, wasmData, wallet) => {
    await this.link.restoreSession('mydapp').then(async (session: any) => {
      const actions: any[] = [
        {
          account: 'eosio',
          name: 'setcode',
          authorization: [session.auth],
          data: {
            account: String(session.auth.actor),
            vmtype: 0,
            vmversion: 0,
            code: wasmData,
            memo: '',
          },
        },
        {
          account: 'eosio',
          name: 'setabi',
          authorization: [session.auth],
          data: {
            account: String(session.auth.actor),
            abi: abiData,
            memo: '',
          },
        },
      ]
      const result = await session.transact({ actions })
      return result
    })
  }

  cleanContract = async (wallet) => {
    await this.link.restoreSession('mydapp').then(async (session: any) => {
      const actions: any[] = [
        {
          account: wallet,
          name: 'cleantable',
          authorization: [session.auth],
          data: {},
        },
      ]
      console.log(actions)

      const result = await session.transact({ actions })
      return result
    })
  }

  deployContract = async (abiData, wasmData) => {
    let amount
    const { deployModalDataHandler, deployConfig } = storeDeploy
    console.log(123)
    switch (deployConfig) {
      case 'default':
        amount = 1
        break
      case 'clean':
        amount = 3
        break
      case 'migrate':
        amount = 5
        break
      default:
        amount = 0
    }
    try {
      if (this!.wallet!.privateKey) {
        if (deployConfig === 'default') {
          deployModalDataHandler(1, 'Deploy contract...', false, amount)
          await window.api.deployPrivate(
            abiData,
            wasmData,
            JSON.stringify(this.wallet),
            this.RPC,
          )
        } else if (deployConfig === 'clean') {
          deployModalDataHandler(1, 'Build contract...', false, amount)

          const data = await deployWith()
          deployModalDataHandler(2, 'Clean contract...')

          await window.api.deployPrivate(
            data[0].abi,
            data[0].wasm,
            JSON.stringify(this.wallet),
            this.RPC,
          )
          deployModalDataHandler(3, 'Deploy contract...')
          await window.api.deployPrivate(
            abiData,
            wasmData,
            JSON.stringify(this.wallet),
            this.RPC,
          )
        } else if (deployConfig === 'migrate') {
          deployModalDataHandler(1, 'Build contract...')
          const data = await deployWith()
          deployModalDataHandler(2, 'Clean contract...')
          await window.api.deployPrivate(
            data[0].abi,
            data[0].wasm,
            JSON.stringify(this.wallet),
            this.RPC,
          )
          deployModalDataHandler(3, 'Migrate contract...')

          await window.api.deployPrivate(
            data[1].abi,
            data[1].wasm,
            JSON.stringify(this.wallet),
            this.RPC,
          )
          deployModalDataHandler(4, 'Deploy contract...')
          await window.api.deployPrivate(
            abiData,
            wasmData,
            JSON.stringify(this.wallet),
            this.RPC,
          )
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (deployConfig === 'default') {
          deployModalDataHandler(1, 'Deploy contract...', false, amount)

          await this.acceptMsig(abiData, wasmData, JSON.stringify(this.wallet))
        } else if (deployConfig === 'clean') {
          deployModalDataHandler(1, 'Deploy contract...', false, amount)

          const data = await deployWith()
          deployModalDataHandler(2, 'Clean contract...', false, amount)

          await this.acceptMsig(
            data[0].abi,
            data[0].wasm,
            JSON.stringify(this.wallet),
          )
          deployModalDataHandler(3, 'Deploy contract...', false, amount)
          await this.acceptMsig(abiData, wasmData, JSON.stringify(this.wallet))
        } else if (deployConfig === 'migrate') {
          deployModalDataHandler(1, 'Build contract...', false, amount)
          const data = await deployWith()
          deployModalDataHandler(2, 'Clean contract...', false, amount)
          await this.acceptMsig(
            data[0].abi,
            data[0].wasm,
            JSON.stringify(this.wallet),
          )
          deployModalDataHandler(3, 'Migrate contract...', false, amount)

          await this.acceptMsig(
            data[1].abi,
            data[1].wasm,
            JSON.stringify(this.wallet),
          )
          deployModalDataHandler(4, 'Deploy contract...', false, amount)
          await this.acceptMsig(abiData, wasmData, JSON.stringify(this.wallet))
        }
      }
      deployModalDataHandler(10, 'Success', true)
    } catch (error) {
      storeDeploy.buildError(String(error))
      return
    }
    storeDeploy.buildSuccess()
  }

  acceptMsigPrivate = async (data: string[]) => {
    const { deployModalDataHandler } = storeDeploy
    deployModalDataHandler(2, 'Deploy contract...')
    try {
      if (this.wallet.privateKey) {
        await window.api.acceptMsigPrivate(
          data[0],
          JSON.stringify(this.wallet),
          this.RPC,
        )
        deployModalDataHandler(10, 'Success', true)
      } else {
        await this.acceptMsig(this.wallet.wallet, data[0])
        deployModalDataHandler(10, 'Success', true)
      }
    } catch (error) {
      storeDeploy.buildError(String(error))
      return
    }
    storeDeploy.buildSuccess()
  }

  get RPC() {
    return this.network === 'mainnet' ? this.waxMainnetRPC : this.waxTestnetRPC
  }

  acceptMsigWithClean = async (data: string[]) => {
    const { deployModalDataHandler } = storeDeploy
    deployModalDataHandler(2, 'Deploy clean contract...')
    try {
      if (this.wallet.privateKey) {
        await window.api.acceptMsigPrivate(
          data[0],
          JSON.stringify(this.wallet),
          this.RPC,
        )
        deployModalDataHandler(3, 'Clean contract...')

        await sleep(1)
        await window.api.cleanContract(JSON.stringify(this.wallet), this.RPC)
        deployModalDataHandler(4, 'Deploy contract...')

        await sleep(1)
        await window.api.acceptMsigPrivate(
          data[1],
          JSON.stringify(this.wallet),
          this.RPC,
        )
        deployModalDataHandler(10, 'Success', true)
      } else {
        await this.acceptMsig(this.wallet.wallet, data[0])
        deployModalDataHandler(3, 'Clean contract...')
        await sleep(1)
        await this.cleanContract(this.wallet.wallet)
        deployModalDataHandler(4, 'Deploy contract...')
        await sleep(1)
        await this.acceptMsig(this.wallet.wallet, data[1])
        deployModalDataHandler(10, 'Success', true)
      }
    } catch (error) {
      storeDeploy.buildError(String(error))
      return
    }
    storeDeploy.buildSuccess()
  }

  acceptMsigWithMigrate = async (data: string[]) => {
    const { deployModalDataHandler } = storeDeploy
    deployModalDataHandler(2, 'Deploy first migrate contract...')
    try {
      if (this.wallet?.privateKey) {
        await window.api.acceptMsigPrivate(
          data[0],
          JSON.stringify(this.wallet),
          this.RPC,
        )
        deployModalDataHandler(3, 'Migrate contract...')

        await sleep(1)
        await window.api.cleanContract(JSON.stringify(this.wallet), this.RPC)
        deployModalDataHandler(4, 'Deploy second contract...')

        await window.api.acceptMsigPrivate(
          data[1],
          JSON.stringify(this.wallet),
          this.RPC,
        )
        deployModalDataHandler(5, 'Migrate contract...')

        await sleep(1)
        await window.api.cleanContract(JSON.stringify(this.wallet), this.RPC)
        deployModalDataHandler(6, 'Deploy finally contract...')

        await sleep(1)
        await window.api.acceptMsigPrivate(
          data[2],
          JSON.stringify(this.wallet),
          this.RPC,
        )
        deployModalDataHandler(10, 'Success', true)
      } else {
        await this.acceptMsig(this.wallet!.wallet, data[0])
        deployModalDataHandler(3, 'Migrate contract...')
        await sleep(1)
        await this.cleanContract(this.wallet!.wallet)
        deployModalDataHandler(4, 'Deploy second contract...')
        await sleep(1)

        await this.acceptMsig(this.wallet!.wallet, data[1])
        deployModalDataHandler(5, 'Migrate contract...')
        await sleep(1)
        await this.cleanContract(this.wallet!.wallet)
        deployModalDataHandler(6, 'Deploy finally contract...')
        await sleep(1)

        await this.acceptMsig(this.wallet!.wallet, data[2])
        deployModalDataHandler(10, 'Success', true)
      }
    } catch (error) {
      storeDeploy.buildError(String(error))
      return
    }
    storeDeploy.buildSuccess()
  }
}
export default new StoreWallet()
