<template>
  <div>
    <ul>
      <li :class="['menu', active === 0 && 'active']" @click="onActive(0)">
        <img class="icon" src="../../assets/icons/publish.svg" />
        <span>AI混剪</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const active = ref(1)
const router = useRouter()
const onActive = (index) => {
  active.value = index
  if (index === 0) {
    router.push('edit')
  }
}
</script>

<style scoped>
.menu {
  height: 48px;
  display: flex;
  padding-left: 20px;
  align-items: center;
  cursor: pointer;
  margin-top: 2px;
}
.active {
  background: #e4efff;
}
.menu:hover {
  background: #e4efff;
}
.icon {
  width: 20px;
  margin-right: 6px;
  color: #1677ff;
}
.my-video {
  width: 18px;
}
</style>
