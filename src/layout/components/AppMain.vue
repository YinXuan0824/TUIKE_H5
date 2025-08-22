<!--
 * @Author: YinXuan
 * @Date: 2023-07-17 13:10:02
 * @LastEditTime: 2024-10-17 15:44:49
 * @Description: 
-->
<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <component overflow-y-scroll :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;

  /* 50= navbar  50  */
  min-height: calc(100vh - 60px);
  overflow: auto;
  // background-color: var(--el-bg-color-page);
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - 60px);
    height: calc(100vh - 60px);
  }
  .fixed-header + .app-main {
    min-height: 100vh;
    padding-top: 90px;
  }
}
</style>
