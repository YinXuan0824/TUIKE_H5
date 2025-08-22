/*
 * @Author: YinXuan
 * @Date: 2023-08-24 09:54:38
 * @LastEditTime: 2023-08-24 10:04:46
 * @Description: 设备管理Hooks
 */
export default function () {
  // 打开导入Excel抽屉
  const isOpenExportDrawer = ref(false)
  const openExportDrawer = () => {
    isOpenExportDrawer.value = true
  }

  /**
   * 下载Excel模板
   */
  const useDownloadBluetoothGateway = function (title: string, apiFun?: any) {
    return new Promise<void>(resolve => {
      apiFun().then((res: any) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        })
        const a = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 下载的链接
        a.href = href
        // 获取后台设置的文件名称
        // let title = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1])
        a.download = `${title}.xlsx`
        document.body.appendChild(a)
        a.click() // 点击导出
        document.body.removeChild(a) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    })
  }

/**
   * 下载Excel模板
   */
  const useExportExcel = function (title: string, apiFun?: any, params?: any) {
    return new Promise<void>(resolve => {
      apiFun(params).then((res: any) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        })
        const a = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 下载的链接
        a.href = href
        // 获取后台设置的文件名称
        // let title = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1])
        a.download = `${title}.xlsx`
        document.body.appendChild(a)
        a.click() // 点击导出
        document.body.removeChild(a) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    })
  }

  return {
    isOpenExportDrawer,
    openExportDrawer,
    useDownloadBluetoothGateway,
    useExportExcel
  }
}
