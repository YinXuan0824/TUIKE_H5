/*
 * @Author: YinXuan
 * @Date: 2023-07-11 11:13:26
 * @LastEditTime: 2024-12-19 14:54:15
 * @Description: 项目初始化
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { setupStore } from '@/store'
import { setupDirective } from '@/directive'
// 包括CSS
import 'vue-data-ui/style.css'
// 您可以全局声明 Vue Data UI 组件
import { VueDataUi } from 'vue-data-ui'
import '@/permission'

// 本地SVG图标
import 'virtual:svg-icons-register'

// 样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import 'uno.css'
import 'animate.css'
// 引入Elmessage和Elloading的css样式文件
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import baiduMap from 'vue3-baidu-map-gl'
// 全局引入DataV
import DataVVue3 from '@kjgl77/datav-vue3'
import dayjs from 'dayjs'

const app = createApp(App)
// 全局注册 自定义指令(directive)
setupDirective(app)
// 全局注册 状态管理(store)
setupStore(app)
app.component('VueDataUi', VueDataUi)
app.use(baiduMap, {
  ak: 'DlnseWOcoBcQOmoDaLgwPAcTVeMghQIa',
  plugins: ['TrackAnimation']
})
app.use(router)
app.use(DataVVue3)
app.mount('#app')
//全局挂载
app.config.globalProperties.dayjs = dayjs
