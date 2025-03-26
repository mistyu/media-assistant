import { contextBridge } from 'electron'
import { electronAPI, webUtils } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  showFilePath(file) {
    // It's best not to expose the full file path to the web content if
    // possible.
    const path = webUtils.getPathForFile(file)
    return path
  },
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('platform', process.platform)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
