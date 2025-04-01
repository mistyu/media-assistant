import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'
import path from 'path'
import { app } from 'electron'

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'))
ffmpeg.setFfprobePath(ffprobePath.path.replace('app.asar', 'app.asar.unpacked'))

export function mergeVideos(_e, inputFiles, outputFile) {
  console.log(inputFiles, outputFile, 'mergeVideos')
  return new Promise((resolve, reject) => {
    const command = ffmpeg()
    inputFiles.forEach((file) => {
      command.input(file)
    })
    command
    .on('start', commandLine => console.log('FFmpeg command:', commandLine))
    .on('progress', progress => console.log(`Processing: ${progress}% done`))
    .on('end', () => {
      console.log('视频合成完成')
      resolve({ success: true, file: outputFile })
    })
    .on('error', err => {
      reject({ success: false, error: err })
      console.error('Error:', err)})
    .output(outputFile)
    .outputOptions([
        `-filter_complex concat=n=${inputFiles.length}:v=1:a=1` // 关键：拼接 3 个视频
    ])
    .run();
  })
}

export function mergeBgm(_e, inputFile, bgmFile, outputFile) {
  console.log(inputFile, bgmFile, outputFile, 'mergeBgm')
  return new Promise((resolve, reject) => {
    const command = ffmpeg()
    // **步骤 2：添加背景音乐**
    command
      .input(inputFile) // 合并后的视频
      .input(bgmFile) // 背景音乐
      .complexFilter([
        '[0:a]volume=1[a1]', // 视频原声音量 100%
        '[1:a]volume=0.5[a2]', // BGM 音量 50%
        '[a1][a2]amix=inputs=2:duration=first:dropout_transition=2[aout]' // 混合音轨
      ])
      .outputOptions('-map 0:v:0') // 保留合并后的视频
      .outputOptions('-map [aout]') // 使用混合后的音轨
      .output(outputFile)
      .on('end', () => {
        console.log('音频合成完成')
        fs.unlinkSync(inputFile) // 删除临时文件
        resolve({ success: true, file: outputFile })
      })
      .on('error', (err) => reject({ success: false, error: err.message }))
      .run()
  })
}

const subtitles = `
1
00:00:00,000 --> 00:00:03,000
若添加多条字幕

2
00:00:04,000 --> 00:00:07,000
最终每条成片会随

3
00:00:08,000 --> 00:00:10,000
机选其一来使用
`
/**
 * 剪辑视频并存入内存 Buffer
 * @param inputFile 输入视频路径
 * @param startTime 开始时间（秒）
 * @param endTime 结束时间（秒）
 * @returns 剪辑后的视频 Buffer
 */
export function clipVideoToBuffer(_e, inputFile, startTime, endTime, subtitleText, outputFile) {
  console.log(subtitleText, subtitles, 'subtitleText')
  // 生成临时字幕文件
  const subtitleFile = path.join(app.getPath('temp'), `temp_subtitles_${Date.now()}.srt`)

  fs.writeFileSync(subtitleFile, subtitleText, 'utf8')
  return new Promise((resolve, reject) => {
    const duration = endTime - startTime

    ffmpeg(inputFile)
      .setStartTime(startTime)
      .setDuration(duration)
      .outputOptions('-vf', `subtitles=${subtitleFile}`) // 通过 FFmpeg 添加字幕
      // .outputFormat('mp4') // 确保输出为 MP4
      .on('end', () => {
        // 处理完成后删除临时字幕文件
        fs.unlinkSync(subtitleFile)
        resolve({ success: true, file: outputFile })
      }) // 获取剪辑后的 Buffer
      .on('error', (err) => reject(`剪辑失败: ${err.message}`))
      .output(outputFile) // 临时目录，避免 FFmpeg 直接操作源文件
      .run()
  })
}
