import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
import { ipcMain, contextBridge, ipcRenderer } from 'electron'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

// export default class FFmpeg {
//   ffmpeg;

//   constructor(inputPath) {
//     this.ffmpeg = ffmpeg(inputPath)
//   }
// }


export const test = () => {
  return new Promise((resovle, reject) => {
    ffmpeg().input('/Users/lichenhui/Desktop/TIAM/electron-app/src/main/lib/input.mp4')
    .output(`/Users/lichenhui/Desktop/TIAM/electron-app/src/main/lib/output.mp4${ new Date().getDateTime()}`)
    .on('progress', progress => {
      console.log(`Processing: ${progress.percent}% done`)
    })
    .on('end', () => {
      console.log('Processing finished!')
      resovle(true)
    })
    .on('error', err => {
      console.error('Error:', err)
      reject(err)
    })
    .run()
  })
  
}


contextBridge.exposeInMainWorld('electronAPI', {
  mergeVideos: () => ipcRenderer.invoke('copy-videos')
})
ipcMain.handle('copy-videos', async (event) => {
    try {
        const result = await test();
        return { success: true, file: result };
    } catch (error) {
        return { success: false, error: error };
    }
});


