/*
 * @Author: YinXuan
 * @Date: 2023-12-22 13:52:33
 * @LastEditTime: 2024-09-17 14:59:10
 * @Description: 全局js
 */
// 用于 根据车牌号判断颜色
export function checkPlateNoColor(plateNo: any) {
  if (!plateNo) {
    return '-'
  }
  if (plateNo.length === 8) {
    return 'linear-gradient(90deg, #31E24F, #02D1FD)'
  } else {
    return 'linear-gradient(90deg, #095FEE, #02D1FD)'
  }
}
