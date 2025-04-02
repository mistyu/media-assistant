<template>
  <div class="title">
    <div>
      镜头1 - 字幕与配音
    </div>
    <div>
      <CloseOutlined @click="close" />
    </div>
  </div>
  <div class="tip1">添加字幕内容</div>
  <div class="tip2">若添加多条字幕，最终每条成片会随机选其一来使用</div>
  <div v-for="(item, index) in subtitle" :key="index" class="subtitle">
    <div class="name">
      <div>
        字幕{{ index + 1 }} 口播时长：{{ (item.shotEndTime - item.shotStartTime) }}s
      </div>
      <div>
        <CloseOutlined @click="onDeleteSubtitle(index)" />
      </div>
    </div>
    <div>
      <a-textarea v-model:value="item.subtitle" class="subtitle-textarea" :bordered="false" :show-count="false"
        placeholder="请添加字幕" :rows="2" @change="onChange($event, index)" @focus="onFocus(index)" />
    </div>
  </div>
  <div>
    <a-button class="add-sub-title" :loading="renderLoading" @click="onAdd">添加字幕</a-button>
  </div>
  <div>
    <a-button class="add-sub-title" :loading="compositionAudioLoading" @click="onCompositionAudio">合成音频</a-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { getSubtitleDubbingTime } from '../../../../utils/tts'

const props = defineProps({
  onClose: {
    type: Function,
    required: true
  },
  subtitle: {
    type: Array,
    required: true
  },
  onRenderShot: {
    type: Function,
    required: true
  },
  setTime: {
    type: Function,
    required: true
  },
  setSubtitle: {
    type: Function,
    required: true
  },
  setSubtitleIndex: {
    type: Function,
    required: true
  },
  addSubtitle: {
    type: Function,
    required: true
  },
  deleteSubtitle: {
    type: Function,
    required: true
  },
  setAudioTime: {
    type: Function,
    required: true
  }
})

const close = () => {
  props.onClose()
}
const onChange = (e, index) => {
  props.setSubtitle(index, e.target.value)
}
const renderLoading = ref(false)
const onAdd = async () => {
  props.addSubtitle()
}
const onDeleteSubtitle = (index) => {
  if (props.subtitle.length === 1) {
    return
  }
  props.deleteSubtitle(index, '')
}
const compositionAudioLoading = ref(false)
const onCompositionAudio = async () => {
  compositionAudioLoading.value = true
  try {
    let time = 0
    const newSubtitle = new Array(props.subtitle.length)
    let i = 0
    for (let subtitle of props.subtitle) {
      console.log(time, 'time')
      const duration = await getSubtitleDubbingTime(subtitle.subtitle)
      const end = subtitle.subtitle ? (time + Math.ceil(duration / 1000)) : time
      newSubtitle[i] = {
        subtitle: subtitle.subtitle,
        shotStartTime: time,
        shotEndTime: end
      }
      time = (end + 1)
      i++
    }
    props.setAudioTime(newSubtitle)
  } catch (error) {
    console.log(error, 'onCompositionAudio')
  } finally {
    compositionAudioLoading.value = false
  }
}
const onFocus = (index) => {
  props.setSubtitleIndex(index)
}
</script>

<style scoped>
.title {
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
}

.tip1 {
  font-size: 12px;
  color: #b0b0b0;
  margin-top: 10px;
}

.tip2 {
  font-size: 12px;
  color: #1677ff;
  margin-top: 10px;
}

.subtitle {
  width: 100%;
  height: 100px;
  font-size: 14px;
  margin-top: 20px;
  background-color: #f7f7f7;
  border-radius: 4px;
  padding: 10px;
}

.name {
  display: flex;
  justify-content: space-between;
  color: #2b2b2b;
}

.subtitle-textarea {
  margin-top: 10px;
  background-color: #fff;
}

.add-sub-title {
  width: 100%;
  margin-top: 10px;
}
</style>
