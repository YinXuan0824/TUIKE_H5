<!--
 * @Author: YinXuan
 * @Date: 2023-07-11 12:19:46
 * @LastEditTime: 2024-10-10 17:01:43
 * @Description: 
-->
<script lang="ts" setup>
// Vue3组件内部使用全局变量
import { inject } from 'vue'
const globalData: any = inject('globalData')
defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="w-full h-[50px] logo">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="h-full w-full flex items-center justify-center" to="/">
        <svg-icon class="w-5 h-5 icon" icon-class="bg" />
        <!-- <span v-else class="ml-3 title">{{ globalData.title }}</span> -->
      </router-link>
      <router-link v-else key="expand" class="h-full w-full flex items-center justify-center" to="/">
        <!-- <svg-icon class="w-5 h-5 icon" icon-class="bg" /> -->
        <span class="title">{{ globalData.title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: rgba(50, 55, 66, 1);
  font-size: 18px;
  font-weight: bold;
  // color: #ffffff;
  // 90deg, #0827F4, #0D59F7
  background: linear-gradient(0deg, #65b3ee 0%, #0827f4 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
// https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}

.sidebarLogoFade-leave-active,
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
</style>
