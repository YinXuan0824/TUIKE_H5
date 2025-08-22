/*
 * @Author: YinXuan
 * @Date: 2024-11-08 10:33:05
 * @LastEditTime: 2024-11-08 10:33:14
 * @Description:
 */
/**
 * 数据上报
 */
export interface bluetoothGatewayQuery extends PageQuery {
  // 场库编号
  warehouseId?: number
  // 开始时间
  beginTime?: string
  // 结束时间
  endTime?: string
}
