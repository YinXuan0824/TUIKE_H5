/*
 * @Author: YinXuan
 * @Date: 2023-07-19 10:35:09
 * @LastEditTime: 2025-08-21 11:47:44
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
  },
  {
    path: '/busLogin',
    name: 'busLogin',
    component: () => import('@/views/busManage/busLogin.vue'),
    meta: { title: '无人小巴登录', hidden: true }
  },
  {
    path: '/busFeedback',
    name: 'busFeedback',
    component: () => import('@/views/busManage/busFeedback.vue'),
    meta: { title: '无人小巴反馈', hidden: true }
  },
  {
    path: '/busReserve',
    name: 'busReserve',
    component: () => import('@/views/busManage/busReserve.vue'),
    meta: { title: '无人小巴预约', hidden: true }
  },
  {
    path: '/vipReserve',
    name: 'vipReserve',
    component: () => import('@/views/busManage/vipReserve.vue'),
    meta: { title: '点对点模式预约', hidden: true }
  },
  {
    path: '/stationReserve',
    name: 'stationReserve',
    component: () => import('@/views/busManage/stationReserve.vue'),
    meta: { title: '预约点模式预约', hidden: true }
  },
  {
    path: '/busDrivingRoute',
    name: 'busDrivingRoute',
    component: () => import('@/views/busManage/busDrivingRoute.vue'),
    meta: { title: '无人小巴导航', hidden: true }
  }
]
