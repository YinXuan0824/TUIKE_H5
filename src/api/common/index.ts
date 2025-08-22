/*
 * @Author: YinXuan
 * @Date: 2023-07-20 13:30:20
 * @LastEditTime: 2024-12-24 11:03:33
 * @Description:
 */
import request from '@/utils/request'

/**
 * 获取 车辆信息 全部列表
 *
 * @param data
 */
export function fetchCarInfoManageAllList(data: any) {
  return request({
    url: '/serverClient/park/vehicleInfo/allList',
    method: 'post',
    data: data
  })
}

/**
 * 获取 站点 全部列表
 *
 * @param data
 */
export function fetchSiteManageAllList(data: any) {
  return request({
    url: '/serverClient/park/busStopInfo/allList',
    method: 'post',
    data: data
  })
}

/**
 * 获取位置信息接口
 *
 * @param data
 */
export function fetchPositionList() {
  return request({
    url: '/parking/sys/position/list',
    method: 'post',
    data: {}
  })
}

/**
 * 全局方法获取省市区列表，调用方法详见场库管理页面
 */
export function fetchPosition() {
  return new Promise(resolve => {
    fetchPositionList().then(({ data }) => {
      const list = deepList(data)
      resolve(list)
    })
  })
}

function deepList(list: any) {
  if (list && list.length) {
    return list.map((item: any) => {
      return {
        label: item.provinceName ? item.provinceName : item.cityName ? item.cityName : item.areaName,
        value: item.provinceCode ? item.provinceCode : item.cityCode ? item.cityCode : item.areaCode,
        children:
          item.cityList && item.cityList.length
            ? deepList(item.cityList)
            : item.areaList && item.areaList.length
            ? deepList(item.areaList)
            : []
      }
    })
  } else {
    return list
  }
}
