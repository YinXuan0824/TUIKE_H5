/*
 * @Author: YinXuan
 * @Date: 2023-07-21 15:00:30
 * @LastEditTime: 2024-12-23 09:46:11
 * @Description: 系统管理
 */
export const Layout = () => import('@/layout/index.vue')
export const systemManageRouter: any = [
  {
    path: '/systemManage',
    component: Layout,
    name: 'systemManage',
    meta: { title: '系统管理', icon: 'systemManage' },
    children: [
      {
        path: '/systemManage/userManage',
        component: () => import(/* webpackChunkName: "userManage" */ '@/views/systemManage/userManage.vue'),
        name: 'userManage',
        meta: { title: '系统用户', icon: 'userManage' }
      },
      {
        path: '/systemManage/roleManage',
        component: () => import(/* webpackChunkName: "roleManage" */ '@/views/systemManage/roleManage.vue'),
        name: 'roleManage',
        meta: { title: '角色管理', icon: 'roleManage' }
      },
      {
        path: '/systemManage/menuManage',
        component: () => import(/* webpackChunkName: "menuManage" */ '@/views/systemManage/menuManage.vue'),
        name: 'menuManage',
        meta: { title: '菜单管理', icon: 'menuManage' }
      },
      {
        path: '/systemManage/carOwnerManage',
        component: () => import(/* webpackChunkName: "carOwnerManage" */ '@/views/systemManage/carOwnerManage.vue'),
        name: 'carOwnerManage',
        meta: { title: '车主用户', icon: 'carOwnerManage' }
      }
    ]
  }
]
