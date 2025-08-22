/*
 * @Author: YinXuan
 * @Date: 2024-12-23 13:52:09
 * @LastEditTime: 2025-05-14 13:34:39
 * @Description: 运营管理
 */
export const Layout = () => import('@/layout/index.vue')
export const operateManageRouter: any = [
  {
    path: '/operateManage',
    component: Layout,
    name: 'operateManage',
    meta: { title: '运营管理', icon: 'operateManage' },
    children: [
      {
        path: '/operateManage/siteManage',
        component: () => import(/* webpackChunkName: "siteManage" */ '@/views/operateManage/siteManage.vue'),
        name: 'siteManage',
        meta: { title: '站点管理', icon: 'siteManage' }
      },
      {
        path: '/operateManage/channelManage',
        component: () => import(/* webpackChunkName: "channelManage" */ '@/views/operateManage/channelManage.vue'),
        name: 'channelManage',
        meta: { title: '途径点管理', icon: 'channelManage' }
      },
      {
        path: '/operateManage/reserveManage',
        component: () => import(/* webpackChunkName: "reserveManage" */ '@/views/operateManage/reserveManage.vue'),
        name: 'reserveManage',
        meta: { title: '精准点管理', icon: 'siteManage' }
      },
      {
        path: '/operateManage/carInfoManage',
        component: () => import(/* webpackChunkName: "carInfoManage" */ '@/views/operateManage/carInfoManage.vue'),
        name: 'carInfoManage',
        meta: { title: '车辆信息', icon: 'carInfoManage' }
      },
      {
        path: '/operateManage/safeManage',
        component: () => import(/* webpackChunkName: "safeManage" */ '@/views/operateManage/safeManage.vue'),
        name: 'safeManage',
        meta: { title: '安全员管理', icon: 'safeManage' }
      },
      {
        path: '/operateManage/orderManage',
        component: () => import(/* webpackChunkName: "orderManage" */ '@/views/operateManage/orderManage.vue'),
        name: 'orderManage',
        meta: { title: '订单管理', icon: 'orderManage' }
      },
      {
        path: '/operateManage/evaluateManage',
        component: () => import(/* webpackChunkName: "evaluateManage" */ '@/views/operateManage/evaluateManage.vue'),
        name: 'evaluateManage',
        meta: { title: '评价管理', icon: 'evaluateManage' }
      }
    ]
  }
]
