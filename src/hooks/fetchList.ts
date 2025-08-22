/*
 * @Author: YinXuan
 * @Date: 2023-07-26 16:02:38
 * @LastEditTime: 2025-05-14 14:25:47
 * @Description:
 */
import { fetchCarInfoManageAllList, fetchSiteManageAllList } from '@/api/common'
import { fetchCarInfoManageh5AllList, fetchSiteManageh5AllList, fetchSationReserveAllList } from '@/api/webPage'
export default function () {
  // 获取所有 车辆信息
  function getAllCarInfoManageData(queryParams: any) {
    return new Promise(resolve => {
      fetchCarInfoManageAllList(queryParams).then(({ data }) => {
        resolve(data)
      })
    })
  }

  // 获取所有 站点信息
  function getAllSiteManageData(queryParams: any) {
    return new Promise(resolve => {
      fetchSiteManageAllList(queryParams).then(({ data }) => {
        resolve(data)
      })
    })
  }

  // 获取所有 车辆信息
  function getAllCarInfoManageh5Data(queryParams: any) {
    return new Promise((resolve, reject) => {
      fetchCarInfoManageh5AllList(queryParams)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  // 获取所有 站点信息
  function getAllSiteManagh5eData(queryParams: any) {
    return new Promise((resolve, reject) => {
      fetchSiteManageh5AllList(queryParams)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  // 获取所有 精准点信息
  function getAllSationReserveData(queryParams: any) {
    return new Promise((resolve, reject) => {
      fetchSationReserveAllList(queryParams)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  return {
    getAllCarInfoManageData,
    getAllSiteManageData,
    getAllSiteManagh5eData,
    getAllCarInfoManageh5Data,
    getAllSationReserveData
  }
}
