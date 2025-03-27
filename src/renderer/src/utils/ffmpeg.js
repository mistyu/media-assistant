export async function mergeVideos(inputs = [], output) {
  const result = await window.electron.mergeVideos(inputs, output);
  return result
}

export async function mergeBgm(input, bgmFile, output) {
  const result = await window.electron.mergeBgm(input, bgmFile, output)
  return result
}
