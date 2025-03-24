<template>
  <div class="main">
    <CHeader />
    <router-view></router-view>
  </div>
</template>

<script setup>
import CHeader from './components/layout/CHeader.vue'
</script>
