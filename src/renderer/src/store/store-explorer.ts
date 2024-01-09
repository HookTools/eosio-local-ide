import { $api } from '@renderer/shared/api/api'
import axios from 'axios'
import { makeAutoObservable, computed } from 'mobx'
import storeWallets from './store-wallets'

interface Abi {
  actions: any[]
  structs: any[]
  tables: any[]
}

class Explorer {
  abi: Abi | undefined
  wallet: string | null
  tableData: any[] = []
  result: string
  constructor() {
    makeAutoObservable(this)
    this.wallet = null
    this.result = ''
  }

  getContract = async (wallet: string) => {
    const { network, waxMainnetRPC, waxTestnetRPC } = storeWallets
    try {
      const response = await $api(
        network === 'mainnet' ? waxMainnetRPC : waxTestnetRPC,
      ).post(`v1/chain/get_abi`, {
        account_name: wallet,
      })
      console.log(response.data.abi)
      this.abi = response.data.abi
      this.wallet = response.data.account_name
    } catch (error) {
      console.log(error)
    }
  }

  getTables = async (
    table: string,
    scope: string,
    lower_bound: string | null = '',
    upper_bound: string | null = '',
    limit = 10,
  ) => {
    const { network, waxMainnetRPC, waxTestnetRPC } = storeWallets
    const response = await $api(
      network === 'mainnet' ? waxMainnetRPC : waxTestnetRPC,
    ).post(`v1/chain/get_table_rows`, {
      code: this.wallet,
      scope,
      table,
      lower_bound,
      upper_bound,
      index_position: 1,
      key_type: 'i64',
      limit,
      reverse: false,
      json: true,
      show_payer: false,
    })
    this.tableData = response.data.rows
  }

  getActionData = (name: string) => {
    const actionData = this.abi!.actions.find((post) => post.name === name)
    const structData = this.abi!.structs.find((post) => post.name === name)
    return { ...actionData, ...structData }
  }
}

export default new Explorer()
