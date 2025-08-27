/*
 * @Author: YinXuan
 * @Date: 2023-07-19 10:35:09
 * @LastEditTime: 2025-08-26 12:11:53
 * @Description:
 */
export const Layout = () => import('@/layout/index.vue')
export const indexRouter: any = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    meta: { title: '首页', icon: 'homepage', affix: true },
    children: [
      {
        path: '/dashboard',
        // 路由懒加载
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'homepage',
        meta: { title: '首页', icon: 'homepage', affix: true }
      },
      {
        path: '/401',
        component: () => import('@/views/error-page/401.vue'),
        name: '401',
        meta: { title: '401', hidden: true }
      },
      {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        name: '404',
        meta: { title: '404', hidden: true }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'redirect',
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/home.vue'),
    meta: { title: '推氪AI', hidden: true }
  }
]
