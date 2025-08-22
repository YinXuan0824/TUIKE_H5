/*
 * @Author: YinXuan
 * @Date: 2023-07-17 13:10:02
 * @LastEditTime: 2024-12-25 14:19:53
 * @Description:
 */
/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  userName: string
  /**
   * 密码
   */
  password?: string
  /**
   * 验证码
   */
  verifyCode?: string
  msgCode?: string
}

/**
 * 登录响应
 */
export interface LoginResult {
  /**
   * 访问token
   */
  access_token?: string
  tokenH5?: string
  loginUser?: any
  /**
   * 访问token
   */
  accessToken?: string
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number
  /**
   * 刷新token
   */
  refreshToken?: string
  /**
   * token 类型
   */
  tokenType?: string
  // 用户名
  userName: string
  // 菜单树
  treeList: any
}
