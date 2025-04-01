export function getSubtitleDubbingTime(text) {
  return new Promise((resolve, reject) => {
    try {
      const synth = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.volume = 0
      // utterance.onstart = () => console.log('🎙️ 语音开始播放')
      utterance.onend = () => {
        const endTime = performance.now()
        resolve(Math.round(endTime - startTime))
      }
      // utterance.onpause = () => console.log('⏸️ 语音已暂停')
      // utterance.onresume = () => console.log('▶️ 语音已恢复')
      utterance.onerror = (event) => {
        reject(event)
      }
      const startTime = performance.now()
      synth.speak(utterance)
    } catch (error) {
      reject(error)
    }
  })
}
/**
 * 将秒转换为 SRT 格式时间戳 (hh:mm:ss,SSS)
 * @param seconds 以秒为单位的时间
 * @returns SRT 格式的时间字符串
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.round((seconds % 1) * 1000); // 取毫秒

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

/**
* 生成 SRT 字幕时间范围
* @param startTime 开始时间（秒）
* @param endTime 结束时间（秒）
* @returns SRT 格式的时间范围
*/
function generateSrtTimestamp(startTime, endTime) {
  return `${formatTime(startTime)} --> ${formatTime(endTime)}`;
}
// const subtitles = `
// 1
// 00:00:01,000 --> 00:00:05,000
// 这是第一条字幕。

// 2
// 00:00:06,000 --> 00:00:10,000
// 这是第二条字幕。
// `;
export function generateSubtitle(subtitleText, index, startTime, endTime) {
  return `
${index}
${generateSrtTimestamp(startTime, endTime)}
${subtitleText}
`
}

export function generateSubtitles(subtitleTexts) {
  let res = ``
  subtitleTexts.forEach((subtitle, index) => {
    res += generateSubtitle(
      subtitle.subtitle,
      index + 1,
      subtitle.shotStartTime,
      subtitle.shotEndTime
    )
  })
  return res
}
