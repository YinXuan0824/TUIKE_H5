/*
 * @Author: YinXuan
 * @Date: 2023-09-08 09:22:30
 * @LastEditTime: 2023-09-11 09:21:28
 * @Description:
 */
import { ElLoading } from 'element-plus'

let loading: { close: () => void }
function openLoading(text = 'Loading...') {
  loading = ElLoading.service({
    lock: true,
    text: text,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function closeLoading() {
  setTimeout(() => {
    loading.close()
  }, 1000)
}
export { openLoading, closeLoading }
