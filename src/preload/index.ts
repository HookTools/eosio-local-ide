/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, dialog } from 'electron'
import fetch from 'node-fetch'
import { Api, JsonRpc, RpcError, Serialize } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { TextDecoder, TextEncoder } from 'util' 
import fs from 'fs'
import path from 'path'

const deployPrivate = async (
  abiData: string,
  wasmData: string,
  wallet_,
  rpcURL: string,
) => {
  const wallet = JSON.parse(wallet_)
  const rpc = new JsonRpc(rpcURL, { fetch })
  const signatureProvider = new JsSignatureProvider([wallet.privateKey])

  // Create an API instance
  const api = new Api({
    rpc,
    signatureProvider,
    textEncoder: new TextEncoder() as any,
    textDecoder: new TextDecoder() as any,
  })

  const actions: any[] = [
    {
      account: 'eosio',
      name: 'setcode',
      authorization: [
        {
          actor: wallet.wallet,
          permission: wallet.permission,
        },
      ],
      data: {
        account: wallet.wallet,
        vmtype: 0,
        vmversion: 0,
        code: wasmData,
        memo: '',
      },
    },
    {
      account: 'eosio',
      name: 'setabi',
      authorization: [
        {
          actor: wallet.wallet,
          permission: wallet.permission,
        },
      ],
      data: {
        account: wallet.wallet,
        abi: abiData,
        memo: '',
      },
    },
  ]

  try {
    const result = await api.transact(
      { actions },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    )

    return `'Transaction ID:', ${result.transaction_id}`
  } catch (error) {
    if (error instanceof RpcError) {
      const errorJson = error?.json
      throw new Error(error?.json?.error?.what)
    } else {
      throw new Error(`'An error occurred' ${error}`)
    }
  }
}

const acceptMsigPrivate = async (msigId: string, wallet_, rpcURL: string) => {
  const wallet = JSON.parse(wallet_)
  const rpc = new JsonRpc(rpcURL, { fetch })
  const signatureProvider = new JsSignatureProvider([wallet.privateKey])

  // Create an API instance
  const api = new Api({
    rpc,
    signatureProvider,
    textEncoder: new TextEncoder() as any,
    textDecoder: new TextDecoder() as any,
  })

  const actions: any[] = [
    {
      account: 'eosio.msig',
      name: 'approve',
      authorization: [
        {
          actor: wallet.wallet,
          permission: wallet.permission,
        },
      ],
      data: {
        level: { actor: wallet.wallet, permission: 'active' },
        proposal_name: msigId,
        proposer: 'hookdeployer',
      },
    },
    {
      account: 'eosio.msig',
      name: 'exec',
      authorization: [
        {
          actor: wallet.wallet,
          permission: wallet.permission,
        },
      ],
      data: {
        executer: wallet.wallet,
        proposal_name: msigId,
        proposer: 'hookdeployer',
      },
    },
  ]

  try {
    const result = await api.transact(
      { actions },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    )

    return `'Transaction ID:', ${result.transaction_id}`
  } catch (error) {
    if (error instanceof RpcError) {
      const errorJson = error?.json
      throw new Error(error?.json?.error?.what)
    } else {
      throw new Error(`'An error occurred' ${error}`)
    }
  }
}
const pathParse = (filePath) => {
  return path.parse(filePath)
}
const pushTransactionPrivate = async (
  e_,
  wallet_,
  rpcURL: string,
  name: string,
  contractWallet: string,
) => {
  const e = JSON.parse(e_)
  const wallet = JSON.parse(wallet_)
  const rpc = new JsonRpc(rpcURL, { fetch })
  const signatureProvider = new JsSignatureProvider([wallet.privateKey])

  // Create an API instance
  const api = new Api({
    rpc,
    signatureProvider,
    textEncoder: new TextEncoder() as any,
    textDecoder: new TextDecoder() as any,
  })
  const actions: any[] = [
    {
      account: contractWallet,
      name,
      authorization: [
        {
          actor: wallet.wallet,
          permission: wallet.permission,
        },
      ],
      data: { ...e },
    },
  ]
  try {
    const result = await api.transact(
      { actions },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    )

    return `'Transaction ID:', ${result.transaction_id}`
  } catch (error) {
    if (error instanceof RpcError) {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error(error?.json?.error?.what)
    } else {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error(`'An error occurred' ${error}`)
    }
  }
}
const cleanContract = async (wallet_, rpcURL: string) => {
  const { Api, JsonRpc, RpcError, Serialize } = require('eosjs')
  const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig')
  const { TextDecoder, TextEncoder } = require('util') // node only

  const wallet = JSON.parse(wallet_)
  const rpc = new JsonRpc(rpcURL, { fetch })
  const signatureProvider = new JsSignatureProvider([wallet.privateKey])
  const info = await rpc.get_info()

  // Create an API instance
  const api = new Api({
    rpc,
    signatureProvider,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
  })

  const actions: any[] = [
    {
      account: wallet.wallet,
      name: 'cleantable',
      authorization: [
        {
          actor: wallet.wallet,
          permission: wallet.permission,
        },
      ],
      data: null,
    },
  ]

  try {
    const result = await api.transact(
      { actions },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    )

    return `'Transaction ID:', ${result.transaction_id}`
  } catch (error) {
    if (error instanceof RpcError) {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error(error!.json.error.what)
    } else {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error(`'An error occurred' ${error}`)
    }
  }
}
const { exec } = require('node:child_process')
const fs_del = require('fs-extra')

