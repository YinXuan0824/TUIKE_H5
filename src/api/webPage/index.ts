/*
 * @Author: YinXuan/WUYuHan
 * @Date: 2023-10-24 09:36:33
 * @LastEditTime: 2025-08-20 16:28:01
 * @Description: WebPage API
 */
import reqWeb from '@/utils/reqWeb'
import { AxiosPromise } from 'axios'
import { LoginData, LoginResult } from '../auth/types'

/**
 * 获取AI推荐直播列表
 */
export function getAigcRecommendLivesList(queryParams: any) {
  return reqWeb({
    url: '/api/aigc_recommend_lives_list/',
    method: 'get',
    params: queryParams
  })
}

/**
 * 获取AI智能体
 */
export function getAigcOtherLiveVideos(queryParams: any) {
  return reqWeb({
    url: '/api/aigc_other_live_videos/',
    method: 'get',
    params: queryParams
  })
}

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginH5Api(data: LoginData): AxiosPromise<LoginResult> {
  return reqWeb({
    url: '/sys/user/loginApplet',
    method: 'post',
    data: data
  })
}

/**
 * 获取手机验证码
 *
 * @param phoneNum
 */
export function getPhoneCode(queryParams: any) {
  return reqWeb({
    url: '/sys/msgCode/createMsgCode/' + queryParams,
    method: 'get'
  })
}

/**
 * 立即预约
 *
 * @param phoneNum
 */
export function gettripOrder(data: any) {
  return reqWeb({
    url: '/appletClient/tripOrder/save',
    method: 'post',
    data: data
  })
}

/**
 * 获取已经预约了订单数据
 */
export function getOrderReview(data: any) {
  return reqWeb({
    url: '/appletClient/tripOrder/queryById',
    method: 'post',
    data: data
  })
}

/**
 * 取消预约
 *
 * @param phoneNum
 */
export function getCancelOrder(queryParams: any) {
  return reqWeb({
    url: '/appletClient/tripOrder/cancelOrder',
    method: 'put',
    data: queryParams
  })
}

/**
 * 行程订单评价新增
 *
 */
export function fetChevaluateSave(data: any) {
  return reqWeb({
    url: '/appletClient/tripOrderAssess/save',
    method: 'post',
    data: data
  })
}

/**
 * 获取 车辆信息 全部列表
 *
 * @param data
 */
export function fetchCarInfoManageh5AllList(data: any) {
  return reqWeb({
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
export function fetchSiteManageh5AllList(data: any) {
  return reqWeb({
    url: '/serverClient/park/busStopInfo/allList',
    method: 'post',
    data: data
  })
}

/**
 * 获取 精准点 全部列表
 *
 * @param data
 */
export function fetchSationReserveAllList(data: any) {
  return reqWeb({
    url: '/serverClient/park/stationPointInfo/allList',
    method: 'post',
    data: data
  })
}

/**
 * 管理员 选点模式 预约
 */
export function postSaveMode(data: any) {
  return reqWeb({
    url: '/appletClient/tripOrder/saveMode',
    method: 'post',
    data: data
  })
}

/**
 * 修改系统模式
 */
export function postUpdateItem(data: any) {
  return reqWeb({
    url: '/sys/param/updateItem',
    method: 'post',
    data: data
  })
}

/**
 * 控制车辆行驶
 */
export function postControlDrive(data: any) {
  return reqWeb({
    url: '/appletClient/tripOrder/controlDrive',
    method: 'post',
    data: data
  })
}

/**
 * 车门控制
 */
export function postControlDoor(data: any) {
  return reqWeb({
    url: '/appletClient/tripOrder/controlDoor',
    method: 'post',
    data: data
  })
}
