/*
 * @Author: YinXuan
 * @Date: 2024-03-03 15:55:42
 * @LastEditTime: 2024-12-12 15:29:16
 * @Description:
 */
const ak = 'DlnseWOcoBcQOmoDaLgwPAcTVeMghQIa'

// 声明 BMapGL 的类型
declare global {
  interface Window {
    BMapGL: any
    init: () => void
  }
}

/**
 * 异步加载百度地图
 * @returns {Promise}
 * @constructor
 */
export function loadBaiDuMap() {
  return new Promise(function (resolve, reject) {
    try {
      resolve(window.BMapGL)
    } catch (err) {
      window.init = function () {
        resolve(window.BMapGL)
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://api.map.baidu.com/api?v=3.0&type=webgl&ak=${ak}&callback=init`
      script.onerror = reject
      document.body.appendChild(script)
    }
  })
}
