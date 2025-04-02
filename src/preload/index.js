import { contextBridge, ipcRenderer } from 'electron/renderer'

// Custom APIs for renderer

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      getFilePath: (extensions) => ipcRenderer.invoke('getFilePath', extensions),
      getDirPath: () => ipcRenderer.invoke('getDirPath'),
      getTempPath: () => ipcRenderer.invoke('getTempPath'),
      mergeVideos: (inputFiles, outputFile) =>
        ipcRenderer.invoke('mergeVideos', inputFiles, outputFile),
      mergeBgm: (inputFile, bgmFile, outputFile) =>
        ipcRenderer.invoke('mergeBgm', inputFile, bgmFile, outputFile),
      clipVideoToBuffer: (inputFile, startTime, endTime, subtitleFile, outputFile) =>
        ipcRenderer.invoke(
          'clipVideoToBuffer',
          inputFile,
          startTime,
          endTime,
          subtitleFile,
          outputFile
        ),
      getVideoFirstCover: (inputFile, outputFile) =>
        ipcRenderer.invoke('getVideoFirstCover', inputFile, outputFile)
    })
    contextBridge.exposeInMainWorld('platform', process.platform)
  } catch (error) {
    console.error(error)
  }
} else {
  // window.electron = electron
  // window.api = api
}
