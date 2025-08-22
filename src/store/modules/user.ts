import { defineStore } from 'pinia'

import { loginApi, logoutApi } from '@/api/auth'
import { loginH5Api } from '@/api/webPage'
import { getUserInfo } from '@/api/user'
import { resetRouter } from '@/router'
import { store } from '@/store'
import dayjs from 'dayjs'
import { LoginData } from '@/api/auth/types'
import { UserInfo } from '@/api/user/types'

import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  // state
  const userId = ref()
  const token = useStorage('access_token', '')
  const sysUser: any = useStorage('sysUser', {})
  const tokenExpireTime: any = useStorage('tokenExpireTime', '')
  const menuList: any = useStorage('menuList', [])
  const nickname = useStorage('nickname', '')
  const tokenH5 = useStorage('tokenH5', '')
  const phoneUser: any = useStorage('phoneUser', {})
  const avatar = ref('')
  const roles = ref<Array<string>>([]) // 用户角色编码集合 → 判断路由权限
  const perms = ref<Array<string>>([]) // 用户权限编码集合 → 判断按钮权限

  /**
   * 登录调用
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then(res => {
          token.value = res.data.access_token
          sysUser.value = res?.data?.loginUser?.sysUser
          nickname.value = res?.data?.loginUser?.sysUser.userName
          menuList.value = res?.data?.treeList
          ElMessage.success('登录成功')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const router = useRouter()
  /**
   * H5登录调用
   *
   * @param {LoginData}
   * @returns
   */
  function loginH5(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginH5Api(loginData)
        .then(res => {
          tokenH5.value = res.data.access_token
          phoneUser.value = res?.data?.loginUser?.sysUser
          // roleType：角色类型 1普通 2管理员
          // modeType：当前模式：1线路模式 2选点模式
          if (phoneUser.value.roleType === 1) {
            ElMessage.success('登录成功')
            router.push('/busReserve')
          } else {
            if (phoneUser.value.modeType === 2) {
              ElMessage.success('登录成功')
              router.push('/vipReserve')
            } else if (phoneUser.value.modeType === 1) {
              ElMessage.success('登录成功')
              router.push('/busReserve')
            } else {
              ElMessage.success('登录成功')
              router.push('/stationReserve')
            }
          }
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 重置
  function resetTokenH5() {
    tokenH5.value = ''
    phoneUser.value = {}
  }

  function refreshTokenExpireTime() {
    tokenExpireTime.value = dayjs().add(30, 'minute')
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfo()
        .then(({ data }) => {
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          if (!data.roles || data.roles.length <= 0) {
            reject('getUserInfo: roles must be a non-null array!')
          }
          userId.value = data.userId
          nickname.value = data.nickname
          avatar.value = data.avatar
          roles.value = data.roles
          perms.value = data.perms
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter()
          resetToken()
          location.reload() // 清空路由
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 注销
  function logoutMerChant() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter()
          resetToken()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 重置
  function resetToken() {
    token.value = ''
    tokenExpireTime.value = ''
    nickname.value = ''
    avatar.value = ''
    roles.value = []
    perms.value = []
    menuList.value = []
  }
  return {
    token,
    tokenExpireTime,
    nickname,
    avatar,
    roles,
    perms,
    login,
    refreshTokenExpireTime,
    getInfo,
    logout,
    logoutMerChant,
    resetToken,
    resetTokenH5,
    /**
     * 当前登录用户ID
     */
    userId,
    menuList,
    tokenH5,
    phoneUser,
    loginH5
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
