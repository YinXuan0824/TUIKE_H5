/*
 * @Author: YinXuan
 * @Date: 2024-12-23 14:59:44
 * @LastEditTime: 2025-01-09 14:40:34
 * @Description: 运营管理
 */
/**
 * 站点管理
 */
export interface siteManageQuery extends PageQuery {
  // 站点名称
  siteName?: string
}
export interface siteManageForm {
  id?: number

  // 站点名称
  siteName?: string

  // 经度
  lng?: string

  // 纬度
  lat?: string

  //  站点排序
  siteSort?: number

  // 途径线路
  lineId?: number

  // 站点编号
  siteNo?: string
  // 方向
  direction?: number

  // 覆盖面积(米)
  coverageRadius?: string
}

/**
 * 途径点管理
 */
export interface channelManageQuery extends PageQuery {
  // 途径点名称
  pointName?: string

  // 站点标识
  siteSign?: string
}
export interface channelManageForm {
  id?: number

  // 途径点名称
  pointName?: string

  // 经度
  lng?: string

  // 纬度
  lat?: string

  // 途径点排序
  pointSort?: number

  // 站点标识
  siteSign?: string

  // 途径线路
  lineId?: number
}

/**
 * 安全员管理
 */
export interface safeManageQuery extends PageQuery {
  // 姓名
  name?: string
}
export interface safeManageForm {
  id?: number

  // 姓名
  name?: string

  // 车辆id
  vehicleId?: string

  // 年龄
  age?: string

  // 性别 0-男 1-女
  gender?: string

  //  手机号
  phone?: string

  // 资格证编号
  qualificationsNo?: string

  // 有效期
  periodValidity?: string

  // 驾龄
  drivingExperience?: string
}

/**
 * 车辆信息
 */
export interface carInfoManageQuery extends PageQuery {
  // 车牌号
  plateNumber?: string
}
export interface carInfoManageForm {
  id?: number

  // 车牌号
  plateNumber?: string

  // 车辆编号
  vehicleNo?: string

  // 车辆照片地址
  image?: string

  // 车企厂商
  manufacturer?: string

  // 动力类型 1-新能源 2-燃油车
  powerType?: number

  // 自动驾驶级别
  autoDrivingLevel?: string

  // 线路名称
  lineId?: number
}

/**
 * 评价管理
 */
export interface evaluateManageQuery extends PageQuery {
  // 车牌号
  plateNumber?: string
  // 手机号
  phoneNumber?: string
  // 评价开始时间
  assessBeginTime?: string
  // 评价结束时间
  assessEndTime?: string
  // 评价等级
  assessLevel?: string
}

/**
 * 订单管理
 */
export interface orderManageQuery extends PageQuery {
  // 车牌号
  plateNumber?: string
  // 手机号
  phoneNumber?: string
  // 预约时间
  reserveBeginTime?: string
  // 预约时间
  reserveEndTime?: string
  // 行程开始时间
  tripStartBeginTime?: string
  // 行程开始时间
  tripStartEndTime?: string
  // 行程结束时间
  tripEndBeginTime?: string
  // 行程结束时间
  tripEndEndTime?: string
  // 订单状态
  orderStatusList?: any
}