const deleteAll = async (path: string) => {
  return new Promise((resolve, reject) => {
    fs_del
      .remove(path)
      .then(() => {
        resolve(null)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const sendCMD = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      resolve(stdout)
      console.error(`stderr: ${stderr}`)
    })
  })
}
const AdmZip = require('adm-zip')

const createZIP = async (path_: string) => {
  const zip = new AdmZip()
  function addFolderToZip(folderPath, parentFolder = '') {
    if (parentFolder === 'tests') return
    const files = fs.readdirSync(folderPath)

    files.forEach((file) => {
      const filePath = path.join(folderPath, file)
      const relativePath = path.join(parentFolder, file)

      if (fs.statSync(filePath).isDirectory()) {
        addFolderToZip(filePath, relativePath)
      } else {
        zip.addFile(relativePath.replace(`\\`,'/'), fs.readFileSync(filePath))
      }
    })
  }

  addFolderToZip(path_)
  const zipBuffer = await zip.toBuffer()
  return zipBuffer
}
const unzipper = require('unzipper')
const unZip = async (path_, data) => {
  console.log(data)
  const zipData: any = Object.values(data)
  const zipBuffer = Buffer.from(zipData[1])

  const extractToPath = path_
  const archive = await unzipper.Open.buffer(zipBuffer)
  await archive.extract({ path: extractToPath })
}

async function getFileName(path, req) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
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

