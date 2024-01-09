import { createZIP } from '@renderer/shared/fs'
import { makeAutoObservable } from 'mobx'
import storeFolders from './store-folders'
import storeWallets from './store-wallets'

interface DeployModal {
  amount: number
  current: number
  title: string
  isSuccess: boolean
}

class DeployStore {
  buildCode: string
  build: 'success' | 'errors' | 'warnings' | 'loading' | null = null
  response: string | null = null
  autoCompile: boolean
  hideWarning: boolean

  error = null
  errorIsVisible = false
  deployConfig: 'default' | 'clean' | 'migrate' | 'tests'

  deployModalData: DeployModal | null = null

  constructor() {
    makeAutoObservable(this)
    this.autoCompile = localStorage.getItem('autocompile') === 'true'
    this.hideWarning = localStorage.getItem('hidewarnings') === 'true'
    this.deployConfig = localStorage.getItem('deployconfig')
      ? localStorage.getItem('deployconfig')
      : 'default'
    const buildCode = localStorage.getItem('buildCode')
    this.buildCode =
      buildCode ||
      'eosio-cpp -abigen -I ./include -contract newcontract -o newcontract.wasm'
  }

  setDeployConfig = (data: typeof this.deployConfig) => {
    this.deployConfig = data
    localStorage.setItem('deployconfig', data)
  }

  setErrorIsVisible = (bool: boolean) => {
    this.errorIsVisible = bool
  }

  startBuild = async (path: string) => {
    this.error = null
    this.build = 'loading'
    createZIP(path, this.buildCode, false)
      .then(() => {
        this.buildSuccess()
      })
      .catch((error) => {
        this.buildError(error)
      })
  }

  buildSuccess = () => {
    this.build = 'success'
  }

  buildError = (e) => {
    this.build = 'errors'
    this.errorIsVisible = true
    this.error = e

    this.deployModalData = null
  }

  closeModalData = () => {
    if (this.deployModalData.isSuccess) {
      this.deployModalData = null
    }
  }

  deployModalDataHandler = (
    current: number,
    title: string,
    isSuccess = false,
    amount: undefined | number = undefined,
  ) => {
    this.deployModalData = {
      ...this.deployModalData,
      current,
      title,
      isSuccess,
      amount: amount ? amount : Number(this?.deployModalData?.amount),
    }

    this.error = null
    this.build = 'loading'
  }

  deploy = async (deployConfig: string) => {
    let amount: number
    switch (this.deployConfig) {
      case 'default':
        amount = 2
        break
      case 'clean':
        amount = 4
        break
      case 'migrate':
        amount = 6
        break
      default:
        amount = 0
    }
    this.deployModalData = {
      amount,
      current: 1,
      title: 'Waiting build....',
      isSuccess: false,
    }

    this.error = null
    this.build = 'loading'

    const { deployContract } = storeWallets
    const { folders } = storeFolders
    if (this.deployConfig === 'clean') {
      // acceptMsigWithClean(response)
    } else if (deployConfig === 'migrate') {
      // acceptMsigWithMigrate(response)
    } else {
      const contractData = await window.api.getDeployData(folders.path)
      deployContract(contractData.abi, contractData.wasm)
    }

    // return response
  }

  setBuildCode = (data: string) => {
    localStorage.setItem('buildCode', data)
    this.buildCode = data
  }

  setAutoCompile = (bool: boolean) => {
    this.autoCompile = bool
    localStorage.setItem('autocompile', String(bool))
  }

  setHideWarning = (bool: boolean) => {
    this.hideWarning = bool
    localStorage.setItem('hidewarnings', String(bool))
  }

  setDeployCode = (data: string) => {
    this.deployCode = data
  }

  getCompileSuccses = () => {
    return {
      build: this.build,
      errors: 1,
    }
  }
}
export default new DeployStore()
