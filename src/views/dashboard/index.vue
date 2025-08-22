<!--
 * @Author: WuYuHan
 * @Date: 2024-12-16 11:16:03
 * @LastEditTime: 2025-05-13 09:27:46
 * @Description: 
-->
<template>
  <div class="dashboard-container">
    <div class="dashboard-main">
      <div class="left-cell">
        <div class="top-select">
          <span>选择车辆：</span>
          <el-select v-model="plateNumber" placeholder="请选择车辆" style="width: 240px">
            <el-option v-for="item in carInfoList" :key="item.id" :label="item.plateNumber" :value="item.plateNumber" />
          </el-select>
        </div>
        <div class="box-header">
          <div class="box-line"></div>
          <div class="box-title">车辆状况</div>
        </div>
        <div class="vehicle-message">
          <div class="img" :style="{ 'background-image': 'url(' + carInfo.image + ')' }"></div>
          <div class="vehicle-right">
            <div class="top-title">
              <div>{{ plateNumber }}</div>
              <div
                class="right-text"
                :class="carInfo.vehicleStatus === 2 ? 'c-red' : carInfo.vehicleStatus === 0 ? 'c-orange' : 'c-green'"
              >
                {{ carInfo.vehicleStatus === 2 ? '故障' : carInfo.vehicleStatus === 0 ? '离线' : '正常' }}
              </div>
            </div>
            <div class="text-box"><span mr-11>车辆品牌</span><span>中车</span></div>
            <div class="text-box">
              <span mr-8>待切换路线</span><span>{{ carInfo.lineName || '-' }}</span>
            </div>
            <div class="text-box">
              <span mr-5>车辆行驶路线</span><span>{{ carInfo.drivingLineName || '-' }}</span>
            </div>
            <div class="text-box">
              <span mr-5>自动驾驶等级</span><span>{{ carInfo.autoDrivingLevel || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="box-header">
          <div class="box-line"></div>
          <div class="box-title">行车统计</div>
        </div>
        <div class="vehicle-statistic">
          <div class="statistic-box">
            <div class="number">{{ carInfo.operateDuration || '-' }}</div>
            <div class="msg-time">累计运营时长(h)</div>
          </div>
          <div class="statistic-box">
            <div class="number">{{ carInfo.totalAutoDrvMileage || '-' }}</div>
            <div class="msg-time">总里程(km)</div>
          </div>
          <div class="statistic-box">
            <div class="number">{{ carInfo.autoDuration || '-' }}</div>
            <div class="msg-time">总自动驾驶里程(km)</div>
          </div>
          <div class="statistic-box">
            <div class="number">{{ carInfo.tripCount || '-' }}</div>
            <div class="msg-time">行程数量(次)</div>
          </div>
          <div class="statistic-box">
            <div class="number">{{ carInfo.autoSpdAvg || '-' }}</div>
            <div class="msg-time">平均速度(km/h)</div>
          </div>
        </div>
        <div class="box-header flex items-center justify-between">
          <div flex items-center>
            <div class="box-line"></div>
            <div class="box-title">行程信息</div>
          </div>
          <div class="more" @click="handleMore">查看更多<i-ep-ArrowRight /></div>
        </div>
        <div class="vehicle-time">
          <div class="time-box">
            <div class="time-img time"></div>
            <div class="text">开始时间</div>
            <div class="number">{{ carInfo.latestOrder?.tripStartTime || '-' }}</div>
          </div>
          <div class="time-box">
            <div class="time-img hourglass"></div>
            <div class="text">累计时长(min)</div>
            <div class="number">{{ carInfo.latestOrder?.tripDuration || '-' }}</div>
          </div>
          <div class="time-box">
            <div class="time-img car"></div>
            <div class="text">车速(km/h)</div>
            <div class="number">{{ carInfo.latestOrder?.vehSpd || '-' }}</div>
          </div>
        </div>
        <div class="box-header flex items-center justify-between">
          <div flex items-center>
            <div class="box-line"></div>
            <div class="box-title">每站都停</div>
          </div>
          <label @click.pervent="handleEditCar">
            <input type="checkbox" v-model="carInfo.autoStopSign" disabled />
            <div>
              <span class="on">yes</span>
              <span class="off">no</span>
            </div>
            <i></i>
          </label>
        </div>
      </div>
      <div class="operate-box">
        <div class="right-cell">
          <div class="rectangle">
            <div class="top_box">
              <div flex items-center :class="accPedal ? 'c-orange' : 'c-blue'">
                <svg-icon icon-class="throttle" size="18px" mr6px />油门
              </div>
              <div flex items-center :class="brkPedal ? 'c-orange' : 'c-blue'">
                <svg-icon icon-class="brake" size="18px" mr6px />刹车
              </div>
              <div flex items-center>
                <svg-icon icon-class="leftArrow" size="24px" :class="leftLampSt ? 'c-orange' : 'c-blue'" mr20px />
                <svg-icon icon-class="rightArrow" size="24px" :class="rightLampSt ? 'c-orange' : 'c-blue'" />
              </div>
            </div>
            <div class="center_box">
              <div class="center_box_left">
                <div class="box_left_cell">
                  <div class="box_left_cell_top" :class="gps ? 'c-orange' : 'c-blue'">
                    <div class="point"></div>
                    GPS
                  </div>
                  <div class="box_left_cell_bottom">
                    <div class="point"></div>
                    Camera
                  </div>
                </div>
                <speed-chart :vehSpd="vehSpd"></speed-chart>
              </div>
              <div class="center_box_right">
                <div class="box_right_cell">
                  <div
                    class="arrow_item"
                    :class="currentArrow === item?.name ? 'selected' : ''"
                    v-for="item in arrowList"
                    :key="item.name"
                    @click="currentArrow = item?.name"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <div>
                  <div class="box_right_bus" :style="{ transform: 'rotate(' + headAngle + 'deg)' }"></div>
                  <div class="box_right_bus_text">航向角: {{ headAngle.toFixed(2) }}度</div>
                </div>
              </div>
            </div>
            <div class="trapezoid">
              {{ currentTime }}
            </div>
          </div>
        </div>
      </div>
      <div class="map-image" id="containerGL"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fetchCarInfoData } from '@/api/dashboard'
import busIcon from '@/assets/bus/car.png'
import SpeedChart from './components/SpeedChart.vue'
import { loadBaiDuMap } from './baiduMap'
import siteIcon from '@/assets/bus/finished_location.png'
import useFetchApiHooks from '@/hooks/fetchList'
const { getAllCarInfoManageData, getAllSiteManageData } = useFetchApiHooks()
let carInfoList: any = ref([])
const plateNumber: any = ref('')
let siteInfoList: any = ref([])
function initEditQueryList() {
  getAllCarInfoManageData({}).then((res: any) => {
    carInfoList.value = res
    plateNumber.value = res[0].plateNumber
    handleFetchCarInfoData()
  })
  getAllSiteManageData({}).then((res: any) => {
    siteInfoList.value = res
    siteInfoList.value.map((item: any) => {
      const points = new BMapGL.Point(parseFloat(item.lng), parseFloat(item.lat))
      const siteMarker = new BMapGL.Marker(points, {
        icon: new BMapGL.Icon(siteIcon, new BMapGL.Size(30, 35))
      })
      map.addOverlay(siteMarker)
      var label = new BMapGL.Label(item.siteName, {
        // 创建文本标注
        position: points, // 设置标注的地理位置
        offset: new BMapGL.Size(30, 5) // 设置文本偏移量
      })
      label.setStyle({
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '10px',
        padding: '0 10px',
        fontSize: '14px',
        lineHeight: '20px',
        border: '0',
        transform: 'translateX(-50%)'
      })
      map.addOverlay(label) //添加到地图上;
    })
  })
}
let carInfo: any = ref({})
function handleFetchCarInfoData() {
  fetchCarInfoData({ plateNumber: plateNumber.value }).then((res: any) => {
    carInfo.value = res.data
  })
}
const currentArrow = ref('P')
const arrowList = ref([
  {
    name: 'P'
  },
  {
    name: 'R'
  },
  {
    name: 'N'
  },
  {
    name: 'D'
  }
])
import { editCarInfoManage } from '@/api/operateManage'
function handleEditCar() {
  let params = {
    id: carInfo.value.id,
    autoStopSign: !carInfo.value.autoStopSign
  }
  editCarInfoManage(params).then(res => {
    handleFetchCarInfoData()
  })
}
import { useRouter } from 'vue-router'
const router = useRouter()
function handleMore() {
  router.push({ path: '/operateManage/orderManage' })
}
import dayjs from 'dayjs'
const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
onMounted(() => {
  initMap()
  setInterval(() => {
    currentTime.value = dayjs().add(1, 'second').format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})
import { useWebSocket } from '@vueuse/core'
let sysUser: any = localStorage.getItem('sysUser')
let websocketurl = 'ws://39.129.24.51:9015/websocket/server/server/' + JSON.parse(sysUser).id
let accPedal = ref(false) // 油门
let brkPedal = ref(false) // 刹车
let leftLampSt = ref(false)
let rightLampSt = ref(false)
let vehSpd = ref(0) // 速度
let gearSt = ref() // 档位0空档,1前进档,4后退档
let headAngle = ref(0) // 自车航向角
let gps = ref(false)
useWebSocket(websocketurl, {
  onConnected(ws) {
    console.log('websocket连接成功')
  },
  onMessage(ws, event) {
    // 获取接收到的消息内容
    const result = JSON.parse(event.data)
    console.log('result:', result)
    const driveInfo = result.driveInfo
    accPedal.value = driveInfo.accPedal > 0
    brkPedal.value = driveInfo.brkPedal > 0
    leftLampSt.value = driveInfo.leftLampSt
    rightLampSt.value = driveInfo.rightLampSt
    vehSpd.value = Number(driveInfo.vehSpd.toFixed(0)) || 0
    gearSt.value = driveInfo.gearSt
    switch (driveInfo.gearSt) {
      case 0:
        currentArrow.value = 'N'
        break
      case 1:
        currentArrow.value = 'D'
        break
      case 4:
        currentArrow.value = 'R'
        break
      default:
        currentArrow.value = 'P'
    }
    headAngle.value = driveInfo.headAngle
    const navData = result.gps
    gps.value = navData.navPosSt > 0
    if (navData.navPosSt > 0) {
      map.clearOverlays()
      // 添加车辆图标
      const markerPoint = new BMapGL.Point(navData.gpsLon, navData.gpsLat) // 车辆图标的位置
      const marker = new BMapGL.Marker(markerPoint, {
        icon: new BMapGL.Icon(busIcon, new BMapGL.Size(40, 60))
      }) // 创建标注
      marker.setRotation(navData.headAngle)
      map.addOverlay(marker) // 将标注添加到地图中
      // 初始化地图，设置中心点坐标和地图级别
      map.centerAndZoom(markerPoint, 19)
    }
  }
})
let map: any = null
function initMap() {
  // 传入密钥获取地图回调。
  loadBaiDuMap()
    .then((BMapGL: any) => {
      // 创建地图实例
      map = new BMapGL.Map('containerGL', { enableMapClick: false })
      // 是否显示POI Icon
      map.setDisplayOptions({
        poiIcon: false
      })
      map.disableDoubleClickZoom() //阻止双击放大
      const point = new BMapGL.Point(102.885823, 24.974371)
      // 初始化地图，设置中心点坐标和地图级别
      map.centerAndZoom(point, 19)
      //开启鼠标滚轮缩放
      map.enableScrollWheelZoom(true)
      // 读取JSON文件
      fetch('/static/json/custom_map_config.json')
        .then(response => response.json())
        .then(data => {
          // 处理JSON文件的内容
          // 设置地图样式
          map.setMapStyleV2({ styleJson: data })
        })
      initEditQueryList()
    })
    .catch((err: any) => {
      console.log(err)
    })
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 0 24px;
  .dashboard-main {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .left-cell {
      width: 400px;
      height: 96%;
      margin: 20px 10px;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      background-color: #fff;
      z-index: 999;
      position: absolute;
      left: 0;
      top: 0;
      .top-select {
        padding: 20px 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .box-header {
        height: 30px;
        display: flex;
        padding: 5px 0;
        margin: 14px 0 14px 0;
        .box-line {
          width: 4px;
          height: 20px;
          border-radius: 10px;
          background: #2c68ff;
        }
        .box-title {
          align-self: center;
          padding-left: 10px;
        }
        .more {
          display: flex;
          align-items: center;
          font-size: 12px;
          cursor: pointer;
          &:hover {
            color: #2c68ff;
          }
        }
      }
      .vehicle-message {
        display: flex;
        .img {
          width: 108px;
          height: 108px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          border-radius: 8px;
        }
        .vehicle-right {
          flex: 1;
          margin-left: 8px;
          .top-title {
            display: flex;
            justify-content: space-between;
            .right-text {
              font-size: 14px;
            }
          }
          .text-box {
            font-size: 14px;
          }
        }
      }
      .vehicle-statistic {
        display: grid;
        grid-template-columns: 3fr 3fr 3fr;
        grid-row-gap: 20px;
        grid-column-gap: 20px;
        .statistic-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          .number {
            font-size: 20px;
          }
          .msg-time {
            font-size: 12px;
          }
        }
      }
      .vehicle-time {
        display: grid;
        grid-template-columns: 3fr 3fr 3fr;
        grid-row-gap: 20px;
        grid-column-gap: 20px;
        .time-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          .time-img {
            width: 40px;
            height: 40px;
            background-size: cover;
            background-repeat: no-repeat;
            margin: 5px 0 8px 0;
          }
          .time {
            background-image: url('/src/assets/dashboard/time.png');
          }
          .hourglass {
            background-image: url('/src/assets/dashboard/hourglass.png');
          }
          .car {
            background-image: url('/src/assets/dashboard/car.png');
          }
          .text {
            font-size: 12px;
            margin-bottom: 5px;
          }
          .number {
            font-size: 18px;
            margin-bottom: 20px;
          }
        }
      }
    }
    .operate-box {
      max-width: 700px;
      position: absolute;
      right: 100px;
      bottom: 10px;
      z-index: 999;
      width: calc(100% - 600px);
    }
    @media screen and (min-width: 1920px) {
      .operate-box {
        right: calc(100% - 1400px);
      }
    }
    .right-cell {
      position: relative;
      z-index: 999;
      width: 100%; /* 长方形的宽度 */
      height: 250px; /* 长方形的高度 */
      .rectangle {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 2px solid #fff;
        background-color: rgba(255, 255, 255, 0.8); /* 半透明白色 */
        border-radius: 20px; /* 圆角 */
        z-index: 1;
        padding: 10px 20px;
        .top_box {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .center_box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .center_box_left {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex: 1;
            .box_left_cell {
              color: #00b4ff;
              .box_left_cell_top {
                margin-bottom: 10px;
                display: flex;
                align-items: center;
              }
              .box_left_cell_bottom {
                display: flex;
                align-items: center;
              }
              .point {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #00b4ff;
                margin-right: 6px;
              }
            }
          }
          .center_box_right {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
            .box_right_cell {
              color: #fff;
              background: #d0cccc;
              padding: 8px 4px 4px;
              border-radius: 8px;
              cursor: pointer;
              .arrow_item {
                padding: 0px 4px;
                border-radius: 4px;
                margin-bottom: 4px;
                font-size: 14px;
                &.selected {
                  background: #00b4ff;
                }
              }
            }
            .box_right_bus {
              width: 120px;
              height: 120px;
              background-image: url('/src/assets/dashboard/bus.png');
              background-size: contain;
              background-repeat: no-repeat;
            }
            .box_right_bus_text {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
        .trapezoid {
          width: 250px;
          height: 34px;
          line-height: 34px;
          background-color: #d0cccc;
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
          color: #fff;
          font-size: 14px;
          margin: 0 auto;
          text-align: center;
        }
      }

      /* 左侧三角形 */
      .rectangle::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -60px; /* 根据三角形大小调整 */
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: 118px solid transparent;
        border-bottom: 118px solid transparent;
        border-right: 60px solid rgba(255, 255, 255, 0.8); /* 半透明白色 */
        z-index: 2;
      }

      /* 右侧三角形 */
      .rectangle::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -60px; /* 根据三角形大小调整 */
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: 118px solid transparent;
        border-bottom: 118px solid transparent;
        border-left: 60px solid rgba(255, 255, 255, 0.8); /* 半透明白色 */
        z-index: 2;
      }
    }

    .map-image {
      margin-top: 10px;
      width: 100%;
      height: calc(100vh - 70px);
      border-radius: 8px;
    }
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
:deep(.el-radio-button is-active is-fcous) {
  background: red;
}
.el-button + .el-button {
  margin-left: 0;
}
/* From Uiverse.io by Cksunandh */
label {
  transform: scale(1); /* Reduced size */
  display: block;
  width: 100px; /* Smaller width */
  height: 50px; /* Smaller height */
  border-radius: 25px;
  background: linear-gradient(to bottom, #9e9e9e 30%, #f4f4f4);
  box-shadow: 0 1px 0 0 #fff, 0 -1px 0 0 #969494;
  position: relative;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

label input {
  display: none;
}

label div {
  display: block;
  width: 80px; /* Reduced width */
  height: 30px; /* Reduced height */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(to bottom, #8b8c8e 20%, #f4f4f4);
  border-radius: 15px;
  transition: 0.2s;
}

label div:after {
  content: '';
  position: absolute;
  display: block;
  height: 28px; /* Reduced height */
  width: 78px; /* Reduced width */
  left: 1px;
  top: 1px;
  border-radius: 14px;
  background: #828080;
  box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.8);
  transition: 0.2s;
}

label i {
  display: block;
  width: 40px; /* Reduced size */
  height: 40px; /* Reduced size */
  position: absolute;
  background: linear-gradient(to top, #9e9e9e 20%, #f4f4f4);
  border-radius: 50%;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.7);
  top: 5px;
  left: 5px;
  transition: 0.25s;
}

label i:after {
  content: '';
  position: absolute;
  display: block;
  width: 34px; /* Reduced size */
  height: 34px; /* Reduced size */
  left: 3px;
  top: 3px;
  border-radius: 50%;
  background: #d5d4d4;
  z-index: 1;
}

label input:checked ~ i {
  top: 5px;
  left: 54px; /* Adjusted to fit new size */
}

label input:checked + div:after {
  background: #0f0; /* Green glow */
  box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.6);
}

label input:checked + div > .off {
  color: transparent;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0);
}

label input:checked + div > .on {
  color: hsl(24, 2%, 49%);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

label input:not(:checked) + div:after {
  background: #f00; /* Red glow */
  box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.6);
}

label input:not(:checked) + div > .on {
  color: transparent;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0);
}

label input:not(:checked) + div > .off {
  color: #444;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
}

label:after {
  content: '';
  position: absolute;
  display: block;
  width: 102px; /* Adjusted to fit new size */
  height: 52px; /* Adjusted to fit new size */
  border-radius: 26px;
  top: -1px;
  left: -1px;
  z-index: -1;
  background: linear-gradient(to bottom, #969494, #fff);
}

label:hover {
  cursor: pointer;
}

label:focus,
label:active {
  outline: 0;
}

.on,
.off {
  text-transform: uppercase;
  position: absolute;
  left: 12px; /* Adjusted for smaller size */
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8em; /* Smaller font size */
  font-weight: 600;
  z-index: 2;
  letter-spacing: 1px;
  transition: 0.25s;
}

.on {
  color: transparent;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0);
}

.off {
  left: initial;
  right: 12px; /* Adjusted for smaller size */
  color: hsl(24, 2%, 49%);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
}

@keyframes switchOn {
  0% {
    background-color: #f00;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
  100% {
    background-color: #0f0;
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  }
}

@keyframes switchOff {
  0% {
    background-color: #0f0;
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  }
  100% {
    background-color: #f00;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
}

label input:checked + div:after {
  animation: switchOn 0.5s ease-in-out forwards;
}

label input:not(:checked) + div:after {
  animation: switchOff 0.5s ease-in-out forwards;
}
</style>
