import storeWallets from '@renderer/store/store-wallets'
import axios from 'axios'
import DeployStore from '../store/store-deploy'
import storeDeploy from '../store/store-deploy'
import FolderState from '../store/store-folders'
import CodeEditor from '../ui/codeEditor'

declare global {
  interface Window {
    api: any
    electron: any
  }
}
export const fsSaveFile = async (path: string, data: string) => {
  const { folders } = FolderState

  const { autoCompile, startBuild } = DeployStore
  if (autoCompile) {
    startBuild(folders.path)
  }
  await window.api.fs.writeFileSync(path, data)
}
export async function getFolderPath() {
  const path = await window.electron.ipcRenderer.invoke('dialog:openDirectory')
  return path
}

export async function createZIP(
  path_: string,
  buildCode: string,
  deploy: boolean,
  wallet?: string,
  apiURL?: string,
  network?: string,
  deployConfig?: string,
) {
  return new Promise((resolve, reject) => {
    window.api
      .createZIP(path_)
      .then((zipData) => {
        const targetServerUrl = `https://api.hook.tools/${
          deploy ? 'deploy' : 'build'
        }`
        axios
          .post(targetServerUrl, {
            zipData,
            buildCode,
            deploy,
            wallet,
            apiURL,
            network,
            deployConfig,
          })
          .then(async (data) => {
            await window.api.unZip(path_, data.data.zipResp)
            await openFolder(path_)

            resolve(data.data)
          })
          .catch((error) => {
            reject(String(error.response.data))
          })
      })
      .catch((error) => console.log(error))
  })
}
const path = require('path')

async function getFileName(path, req) {
  return new Promise((resolve, reject) => {
    window.api.fs.readdir(path, (err, files) => {
      files.forEach((file) => {
        if (err) reject(err)
        if (file.split('.').pop() === req) {
          resolve(file)
        }
      })
      reject(null)
    })
  })
}

export async function deployWith() {
  const { folders } = FolderState
  const contractData = await getFileName(folders.path, 'abi')
  const abi = await window.api.fs.promises.readFile(
    path.join(folders.path, contractData),
    'utf-8',
  )

  const { deployConfig } = storeDeploy
  const targetServerUrl = `https://api.hook.tools/deploy`
  const response = await axios.post(targetServerUrl, {
    wallet: 'hookbuilders',
    abi,
    apiURL: 'https://testnet.waxsweden.org',
    deployConfig,
  })

  return response.data
}

async function readFolder(path: string) {
  try {
    const resp: string[] = await window.api.fs.readdirSync(path)
    const files:any[] = []
    for (const [i, element] of resp.entries()) {
      files[i] = await readFolder(`${path}/${element}`)
    }
    return {
      name: window.api.pathParse(path).base,
      path,
      tabs: [],
      isFolder: true,
      value: files
        .sort((a: any) => {
          if (a.isFolder) return -1
        })
        .filter((post: any) => post.name[0] !== '.'),
    }
  } catch {
    return {
      name: window.api.pathParse(path).base,
      value: [],
      path,
      tabs: [],
      codeEditor: CodeEditor,
    }
  }
}
export const openFolder = async (path) => {
  const { addFolder } = FolderState
  const resp = await readFolder(path)
  resp.value.sort((a) => {
    if (a.isFolder) return -1
  })
  addFolder(resp)
}
export const renameAll = (from: string, to: string) => {
  return new Promise((resolve, reject) => {
    window.api.fs.rename(from, to, (error) => {
      if (error) {
        reject(`Error with rename file: ${error}`)
      } else {
        resolve('success')
      }
    })
  })
}
export const readFileFS = async (path, name) => {
  await window.api.fs.readFile(`${path}`, 'utf8', (error, data) => {
    if (error) {
      console.error(error)
      return
    }
    const { addTab } = FolderState
    addTab({
      name,
      path,
      choose: true,
      data,
    })
  })
}
