import { ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'hooktools',
  repo: 'EOSIO-LOCAL-IDE',
  releaseType: 'release',
})

autoUpdater.forceDevUpdateConfig
process.env.ELECTRON_IS_DEV = '0'
process.env.NODE_ENV = 'production'

autoUpdater.logger = log
log.info('App starting...')
log.info('auto Update check')

autoUpdater.on('update-available', () => {
  // update-download
  autoUpdater.downloadUpdate()
})


setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 300000)
// update-downloaded Listener
autoUpdater.on('update-downloaded', (info) => {
  const releaseVersion = info.version
  const dialogOptions:any = {
    type: 'question',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    // message: process.platform === 'win32' ? releaseNotes : releaseName,
    message: 'v' + releaseVersion,
    detail: `A new version ${releaseVersion} has been downloaded. Restart the application to apply the updates.`,
  }

  dialog.showMessageBox(dialogOptions).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})

ipcMain.handle('getUpdate', () => {
  return new Promise((resolve) => {
    resolve(autoUpdater.checkForUpdatesAndNotify())
  })
})
