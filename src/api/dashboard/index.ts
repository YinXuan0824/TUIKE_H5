/*
 * @Author: YinXuan
 * @Date: 2024-01-09 09:19:26
 * @LastEditTime: 2024-12-26 16:29:25
 * @Description: 首页表格接口
 */
import request from '@/utils/request'

/**
 * 获取 首页数据
 *
 * @param data
 */
export function fetchCarInfoData(data: any) {
  return request({
    url: '/serverClient/sys/home/vehicleInfo',
    method: 'post',
    data: data
  })
}

/**
 * 获取 停车统计接口
 *
 * @param data
 */
export function fetchHomeData(data: any) {
  return request({
    url: '/parking/sys/home/totalStatistics',
    method: 'post',
    data: data
  })
}

/**
 * 获取 场库统计信息，右下角表格和点击地图显示信息都用这个接口
 * 参数：warehouseId-下拉选id 可不传
 * 返回：warehouseName场库名称、orderNum订单总数、paymentAmount订单金额、
 * actualPayment实付金额
 * @param data
 */
export function fetchHomeTotalStatisticsDetail(data: any) {
  return request({
    url: '/parking/sys/home/totalStatisticsDetail',
    method: 'post',
    data: data
  })
}

/**
 * 获取 车辆停放次数
 *
 * @param data
 */
export function fetchHomeParkingData(data: any) {
  return request({
    url: '/parking/sys/home/statistics-parking',
    method: 'post',
    data: data
  })
}

/**
 * 获取 数据上报统计
 *
 * @param data
 */
export function fetchReportStatistics(data: any) {
  return request({
    url: '/parking/sys/home/reportStatistics',
    method: 'post',
    data: data
  })
}
