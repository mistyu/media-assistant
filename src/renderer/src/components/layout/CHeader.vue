<template>
  <div class="header">
    <CLogo class="logo" />
    <CMenu class="menu" />
  </div>
</template>

<script setup>
import CLogo from './CLogo.vue'
import CMenu from './CMenu.vue'
</script>

<style scoped>
.header {
  display: flex;
  height: 80px;
  width: 100%;
}
.logo {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu {
  flex: 8;
  display: flex;
  justify-content: start;
  align-items: center;
}
</style>
