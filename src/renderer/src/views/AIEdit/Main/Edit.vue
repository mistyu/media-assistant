<template>
  <div class="ai-edit-wrapper">
    <div class="header">
      <a-button type="primary" :loading="mergeLoading" @click="onMergeVideos">合成视频</a-button>
    </div>
    <div class="content">
      <div class="config">
        <div class="config-header">
          <div class="config-tip">
            <div class="config-tip-title">镜头配置</div>
            <div>配置每个镜头的素材，字幕、文字等信息</div>
          </div>
          <div class="add">
            <a-button type="primary" @click="onAdd">添加镜头</a-button>
          </div>
        </div>
        <div class="config-content">
          <div v-for="(item, index) in configs" :key="index" class="config-content__item">
            <div class="item-header">
              <div class="name">
                <div class="name-left">镜头{{ index + 1 }}</div>
                <div class="name-count">累计数量：0</div>
              </div>
              <div>
                <img class="icon" src="../../../assets/icons/voice.svg" />
                <img class="icon delete" src="../../../assets/icons/delete.svg" @click="onDelete(index)" />
              </div>
            </div>
            <div class="uploader-content">
              <div v-if="!item.videoPath" class="avatar-uploader" @click="handleChange(index)">
                <plus-outlined></plus-outlined>
                <div class="ant-upload-text">添加素材</div>
              </div>
              <div v-else>
                <video class="video" :src="item.videoPath" controls></video>
                <CloseOutlined @click="deleteVideo(index)" />
              </div>
            </div>
            <div class="config-bottom">
              <div>镜头配置</div>
              <a-button class="config-bottom-btn" @click="onChangeRightPannel('subtitle', index)">字幕与配音</a-button>
              <a-button class="config-bottom-btn">文字标题</a-button>
              <a-button class="config-bottom-btn">素材原始时长</a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="preview">
        <div class="preview-header">
          <div>
            <div class="preview-header-name">效果预览</div>
            <div class="preview-header-tip">预览视频整体效果</div>
          </div>
          <div>
            <a-button type="primary" class="preview" :loading="renderLoading" @click="onPreview">预览</a-button>
          </div>
        </div>
        <div class="preview-content-wrapper">
          <div class="preview-content">
            <div class="preview-mobile">
              <div v-if="!configs[shotIndex].coverPath" class="preview-tip">请在每个镜头下添加素材</div>
              <img v-else class="preview-shot" :src="configs[shotIndex].coverPath" controls />
              <div class="subtitle">{{ configs[shotIndex].subtitleDubbing[subtitleIndex].subtitle }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail">
        <Whole v-if="detailView === 'whole'" :on-bgm="onBgm" :bgm="bgm" :deleteBgm="deleteBgm" />
        <SubtitleDubbing v-if="detailView === 'subtitle'" :onClose="onCloseSubtitle" :onRenderShot="onRenderShot"
          :set-time="setRenderTime" :subtitle="configs[shotIndex].subtitleDubbing" :addSubtitle="addSubtitle"
          :set-subtitle="setSubtitle" :deleteSubtitle="deleteSubtitle" :setAudioTime="setAudioTime" :set-subtitle-index="setSubtitleIndex" />
      </div>
    </div>
  </div>
  <a-modal v-model:open="open" title="预览" :footer="null" destroy-on-close centered @ok="hideModal">
    <video class="modal-video" :src="configs[shotIndex].previewPath" controls></video>

  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue'
import Whole from './RightPannel/Whole.vue'
import SubtitleDubbing from './RightPannel/SubtitleDubbing.vue'
import {
  mergeVideos,
  mergeBgm,
  clipVideoToBuffer,
  getVideoFirstCover
} from '../../../utils/ffmpeg.js'
import { getFilePath, getDirPath, getTempPath } from '../../../utils/path.js'
import { generateSubtitles } from '../../../utils/tts.js'
const configs = ref([
  {
    path: '',
    videoPath: '',
    subtitleDubbing: [
      {
        subtitle: '',
        shotStartTime: 0,
        shotEndTime: 0
      }
    ],
    previewPath: '',
    coverPath: ''
  },
  {
    path: '',
    videoPath: '',
    subtitleDubbing: [
      {
        subtitle: '',
        shotStartTime: 0,
        shotEndTime: 0
      }
    ],
    previewPath: '',
    coverPath: ''
  }
])
const shotIndex = ref(0)
const bgm = ref('')
const onBgm = async () => {
  const res = await getFilePath(['MP3'])
  bgm.value = res
}
const deleteBgm = () => {
  bgm.value = ''
}
const handleChange = async (index) => {
  const res = await getFilePath([
    'MP4',
    'MOV',
    'MKV',
    'FLV',
    'MPEG',
    'OGG',
    'VOB',
    'WEBM',
    'WMV',
    'RMVB'
  ])
  configs.value[index].path = res
  configs.value[index].videoPath = res
  const tempPath = await getTempPath()
  const cover = await getVideoFirstCover(res, tempPath + new Date().getTime() + '.jpg')
  configs.value[index].coverPath = cover.file
  shotIndex.value = index
}
const deleteVideo = (index) => {
  configs.value[index].path = ''
  configs.value[index].videoPath = ''
  configs.value[index].previewPath = ''
  configs.value[index].coverPath = ''
}

const onAdd = () => {
  configs.value.push({
    path: '',
    videoPath: '',
    subtitleDubbing: [
      {
        subtitle: '',
        shotStartTime: 0,
        shotEndTime: 0
      }
    ],
    previewPath: '',
    coverPath: ''
  })
}
const onDelete = (index) => {
  if (configs.value.length <= 1) {
    return
  }
  configs.value.splice(index, 1)
}
const mergeLoading = ref(false)
const onMergeVideos = async () => {
  mergeLoading.value = true
  try {
    const output = await getDirPath()
    const inputs = []
    configs.value.forEach((item) => {
      if (item.previewPath) {
        inputs.push(item.previewPath)
      }
    })
    const outpath = await mergeVideos(inputs, output + '/' + new Date().getTime() + '.mp4')
    if (bgm.value) {
      await mergeBgm(outpath, bgm.value, output + '/' + new Date().getTime() + '.mp4')
    }
    message.success('合成视频已完成')
  } catch (error) {
    console.log(error, 'onMergeVideos')
    message.error('合成视频已失败')
  } finally {
    mergeLoading.value = false
  }
}
const detailView = ref('whole')
const onChangeRightPannel = (type, index) => {
  if (!configs.value[index].videoPath) {
    message.warning('请先添加素材')
    return
  }
  if (shotIndex.value === index && detailView.value === 'subtitle') {
    return
  }
  detailView.value = type
  shotIndex.value = index ?? shotIndex.value
  setSubtitleIndex(0)
}
const onCloseSubtitle = () => {
  detailView.value = 'whole'
  shotIndex.value = 0
  setSubtitleIndex(0)
}
const addSubtitle = () => {
  configs.value[shotIndex.value].subtitleDubbing.push({
    subtitle: '',
    shotStartTime: 0,
    shotEndTime: 0
  })
}
const deleteSubtitle = (index) => {
  configs.value[shotIndex.value].subtitleDubbing.splice(index, 1)
}
const subtitleIndex = ref(0)
const setSubtitleIndex = (index) => {
  subtitleIndex.value = index
}
const setSubtitle = (index, subtitle) => {
  configs.value[shotIndex.value].subtitleDubbing[index].subtitle = subtitle
  setSubtitleIndex(index)
}
const setAudioTime = async (subtitleDubbing) => {
  configs.value[shotIndex.value].subtitleDubbing = subtitleDubbing
}
const setRenderTime = (time) => {
  configs.value[shotIndex.value].shotStartTime = 0
  configs.value[shotIndex.value].shotEndTime = time
}
const onRenderShot = async () => {
  const outputDir = await getTempPath()
  const config = configs.value[shotIndex.value]
  const endTime = config.subtitleDubbing[config.subtitleDubbing.length - 1].shotEndTime
  const output = await clipVideoToBuffer(
    config.videoPath,
    0,
    endTime,
    generateSubtitles(config.subtitleDubbing),
    `${outputDir}镜头${shotIndex.value + 1}-${new Date().getTime()}.mp4`
  )
  configs.value[shotIndex.value].previewPath = output.file
  open.value = true
}
const renderLoading = ref(false)
const open = ref(false)
const hideModal = () => {
  open.value = false
}
const onPreview = async () => {
  if (configs.value[shotIndex.value].previewPath) {
    open.value = true
    return
  }
  renderLoading.value = true
  try {
    await onRenderShot()
  } catch (error) {
    console.log(error, 'onPreview')
  } finally {
    renderLoading.value = false
  }
}
</script>

<style scoped>
.ai-edit-wrapper {
  width: 100%;
}
.header {
  width: 100%;
  margin-right: 10px;
  display: flex;
  justify-content: end;
  align-items: center;
  height: 50px;
  border-bottom: 2px solid #e8e8e8;
}

.content {
  display: flex;
}

.preview {
  flex: 1;
  margin: 20px 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
}

.preview-content-wrapper {
  display: flex;
  justify-content: center;
}

.preview-content {
  max-width: 420px;
  margin-top: 20px;
  height: 580px;
  border: 2px solid #eee;
  border-radius: 4px;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
}

.preview-mobile {
  position: relative;
  width: 236px;
  background-color: rgb(43, 43, 43);
  height: 480px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-self: center;
}

.preview-tip {
  color: #fff;
  padding: 0 30px;
}

.preview-header-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #b0b0b0;
  text-align: center;
  width: 100%;
}

