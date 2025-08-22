/*
 * @Author: YinXuan
 * @Date: 2023-07-17 13:10:02
 * @LastEditTime: 2023-09-27 16:07:57
 * @Description:
 */
import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { store } from '@/store'
import { fetchMenuManageList } from '@/api/menu'
import { useUserStoreHook } from '@/store/modules/user'

// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  const routes = ref<RouteRecordRaw[]>([])

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = newRoutes
    // routes.value = constantRoutes.concat(newRoutes)
  }

  function handleStaticRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      const userStore = useUserStoreHook()
      let routeData = deepRecurve(userStore.menuList)
      staticRoutes(routeData)
      resolve(routeData)
    })
  }

  function deepRecurve(list: any) {
    if (!list && list.length === 0) {
      return []
    }
    let result = list.map((item: any) => {
      return {
        path: item.url,
        name: item.component,
        meta: {
          title: item.menuName,
          icon: item.icon
        },
        children: item.childMenus && item.childMenus.length ? deepRecurve(item.childMenus) : []
      }
    })
    return result
  }

  function staticRoutes(accessRoutes: any) {
    return new Promise<void>((resolve, reject) => {
      let list1 = [...constantRoutes]
      let list2 = [...accessRoutes]
      let routesList: any = []
      list1.forEach((item: any) => {
        let newObj = item
        let obj = list2.find(item1 => {
          return item1.name === item.name
        })
        if (obj) {
          let children: any = []
          newObj.children.forEach((item2: any) => {
            let obj1 = obj?.children?.find((item3: any) => {
              return item3.name === item2.name
            })
            if (obj1) {
              children.push(item2)
            }
          })
          newObj.children = children
          routesList.push(newObj)
        }
      })
      setRoutes(routesList)
      resolve()
    })
  }
  return { routes, setRoutes, staticRoutes, handleStaticRoutes }
})

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
