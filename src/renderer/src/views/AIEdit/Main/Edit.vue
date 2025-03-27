<template>
  <div>
    <div class="header">
      <a-button type="primary" @click="onMergeVideos">合成视频</a-button>
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
                <img
                  class="icon delete"
                  src="../../../assets/icons/delete.svg"
                  @click="onDelete(index)"
                />
              </div>
            </div>
            <div>
              <div class="avatar-uploader" @click="handleChange(index)">
                <plus-outlined></plus-outlined>
                <div class="ant-upload-text">添加素材</div>
              </div>
            </div>
            <div class="config-bottom">
              <div>镜头配置</div>
              <a-button class="config-bottom-btn" @click="onChangeRightPannel('subtitle')">字幕与配音</a-button>
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
            <a-button type="primary">预览</a-button>
          </div>
        </div>
        <div class="preview-content">
          <div class="preview-mobile">
            <div class="preview-tip">请在每个镜头下添加素材</div>
          </div>
        </div>
      </div>
      <div class="detail">
        <Whole v-if="detailView === 'whole'" :on-bgm="onBgm" :bgm="bgm" :deleteBgm="deleteBgm" />
        <SubtitleDubbing v-if="detailView === 'subtitle'" :onClose="onChangeRightPannel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import Whole from './RightPannel/Whole.vue'
import SubtitleDubbing from './RightPannel/SubtitleDubbing.vue'
import { mergeVideos, mergeBgm } from '../../../utils/ffmpeg.js'
import { getFilePath, getDirPath } from '../../../utils/path.js'
const configs = ref([
  {
    path: ''
  },
  {
    path: ''
  }
])
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
}

const onAdd = () => {
  configs.value.push({
    path: ''
  })
}
const onDelete = (index) => {
  if (configs.value.length <= 1) {
    return
  }
  configs.value.splice(index, 1)
}

const onMergeVideos = async () => {
  const output = await getDirPath()

  const inputs = []
  configs.value.forEach((item) => {
    if (item.path) {
      inputs.push(item.path)
    }
  })
  const outpath = await mergeVideos(inputs, output + '/' + new Date().getTime() + '.mp4')
  await mergeBgm(outpath, bgm.value, output + '/' + new Date().getTime() + '.mp4')
}
const detailView = ref('whole')
const onChangeRightPannel = (type) => {
  detailView.value = type
}
</script>

<style scoped>
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
.preview-content {
  margin-top: 20px;
  height: 640px;
  border: 2px solid #eee;
  border-radius: 4px;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-mobile {
  background-color: rgb(43, 43, 43);
  height: 500px;
  border-radius: 10px;
}
.preview-tip {
  color: #fff;
  margin-top: 160px;
  padding: 0 30px;
}
.preview-header-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #b0b0b0;
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
  height: 210px;
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
</style>

<style>
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
</style>
