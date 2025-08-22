/*
 * @Author: YinXuan
 * @Date: 2023-07-11 12:19:45
 * @LastEditTime: 2024-12-20 15:01:42
 * @Description: 修改登录接口
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { LoginData, LoginResult } from './types'

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: '/sys/user/login',
    method: 'post',
    data: data
  })
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: '/sys/user/logout',
    method: 'delete'
  })
}

/**
 * 获取图片验证码
 */
export function loginVerify(data: any) {
  return request({
    url: '/sys/user/verify',
    method: 'get',
    responseType: 'blob',
    data: data
  })
}
