<template>
  <div class="video">
    <AMenu class="video__menu" />
    <AMain class="video__main" />
  </div>
</template>

<script setup>
import AMenu from './menu.vue'
import AMain from './main.vue'
</script>

<style scoped>
.video {
  display: flex;
  height: calc(100vh - 80px);
}
.video__menu {
  min-width: 200px;
  border-right: 2px solid #e8e8e8;
}
.video__main {
  flex: 1;
  background-color: #f7f7f7;
  padding: 16px;
}
</style>
