<!--
 * @Author: YinXuan
 * @Date: 2023-07-11 11:13:26
 * @LastEditTime: 2023-12-03 15:42:07
 * @Description: 
-->
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { provide } from 'vue'
import { globalData } from '@/const/const'
import { useRoute, useRouter } from 'vue-router'
const appStore = useAppStore()
provide('globalData', globalData)
onMounted(() => {
  const route = useRoute()
  const router = useRouter()
  setTimeout(() => {
    const merchantFlag = localStorage.getItem('merchantFlag')
    if (merchantFlag === 'true' && route.name !== 'merchantBuy' && route.name !== 'customerBuy') {
      router.push({ path: '/merchantBuy' })
    }
  }, 300)
})
</script>

<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<style>
@import url(./assets/font/font.css);
/* * {
  font-family: 'Alibaba' !important;
} */
</style>