const getDeployData = async (path_) => {
  const wasmName = await getFileName(path_, 'wasm')
  const abiName = await getFileName(path_, 'abi')
  const privateKeys = []
  const signatureProvider = new JsSignatureProvider(privateKeys)

  const rpc = new JsonRpc('https://testnet.waxsweden.org', { fetch }) //required to read blockchain state

  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder() as any,
    textEncoder: new TextEncoder() as any,
  }) //required to submit transactions

  const wasmFilePath = `${path_}/${wasmName}`
  let wasmHexString: any = await new Promise((resolve, reject) => {
    fs.readFile(wasmFilePath, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })

  wasmHexString = wasmHexString.toString('hex')
  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  })

  const abiFilePath = `${path_}/${abiName}`
  let abiJSON: any = await new Promise((resolve, reject) => {
    fs.readFile(abiFilePath, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
  abiJSON = JSON.parse(abiJSON)
  const abiDefinitions = api.abiTypes.get('abi_def')

  abiJSON = abiDefinitions!.fields.reduce(
    (acc, { name: fieldName }) =>
      Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abiJSON,
  )
  abiDefinitions!.serialize(buffer, abiJSON)
  let serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString(
    'hex',
  )

  return {
    abi: serializedAbiHexString,
    wasm: wasmHexString,
  }
}
const api = {
  fs,
  dialog,
  createZIP,
  sendCMD,
  deleteAll,
  acceptMsigPrivate,
  cleanContract,
  pushTransactionPrivate,
  pathParse,
  startTests,
  exec,
  unZip,
  getDeployData,
  deployPrivate,
}
const logo = `<svg width="255" height="255" viewBox="0 0 255 255" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="127.5" cy="127.5" r="127.5" fill="black"/>
<g filter="url(#filter0_i_1_1108)">
<path d="M17.4291 83.7773C44.2004 54.9025 78.9488 34.6349 117.262 25.548L121.6 24.519V179.69C111.761 179.69 103.785 187.666 103.785 197.505V198.512C103.785 208.121 111.394 216.004 120.996 216.345V227.952H103.785C85.2906 212.281 85.2906 183.754 103.785 168.083V129.596L98.6523 119.516V61.4791C78.3033 62.2633 59.0397 70.8612 44.8676 85.4848L36.7535 93.8573L38.2333 93.6532C46.0619 92.5732 54.0062 92.642 61.815 93.8573C46.8818 100.019 33.4766 109.828 23.166 122.265L22.7573 121.349C17.4992 109.571 15.6531 96.5531 17.4291 83.7773Z" fill="url(#paint0_diamond_1_1108)"/>
</g>
<g filter="url(#filter1_i_1_1108)">
<path d="M232.667 83.7773C205.896 54.9025 171.147 34.6349 132.834 25.548L128.496 24.519V179.69C138.335 179.69 146.311 187.666 146.311 197.505V198.512C146.311 208.121 138.702 216.004 129.1 216.345V227.952H146.311C164.806 212.281 164.806 183.754 146.311 168.083V129.596L151.444 119.516V61.4791C171.793 62.2633 191.057 70.8612 205.229 85.4848L213.343 93.8573L211.863 93.6532C204.034 92.5732 196.09 92.642 188.281 93.8573C203.214 100.019 216.62 109.828 226.93 122.265L227.339 121.349C232.597 109.571 234.443 96.5531 232.667 83.7773Z" fill="url(#paint1_diamond_1_1108)"/>
</g>
<defs>
<filter id="filter0_i_1_1108" x="16.7728" y="24.519" width="104.827" height="210.433" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="9"/>
<feGaussianBlur stdDeviation="3.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_1108"/>
</filter>
<filter id="filter1_i_1_1108" x="128.496" y="24.519" width="104.827" height="210.433" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="9"/>
<feGaussianBlur stdDeviation="3.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_1108"/>
</filter>
<radialGradient id="paint0_diamond_1_1108" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(68.1558 126.236) rotate(90) scale(101.716 53.4443)">
<stop stop-color="#BE00CF"/>
<stop offset="1" stop-color="#8D00CF"/>
</radialGradient>
<radialGradient id="paint1_diamond_1_1108" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(181.94 126.236) rotate(90) scale(101.716 53.4443)">
<stop stop-color="#BE00CF"/>
<stop offset="1" stop-color="#8D00CF"/>
</radialGradient>
</defs>
</svg>
`
declare global {
  interface Window {
    electron: any
    api: any
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive'],
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child)
    }
  },
}

