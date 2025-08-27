/*
 * @Author: YinXuan
 * @Date: 2023-07-11 12:20:30
 * @LastEditTime: 2025-08-27 14:15:38
 * @Description: 初始化项目
 */
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStoreHook } from '@/store/modules/user'
import { message } from '@/utils/resetMessage'
import { resetRouterH5 } from '@/router'
import { useRouter } from 'vue-router'
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_WEB_API,
  // 超时时间为50秒
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook()
    if (userStore.tokenH5) {
      config.headers.Authorization = userStore.tokenH5
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status, msg } = response.data
    if (status === 1) {
      return response.data
    }
    // if (status === 401) {
    //   message.error('当前页面已失效，请重新登录~')
    //   return Promise.reject(response.data)
    // }
    // message.error(msg || '系统出错，请稍后重试~')
    return Promise.reject(new Error(msg || 'Error'))
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data
      // token 过期,重新登录
      if (code === 401) {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          localStorage.clear()
          window.location.href = '/busLogin'
        })
      } else {
        // message.error(msg || '系统出错，请稍后重试~')
      }
    }
    return Promise.reject(error.message)
  }
)

// 导出 axios 实例
export default service
