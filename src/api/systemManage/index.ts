/*
 * @Author: YinXuan
 * @Date: 2023-08-07 15:47:09
 * @LastEditTime: 2024-12-23 15:01:57
 * @Description: 新增 用户管理 接口
 */
import request from '@/utils/request'

/**
 * 获取 用户管理
 *
 * @param data
 */
export function fetchUserManageList(data: any) {
  return request({
    url: '/serverClient/sys/user/list',
    method: 'post',
    data: data
  })
}
/**
 * 新增 用户管理
 *
 * @param data
 */
export function saveUserManage(data: any) {
  return request({
    url: '/serverClient/sys/user/save',
    method: 'post',
    data: data
  })
}
/**
 * 删除 用户管理
 *
 */
export function deleteUserManage(id: number) {
  return request({
    url: '/serverClient/sys/user/delete',
    method: 'delete',
    params: { id: id }
  })
}
/**
 * 修改 用户管理
 *
 */
export function editUserManage(data: any) {
  return request({
    url: '/serverClient/sys/user/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取 角色管理 列表
 *
 * @param data
 */
export function fetchRoleManageList(data: any) {
  return request({
    url: '/serverClient/sys/role/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增 角色管理
 *
 * @param data
 */
export function saveRoleManage(data: any) {
  return request({
    url: '/serverClient/sys/role/save',
    method: 'post',
    data: data
  })
}

/**
 * 批量删除 角色管理
 *
 */
export function batchDeleteRoleManage(list: any) {
  return request({
    url: '/serverClient/sys/role/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 修改 角色管理
 *
 */
export function editRoleManage(data: any) {
  return request({
    url: '/serverClient/sys/role/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取 角色管理 全部列表
 *
 * @param data
 */
export function fetchAllRoleManageList(data: any) {
  return request({
    url: '/serverClient/sys/role/all-list',
    method: 'post',
    data: data
  })
}

/**
 * 获取 车主用户 列表
 *
 * @param data
 */
export function fetchCarOwnerManageList(data: any) {
  return request({
    url: '/serverClient/sys/mobileUser/list',
    method: 'post',
    data: data
  })
}
/**
 * 新增 车主用户
 *
 * @param data
 */
export function saveCarOwnerManage(data: any) {
  return request({
    url: '/serverClient/sys/mobileUser/save',
    method: 'post',
    data: data
  })
}
/**
 * 删除 车主用户
 *
 */
export function deleteCarOwnerManage(list: any) {
  return request({
    url: '/serverClient/sys/mobileUser/delete',
    method: 'delete',
    data: list
  })
}
/**
 * 修改 车主用户
 *
 */
export function editCarOwnerManage(data: any) {
  return request({
    url: '/serverClient/sys/mobileUser/update',
    method: 'put',
    data: data
  })
}
