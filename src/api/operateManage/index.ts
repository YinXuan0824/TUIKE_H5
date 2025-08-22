/*
 * @Author: YinXuan
 * @Date: 2024-12-23 14:59:39
 * @LastEditTime: 2025-05-14 09:54:05
 * @Description: 运营管理
 */
import request from '@/utils/request'

/**
 * 获取 站点管理 列表
 *
 * @param data
 */
export function fetchSiteManageList(data: any) {
  return request({
    url: '/serverClient/park/busStopInfo/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增 站点管理
 *
 * @param data
 */
export function saveSiteManage(data: any) {
  return request({
    url: '/serverClient/park/busStopInfo/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除 站点管理
 *
 */
export function deleteSiteManage(list: any) {
  return request({
    url: '/serverClient/park/busStopInfo/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 修改 站点管理
 *
 */
export function editSiteManage(data: any) {
  return request({
    url: '/serverClient/park/busStopInfo/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取 途径点管理 列表
 *
 * @param data
 */
export function fetchChannelManageList(data: any) {
  return request({
    url: '/serverClient/park/routePoint/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增 途径点管理
 *
 * @param data
 */
export function saveChannelManage(data: any) {
  return request({
    url: '/serverClient/park/routePoint/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除 途径点管理
 *
 */
export function deleteChannelManage(list: any) {
  return request({
    url: '/serverClient/park/routePoint/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 修改 途径点管理
 *
 */
export function editChannelManage(data: any) {
  return request({
    url: '/serverClient/park/routePoint/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取 预约点管理 列表
 *
 * @param data
 */
export function fetchStationManageList(data: any) {
  return request({
    url: '/serverClient/park/stationPointInfo/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增 预约点管理
 *
 * @param data
 */
export function saveStationManage(data: any) {
  return request({
    url: '/serverClient/park/stationPointInfo/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除 预约点管理
 *
 */
export function deleteStationManage(list: any) {
  return request({
    url: '/serverClient/park/stationPointInfo/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 修改 预约点管理
 *
 */
export function editStationManage(data: any) {
  return request({
    url: '/serverClient/park/stationPointInfo/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取 安全员管理 列表
 *
 * @param data
 */
export function fetchSafeManageList(data: any) {
  return request({
    url: '/serverClient/park/securityOfficerInfo/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增 安全员管理
 *
 * @param data
 */
export function saveSafeManage(data: any) {
  return request({
    url: '/serverClient/park/securityOfficerInfo/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除 安全员管理
 *
 */
export function deleteSafeManage(list: any) {
  return request({
    url: '/serverClient/park/securityOfficerInfo/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 修改 安全员管理
 *
 */
export function editSafeManage(data: any) {
  return request({
    url: '/serverClient/park/securityOfficerInfo/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取 车辆信息 列表
 *
 * @param data
 */
export function fetchCarInfoManageList(data: any) {
  return request({
    url: '/serverClient/park/vehicleInfo/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增 车辆信息
 *
 * @param data
 */
export function saveCarInfoManage(data: any) {
  return request({
    url: '/serverClient/park/vehicleInfo/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除 车辆信息
 *
 */
export function deleteCarInfoManage(list: any) {
  return request({
    url: '/serverClient/park/vehicleInfo/delete',
    method: 'delete',
    data: list
  })
}

/**
 * 修改 车辆信息
 *
 */
export function editCarInfoManage(data: any) {
  return request({
    url: '/serverClient/park/vehicleInfo/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取 线路下拉列表
 *
 */
export function fetchLineList(data: any) {
  return request({
    url: '/serverClient/park/busStopInfo/lineList',
    method: 'post',
    data: data
  })
}

/**
 * 获取 行程订单评价 列表
 *
 * @param data
 */
export function fetchEvaluateManageList(data: any) {
  return request({
    url: '/serverClient/tripOrderAssess/list',
    method: 'post',
    data: data
  })
}

/**
 * 获取 订单 列表
 *
 * @param data
 */
export function fetchOrderManageList(data: any) {
  return request({
    url: '/serverClient/tripOrder/list',
    method: 'post',
    data: data
  })
}
