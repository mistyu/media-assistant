<template>
  <div class="publish">
    <a-tag class="tag">
      <img class="tag-color icon" src="../../../assets/icons/publish-single-video.svg" />
      <span class="tag-color">新建视频发布</span>
    </a-tag>
    <div class="single-video">
      <div>
        <div class="title">单条视频发布</div>
      <div v-if="name" class="name">
        <div>{{ name }}</div>
        <div class="success-tip">
          <img class="success-tip__icon" src="../../../assets/icons/success.svg" />
          <span>视频添加成功</span>
        </div>
        <a-button class="refresh-video" @click="refreshVideo">重新添加</a-button>
      </div>
      <div v-else class="video">
        <a-upload :showUploadList="false" accept=".MP4, .MOV, .MKV, .FLV, .MPEG, .OGG, .VOB, .WEBM, .WMV, .RMVB"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">
          <a-button type="primary"> 添加本地视频 </a-button>

        </a-upload>
        <p class="ant-upload-hint">
          本地视频支持MP4、MOV、MKV、FLV、MPEG、OGG、VOB、WEBM、WMV、RMVB等格式，最大4G，较大视频请压缩后上传
        </p>
      </div>
      <div>
        <div class="form">
          <div class="title">
            <div class="form-label">标题</div>
            <a-input v-model:value="form.title" show-count :maxlength="30" />
          </div>
          <div class="introduction">
            <div class="form-label">视频简介</div>
            <a-textarea v-model:value="form.introduction" :rows="6" show-count :maxlength="1000" />
          </div>
          <div class="tags">
            <div class="form-label">标签</div>
            <div class="tags-input">
              <a-input v-model:value="tag" />
              <a-button type="primary" class="tag-add" @click="addTag"> 添加 </a-button>
              <span class="tag-count">{{ form.tags.length }}/9 </span>
            </div>
            <div v-if="form.tags.length">
              <a-tag
                v-for="(item, index) in form.tags"
                :key="item + index"
                class="tag-detail"
                closable
                @close="deleteTag(index)"
                >{{ item }}</a-tag
              >
            </div>
            <div class="tag-tip">
              <div>
                您可添加<span class="tip-blue">2～9</span
                >个标签，点击添加确认，部分平台最多显示5个标签，超出默认显示前<span class="tip-blue"
                  >5</span
                >个标签。
              </div>
              <div class="warn">企鹅，b站，网易，搜狗，大风平台视频标签不能为空，企鹅最少2个标签，网易最少3个标签</div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div class="btns"><a-button  type="primary">定时发布</a-button></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref()
const handleChange = async ({ file }) => {
  name.value = file.name
}
const refreshVideo = () => {
  name.value = ''
}
const form = ref({
  title: '',
  introduction: '',
  tags: []
})
const tag = ref('')
const addTag = () => {
  form.value.tags.push(tag.value)
  tag.value = ''
}
const deleteTag = (index) => {
  console.log('asd')
  form.value.tags.splice(index, 1)
}
</script>

<style scoped>
.publish {
  display: flex;
  justify-content: center;
}

.tag {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  /* background: #fff; */
  background: #d1e4ff5e;
}

.tag-color {
  /* color: #777777; */
  color: #1677ff;
}

.icon {
  width: 12px;
  margin-bottom: 3px;
  margin-right: 6px;
}

.single-video {
  width: 600px;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.name {
  font-size: 16px;
  margin-top: 20px;
  font-weight: 600;
}

.success-tip {
  color: #1677ff;
  margin-top: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.success-tip__icon {
  width: 16px;
  margin-right: 5px;
}

.refresh-video {
  margin-top: 14px;
}

.ant-upload-hint {
  color: rgba(91, 91, 91, 0.45);
  font-size: 12px;
  margin-top: 10px;
  line-height: 16px;
  font-weight: 400;
}
.video {
  margin-top: 24px;
}
.form {
  width: 97%;
  margin-top: 40px;
}
.form-label {
  font-size: 12px;
  margin-bottom: 6px;
  color: rgb(140, 140, 140);
}
.introduction {
  margin-top: 25px;
}
.tags {
  margin-top: 25px;
  color: rgb(140, 140, 140);
}
.tag-add {
  margin: 0 6px;
}
.tags-input {
  display: flex;
}
.tag-count {
  display: flex;
  align-items: center;
}
.tag-detail {
  margin-top: 10px;
}
.tip-blue {
  color: #1677ff;
}
.tag-tip {
  margin-top: 20px;
  font-size: 12px;
  color: rgba(91, 91, 91, 0.45);
}
.warn {
  margin-top: 6px;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
