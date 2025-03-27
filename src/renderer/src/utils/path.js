export async function getFilePath(extensions = []) {
  const result = await window.electron.getFilePath(extensions)
  return result
}

export async function getDirPath() {
  const result = await window.electron.getDirPath()
  return result
}
