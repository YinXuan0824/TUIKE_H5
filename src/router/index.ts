/*
 * @Author: YinXuan
 * @Date: 2023-07-11 12:19:46
 * @LastEditTime: 2024-12-25 15:11:11
 * @Description:
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { indexRouter, operateManageRouter, systemManageRouter } from './common/index'
export const Layout = () => import('@/layout/index.vue')

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [...indexRouter, ...operateManageRouter, ...systemManageRouter]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
}

/**
 * 重置路由
 */
export function resetRouterH5() {
  router.replace({ path: '/busLogin' })
}
export default router