.config {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.config-header {
  height: 60px;
  display: flex;
  align-items: center;
  width: 400px;
  justify-content: space-between;
}

.config-tip-title {
  font-size: 16px;
  margin-bottom: 10px;
}

.config-tip {
  font-size: 12px;
}

.config-content__item {
  width: 400px;
  height: 240px;
  border: 2px solid #eee;
  border-radius: 4px;
  margin-top: 10px;
}

.item-header {
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  background-color: #f7f7f7;
  font-size: 14px;
}

.name {
  display: flex;
  align-items: center;
}

.name-count {
  font-size: 12px;
  color: #b0b0b0;
}

.name-left {
  margin-right: 30px;
}

.icon {
  width: 18px;
  cursor: pointer;
}

.delete {
  margin-left: 4px;
}

.config-bottom {
  margin-top: 10px;
  font-size: 14px;
  margin-left: 10px;
  display: flex;
  align-items: center;
}

.config-bottom-btn {
  margin-left: 5px;
}

.detail {
  width: 400px;
  border-left: 2px solid #e8e8e8;
  padding: 20px;
}

.uploader-content {
  display: flex;
  align-items: center;
  height: 146px;
}

.video {
  width: 80px;
  margin-left: 10px;
}

.avatar-uploader {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);

  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
  margin-left: 10px;
}

.avatar-uploader {
  width: 84px;
  height: 108px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.preview-shot {
  height: 100%;
  /* padding: 20px 0; */
  width: 100%;
}

.modal-video {
  width: 100%;
}
.subtitle {
  position: absolute;
  bottom: 20px;
  text-align: center;
  color: white;
  width: 100%;
}
</style>
