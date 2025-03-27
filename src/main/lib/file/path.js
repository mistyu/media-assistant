const { dialog } = require('electron/main')

export async function getFilePath(extensions = []) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Videos',
        extensions: extensions
      }
    ]
  })
  if (!canceled) {
    return filePaths[0]
  }
}

export async function getDirPath() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (!canceled) {
    return filePaths[0]
  }
}

