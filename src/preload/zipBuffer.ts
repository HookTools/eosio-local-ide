const archiver = require('archiver')
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const getZipBuffer = async (folderPath) => {
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })

  const output = zlib.createGzip()

  archive.pipe(output)

  const files = await fs.promises.readdir(folderPath)
  for (const file of files) {
    const filePath = path.join(folderPath, file)

    if (fs.statSync(filePath).isFile()) {
      archive.file(filePath, { name: file })
    }
  }

  await archive.finalize()

  let zipBuffer = Buffer.from([])

  output.on('data', (data) => {
    zipBuffer = Buffer.concat([zipBuffer, data])
  })

  await new Promise((resolve) => {
    output.on('end', () => {
      resolve(null)
    })
  })

  return zipBuffer
}

module.exports = getZipBuffer
