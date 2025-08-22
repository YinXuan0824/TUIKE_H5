/*
 * @Author: YinXuan
 * @Date: 2023-07-11 11:24:30
 * @LastEditTime: 2025-08-20 14:00:37
 * @Description: 添加路由
 */
import router from '@/router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
import NProgress from 'nprogress'
import { useTitle } from '@vueuse/core'
import 'nprogress/nprogress.css'
import dayjs from 'dayjs'
NProgress.configure({ showSpinner: false }) // 进度条

const permissionStore = usePermissionStoreHook()

// 白名单路由(不用登录也可以直接访问的页面)
const whiteList = [
  '/login',
  '/chat',
  '/busLogin',
  '/busFeedback',
  '/busReserve',
  '/vipReserve',
  '/busDrivingRoute',
  '/stationReserve'
]
router.beforeEach(async (to: any, from: any, next: any) => {
  NProgress.start()
  const hasToken = localStorage.getItem('access_token')
  const userStore = useUserStoreHook()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，跳转首页
      next({ path: '/dashboard' })
      NProgress.done()
    } else {
      if (to.matched.length === 0) {
        from.name ? next({ name: from.name }) : next('/dashboard')
      } else {
        try {
          if (permissionStore.routes.length === 15) {
            return
          }
          await permissionStore.handleStaticRoutes()
          next()
        } catch (error) {
          userStore.resetToken()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(to => {
  const title = useTitle()
  title.value = String(to.meta.title)
  NProgress.done()
})
