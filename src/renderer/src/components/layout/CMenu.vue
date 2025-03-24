<template>
  <ul class="menus">
    <li
      v-for="(menu, index) in menus"
      :key="menu.path"
      :class="['menu', active === index && 'active']"
      @click="onActive(index)"
    >
      <!-- <div class="icon"><component :is="menu.icon" /></div> -->
      <img class="icon" :src="active === index ? active1 : active2" />
      <div class="name">{{ menu.name }}</div>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { menus } from '../../const/menus'
import active1 from '../../assets/icons/video-menu-active.svg'
import active2 from '../../assets/icons/video-menu.svg'
import { useRouter } from 'vue-router'
const router = useRouter()
const active = ref(0)
const onActive = (index) => {
  active.value = index
  if (index === 0) {
    router.push({
      path: '/video/publish'
    })
  } else {
    router.push({
      path: '/ai/edit'
    })
  }
}
</script>

<style scoped>
.menus {
  margin-bottom: 0;
  display: flex;
}
.icon {
  display: flex;
  width: 26px;
  height: 26px;
  justify-content: center;
  align-items: center;
}
.menu {
  cursor: pointer;
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.name {
  font-size: 14px;
  margin-top: 8px;
}
.active {
  color: #1677ff;
}
</style>
