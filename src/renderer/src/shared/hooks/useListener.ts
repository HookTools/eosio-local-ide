import storeDeploy from '@renderer/store/store-deploy'
import storeFolders from '@renderer/store/store-folders'
import storeWallets from '@renderer/store/store-wallets'
import { observer, useObserver } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'

export const useListener = () => {
  const ipc = window.electron.ipcRenderer
  const { buildSuccess, buildError, setBuildCode } = storeDeploy
  const { folders } = storeFolders

  useEffect(() => {
    const contract = window.api.pathParse(folders.path).base
    setBuildCode(
      `eosio-cpp -abigen -I include -R ricardian -contract ${contract} -o ${contract}.wasm src/${contract}.cpp`,
    )
  }, [folders.path])
}
