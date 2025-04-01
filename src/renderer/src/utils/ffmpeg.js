export async function mergeVideos(inputs = [], output) {
  if (!inputs.length) {
    return
  }
  const result = await window.electron.mergeVideos(inputs, output)
  return result
}

export async function mergeBgm(input, bgmFile, output) {
  const result = await window.electron.mergeBgm(input, bgmFile, output)
  return result
}

export async function clipVideoToBuffer(input, startTime, endTime, subtitleDubbing, output) {
  const result = await window.electron.clipVideoToBuffer(
    input,
    startTime,
    endTime,
    subtitleDubbing,
    output
  )
  return result
}
