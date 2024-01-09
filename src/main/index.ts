import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import {
  app,
  shell,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeImage,
} from 'electron'
import './auto-update'

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true
  },
})

let mainWindow
function createWindow(): void {
  // Create the browser window.
  const iconPath = `${__dirname}/icon.png`
  const image = nativeImage.createFromPath(iconPath)

  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { image } : {}),
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.maximize()
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })

  ipcMain.handle('getPath', () => {
    return app.getAppPath()
  })

  const path = require('path')

  const fsExtra = require('fs-extra')

  ipcMain.handle('getFile', async (e, name: string, toPath: string) => {
    const filePath = path.join(process.resourcesPath, 'smartcontracts', name)
    try {
      const resp = fsExtra.copySync(filePath, toPath)
      return resp
    } catch (error) {
      console.error('Error copying folder:', error)
      throw error // Rethrow the error so that the renderer process can catch it.
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // mainWindow.on('ready', () => {
  //   app.applicationSupportsSecureRestorableState = () => true
  // })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const pty = require('node-pty')
const os = require('os')

const shell_ = os.platform() === 'win32' ? 'powershell.exe' : 'bash'

const ptyProcess = pty.spawn(shell_, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.pwd,
  env: process.env,
})

ptyProcess.write("PS1='\\w $ '\n")

setTimeout(() => {
  ptyProcess.on('data', (data) => {
    mainWindow.webContents.send('terminal.incomingData', data)
  })
}, 10000)

ipcMain.on('terminal.keystroke', (event, key) => {
  ptyProcess.write(key)
})

ipcMain.handle('getVersion', () => {
  return app.getVersion()
})
