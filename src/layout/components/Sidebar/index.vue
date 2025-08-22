<!--
 * @Author: YinXuan
 * @Date: 2023-07-17 13:10:02
 * @LastEditTime: 2024-12-26 15:29:59
 * @Description: 
-->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
// import Logo from './Logo.vue'

import { useSettingsStore } from '@/store/modules/settings'
import { usePermissionStore } from '@/store/modules/permission'
import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import variables from '@/styles/variables.module.scss'

const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const appStore = useAppStore()
const currRoute = useRoute()
const { sidebarLogo } = storeToRefs(settingsStore)

/**
 * 左侧菜单栏显示/隐藏
 */
function toggleSideBar() {
  appStore.toggleSidebar(true)
}
</script>

<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <!-- <logo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" /> -->
    <template v-if="appStore.sidebar.opened">
      <div class="company-logo"></div>
    </template>
    <template v-else>
      <div class="company-mini-logo">
        <div class="logo-img"></div>
      </div>
    </template>
    <el-scrollbar>
      <el-menu
        :default-active="currRoute.path"
        :collapse="!appStore.sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionStore.routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="!appStore.sidebar.opened"
          class="sidebar_text"
        />
      </el-menu>
    </el-scrollbar>

    <!-- <div class="menu-btn flex items-center justify-center" @click="toggleSideBar">
      <div class="btn_image"></div>
      <template v-if="appStore.sidebar.opened">
        <div class="ml10px">收起菜单</div>
      </template>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.company-logo {
  width: 100%;
  height: 80px;
  background-image: url('/src/assets/usual/com-logo.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin: 10px auto;
}
.company-mini-logo {
  width: 93px;
  height: 69px;
  margin: 10px auto;
  .logo-img {
    width: 50px;
    height: 50px;
    background: url('/src/assets/usual/mini-logo.png') 0% 80%;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
.menu-btn {
  width: 80%;
  height: 40px;
  line-height: 40px;
  background: rgba(223, 236, 255, 0.53);
  border-radius: 10px;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  text-align: center;
  margin: 50px auto 0;
  cursor: pointer;
  .btn_image {
    width: 11px;
    height: 10px;
    background-image: url('/src/assets/usual/zhedie.png');
    background-size: 100%;
    background-repeat: no-repeat;
  }
}
.sidebar_text {
  font-weight: bold;
}
</style>
