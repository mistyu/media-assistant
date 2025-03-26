<template>
  <div class="name">全局内容配置</div>
  <div class="tip1">配置整体视频的口播、字幕、文字等信息</div>
  <div class="tip2">若全局口播时长大于最终生成的视频时长,将对超出视频时长的口播从尾部进行截取</div>
  <!-- <div class="detail-item">
    <div>全局字幕与配音</div>
    <a-button>添加字幕</a-button>
  </div>
  <div class="detail-item">
    <div>全局标题</div>
    <a-button>添加标题</a-button>
  </div> -->
  <div class="detail-item">
    <div>背景音乐</div>
    <a-button>添加音乐</a-button>
  </div>
  <div class="detail-item">
    <div>视频比例</div>
    <div class="switch">
      <div :class="['switch-left', videoRatio === 0 && 'active']" @click="onRatioChange(0)">
        9:16
      </div>
      <div :class="['switch-right', videoRatio === 1 && 'active']" @click="onRatioChange(1)">
        16:9
      </div>
    </div>
  </div>
  <div class="detail-item">
    <div>视频分辨率</div>
    <div class="switch">
      <div
        :class="['switch-left', videoResolution === 0 && 'active']"
        @click="onResolutionChange(0)"
      >
        1080x1920
      </div>
      <div
        :class="['switch-right', videoResolution === 1 && 'active']"
        @click="onResolutionChange(1)"
      >
        720x1280
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const videoRatio = ref(0)
const onRatioChange = (value) => {
  videoRatio.value = value
}
const videoResolution = ref(0)
const onResolutionChange = (value) => {
  videoResolution.value = value
}
</script>

<style scoped>
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
.detail-item {
  margin-top: 16px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.switch {
  height: 32px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.switch-left {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
}
.switch-right {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
}
.active {
  background-color: #1677ff;
  color: #fff;
}
</style>
