<template>
  <div class="ai-edit">
    <AMenu class="a-edit__menu" />
    <AMain class="a-edit__main" />
  </div>
</template>

<script setup>
import AMenu from './menu.vue'
import AMain from './main.vue'
</script>

<style scoped>
.ai-edit {
  display: flex;
  height: calc(100vh - 80px);
}
.a-edit__menu {
  min-width: 200px;
}
.a-edit__main {
  flex: 1;
}
</style>
