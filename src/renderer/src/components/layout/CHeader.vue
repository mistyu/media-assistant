<template>
  <div class="header">
    <CLogo class="logo" />
    <CMenu />
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
  box-shadow: 0 4px 4px -2px rgba(181, 181, 181, 0.3);
}
.logo {
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
