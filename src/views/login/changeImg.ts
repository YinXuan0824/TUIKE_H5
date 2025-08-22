/*
 * @Author: YinXuan
 * @Date: 2023-07-13 14:35:28
 * @LastEditTime: 2023-07-14 13:22:50
 * @Description: 登陆页面背景动态切换功能
 */
// import bg0 from '@/assets/login/bg0.jpg'
// import bg1 from '@/assets/login/bg1.jpg'
// import bg2 from '@/assets/login/bg2.jpg'
// import bg3 from '@/assets/login/bg3.jpg'
var backImg: string
var img0: any
var img1: any
var img2: any
var img3: any

// 添加图片预加载功能
export function preLoadImg() {
  addLoadEvent(preload())
}

function preload() {
  img0 = new Image() //创建一个img对象
  img0.src = '/static/img/login/bg0.jpg' //图片地址
  img1 = new Image()
  img1.src = '/static/img/login/bg1.jpg'
  img2 = new Image()
  img2.src = '/static/img/login/bg2.jpg'
  img3 = new Image()
  img3.src = '/static/img/login/bg3.jpg'
}

function addLoadEvent(fun: any) {
  // 把已经加载完成的函数赋值给oldnload变量
  let oldonload = window.onload
  if (typeof window.onload != 'function') {
    window.onload = fun
  } else {
    window.onload = function () {
      // 这里执行了刚才赋值变量的函数
      oldonload
      // 这里是执行了传进来的func参数
      fun()
    }
  }
}

export function showBackImg() {
  let index = parseInt('' + 4 * Math.random())
  // let index = 0
  switch (index) {
    case 0:
      backImg = img0.src
      break
    case 1:
      backImg = img1.src
      break
    case 2:
      backImg = img2.src
      break
    case 3:
      backImg = img3.src
      break
    default:
      backImg = img3.src
      break
  }
  return backImg
}
