/*
 * @Author: YinXuan
 * @Date: 2023-08-07 15:47:14
 * @LastEditTime: 2025-04-23 09:28:47
 * @Description: 新增 用户管理 类型
 */
export interface userManageQuery extends PageQuery {
  // 用户名
  userName?: string
}
export interface userManageForm {
  id?: number

  // 用户名
  userName?: string

  // 密码
  password?: string

  // 手机号
  phoneNumber?: string

  // 邮箱
  email?: string

  // 角色id
  roleId?: number

  // 是否为商户用户
  merchantFlag?: boolean

  // 商户id
  merchantId?: number

  // 场库id
  warehouseId?: number
}

/**
 * 角色管理
 */
export interface roleManageQuery extends PageQuery {
  // 角色名称
  roleName?: string
}
export interface roleManageForm {
  id?: number

  // 角色名称
  roleName?: string

  // 菜单列表
  roleMenuList?: string[]

  // 状态
  status?: number
}

/**
 * 车主用户
 */
export interface carOwnerManageQuery extends PageQuery {
  // 账号
  userName?: string
  // 昵称
  nickName?: string
  // 手机号
  phoneNumber?: string
}
export interface carOwnerManageForm {
  id?: number

  // 昵称
  nickName?: string

  // 手机号
  phoneNumber?: string

  // 密码
  password?: string

  // 是否停用 0 正常 1 停用 目前未使用
  status?: number

  // 角色 1 普通用户 2 管理员
  roleType?: number
}
