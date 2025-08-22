import request from '@/utils/request'
import { MenuForm } from './types'

/**
 * 获取 菜单管理
 *
 * @param data
 */
export function fetchMenuManageList(data: any) {
  return request({
    url: '/serverClient/sys/menu/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增 菜单管理
 *
 * @param data
 */
export function saveMenuManage(data: any) {
  return request({
    url: '/serverClient/sys/menu/save',
    method: 'post',
    data: data
  })
}

/**
 * 批量删除 菜单管理
 *
 */
export function batchDeleteMenuManage(list: any) {
  return request({
    url: '/serverClient/sys/menu/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 修改 菜单管理
 *
 */
export function editMenuManage(data: any) {
  return request({
    url: '/serverClient/sys/menu/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取路由列表
 */
export function listRoutes() {
  return request({
    url: '/api/v1/menus/routes',
    method: 'get'
  })
}

/**
 * 添加菜单
 *
 * @param data
 */
export function addMenu(data: MenuForm) {
  return request({
    url: '/api/v1/menus',
    method: 'post',
    data: data
  })
}

/**
 * 修改菜单
 *
 * @param id
 * @param data
 */
export function updateMenu(id: string, data: MenuForm) {
  return request({
    url: '/api/v1/menus/' + id,
    method: 'put',
    data: data
  })
}

/**
 * 删除菜单
 *
 * @param id 菜单ID
 */
export function deleteMenu(id: number) {
  return request({
    url: '/api/v1/menus/' + id,
    method: 'delete'
  })
}
