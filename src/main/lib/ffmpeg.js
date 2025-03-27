import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

export function mergeVideos(_e, inputFiles, outputFile) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg()

    inputFiles.forEach((file) => {
      command.input(file)
    })

    command
      .on('start', (commandLine) => {
        console.log('FFmpeg process started:', commandLine)
      })
      .on('progress', (progress) => {
        console.log(`Processing: ${progress.percent}% done`)
      })
      .on('end', () => {
        console.log('Merging completed!')
        resolve(outputFile)
      })
      .on('error', (err) => {
        console.error('Error:', err)
        reject(err)
      })
      .mergeToFile(outputFile) // 临时目录，避免 FFmpeg 直接操作源文件
  })
}

export function mergeBgm(_e, inputFile, bgmFile, outputFile) {
  console.log(inputFile, bgmFile, outputFile, 'mergeBgm')
  return new Promise((resolve, reject) => {
    const command = ffmpeg()
    // **步骤 2：添加背景音乐**
    command
    .input(inputFile)  // 合并后的视频
    .input(bgmFile)   // 背景音乐
    .complexFilter([
        '[0:a]volume=1[a1]',   // 视频原声音量 100%
        '[1:a]volume=0.5[a2]', // BGM 音量 50%
        '[a1][a2]amix=inputs=2:duration=first:dropout_transition=2[aout]' // 混合音轨
    ])
    .outputOptions('-map 0:v:0') // 保留合并后的视频
    .outputOptions('-map [aout]') // 使用混合后的音轨
    .output(outputFile)
    .on('end', () => {
        console.log('音频合成完成');
        fs.unlinkSync(inputFile) // 删除临时文件
        resolve({ success: true, file: outputFile });
    })
    .on('error', (err) => reject({ success: false, error: err.message }))
    .run();
    
  })
}
