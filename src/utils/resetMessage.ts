/*
 * @Author: YinXuan
 * @Date: 2024-07-31 09:23:54
 * @LastEditTime: 2024-07-31 11:06:01
 * @Description: ElementPlus弹出框多次弹出问题
 * https://blog.csdn.net/g841805/article/details/135930572
 */
import { ElMessage } from 'element-plus' //引入message弹出框

let messageDom: any = null
const resetMessage: any = (options: any) => {
  if (messageDom) messageDom.close() // 判断弹窗是否已存在,若存在则关闭
  messageDom = ElMessage(options)
}
const typeArr = ['success', 'error', 'warning', 'info']
typeArr.forEach(type => {
  resetMessage[type] = (options: any) => {
    if (typeof options === 'string') options = { message: options }
    options.type = type
    return resetMessage(options)
  }
})
export const message = resetMessage