function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes loader {
  0% { rotate: 0; }
  100% { rotate: 360deg; }
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 99999999;
  flex-direction: column;
  text-align: center;
  color: #FFF;
}
.loader{
  animation: loader 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}`
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `
  <div class="${className}"><div>
  <div>${logo}</div>
  <p>Hook - EOSIO IDE</p></div></div>
  <div class="loader">
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1_1113)">
    <path opacity="0.3" d="M50 20C55.5228 20 60 15.5228 60 10C60 4.47715 55.5228 0 50 0C44.4772 0 40 4.47715 40 10C40 15.5228 44.4772 20 50 20Z" fill="#808080"/>
    <path opacity="0.3" d="M78.284 31.7161C83.8068 31.7161 88.284 27.2389 88.284 21.7161C88.284 16.1932 83.8068 11.7161 78.284 11.7161C72.7611 11.7161 68.284 16.1932 68.284 21.7161C68.284 27.2389 72.7611 31.7161 78.284 31.7161Z" fill="#808080"/>
    <path opacity="0.3" d="M90 60C95.5228 60 100 55.5228 100 50C100 44.4772 95.5228 40 90 40C84.4772 40 80 44.4772 80 50C80 55.5228 84.4772 60 90 60Z" fill="#808080"/>
    <path opacity="0.3" d="M78.284 88.2839C83.8068 88.2839 88.284 83.8068 88.284 78.2839C88.284 72.7611 83.8068 68.2839 78.284 68.2839C72.7611 68.2839 68.284 72.7611 68.284 78.2839C68.284 83.8068 72.7611 88.2839 78.284 88.2839Z" fill="#808080"/>
    <path opacity="0.3" d="M50 100C55.5228 100 60 95.5228 60 90C60 84.4772 55.5228 80 50 80C44.4772 80 40 84.4772 40 90C40 95.5228 44.4772 100 50 100Z" fill="#808080"/>
    <path opacity="0.3" d="M21.716 88.2839C27.2389 88.2839 31.716 83.8068 31.716 78.2839C31.716 72.7611 27.2389 68.2839 21.716 68.2839C16.1932 68.2839 11.716 72.7611 11.716 78.2839C11.716 83.8068 16.1932 88.2839 21.716 88.2839Z" fill="#808080"/>
    <path opacity="0.3" d="M10 60C15.5228 60 20 55.5228 20 50C20 44.4772 15.5228 40 10 40C4.47715 40 0 44.4772 0 50C0 55.5228 4.47715 60 10 60Z" fill="#808080"/>
    <path opacity="0.3" d="M21.716 31.7161C27.2389 31.7161 31.716 27.2389 31.716 21.7161C31.716 16.1932 27.2389 11.7161 21.716 11.7161C16.1932 11.7161 11.716 16.1932 11.716 21.7161C11.716 27.2389 16.1932 31.7161 21.716 31.7161Z" fill="#808080"/>
    </g>
    <defs>
    <clipPath id="clip0_1_1113">
    <rect width="100" height="100" fill="white"/>
    </clipPath>
    </defs>
    </svg>
  </div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.addEventListener('message', (ev) => {
  if (ev.data.payload === 'removeLoading') {
    removeLoading()
  }
})

setTimeout(removeLoading, 5000)

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
  },
})

const child = require('child_process')

async function startTests(path__: any[]) {
  const mochaProcess = child.exec(
    'mocha --require ts-node/register /Users/nikko/Desktop/testing-library/package/src/test/**/*.ts',
  )

  mochaProcess.stdout.on('data', (data) => {
    // Обработка вывода Mocha (stdout)
    console.log(`stdout: ${data}`)
    // Отображение вывода тестов в вашем GUI
  })

  mochaProcess.stderr.on('data', (data) => {
    // Обработка ошибок (stderr) Mocha
    console.error(`stderr: ${data}`)
    // Отображение ошибок тестов в вашем GUI
  })

  mochaProcess.on('close', (code) => {
    // Обработка завершения процесса Mocha
    console.log(`child process exited with code ${code}`)
    // Опционально: отображение сообщения о завершении тестов в вашем GUI
  })

  // const mocha = new Mocha()
  // const response: unknown[] = []

  // mocha.suite.beforeEach(function () {
  //   if (this.currentTest) {
  //     response.push(`Start: "${this.currentTest.title}"`)
  //   }
  // })

  // mocha.suite.afterEach(function () {
  //   if (this.currentTest) {
  //     response.push(`End: ${this.currentTest.title}`)
  //   }
  // })

  // for (const path_ of path__) {
  //   mocha.addFile(path_.path)
  // }

  // try {
  //   const data = await new Promise((resolve, reject) => {
  //     const runner = mocha.run((failures) => {
  //       const testResults = {
  //         totalTests: runner.total,
  //         passed: runner.total - failures,
  //         failed: failures,
  //       }
  //       response.push(testResults)
  //       resolve(response)
  //     })

  //     runner.on('fail', (test, err) => {
  //       response.push(err)
  //       reject(response)
  //     })
  //   })
  //   console.log('return')
  //   yield response
  // } catch (error) {
  //   console.log('return error')

  //   response.push(error)
  //   yield response
  // }
}
