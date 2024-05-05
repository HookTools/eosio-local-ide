const { notarize } = require('electron-notarize')
require('dotenv').config()

const projectRoot = require('path').resolve(__dirname, '..')

exports.default = async (context) => {
  const { electronPlatformName } = context

  if (electronPlatformName !== 'darwin') {
    return
  }
  
  await notarize({
    appBundleId: 'com.electron.hook-ide',
    appPath: `${__dirname}/dist/mac-arm64/eosio-ide.app`,
    appleId: String(process.env.APPLE_ID),
    appleIdPassword: String(process.env.APPLEIDPASS),
    ascProvider: process.env.APPLE_TEAM_ID,
    teamId: process.env.APPLE_TEAM_ID,
  })
}
