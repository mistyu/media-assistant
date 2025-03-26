

export async function copyVideos() {
  const result = await window.electron.copyVideos();
  if (result.success) {
      console.log('合成成功:', result.file);
  } else {
      console.error('合成失败:', result.error);
  }
}
