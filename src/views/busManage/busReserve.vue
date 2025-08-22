<!--
 * @Author: YinXuan/WUYuHan
 * @Date: 2024-12-10 13:18:15
 * @LastEditTime: 2025-05-15 15:58:42
 * @Description: 预约点模式
-->
<template>
  <div class="feedback">
    <div class="map-image" id="containerGL"></div>
    <template v-if="phoneUser.roleType === 2">
      <div class="map-switch" @click="isModeDrawer = true">
        <span class="switch-icon"></span>
        预约点模式
      </div>
    </template>
    <div class="map-box">
      <div class="choose_cell" @click="handleChooseStart">
        <div class="start_img"></div>
        <div class="right_input">
          {{ startSiteData ? startSiteData : '请选择出发位置' }}
        </div>
        <div class="arrow"></div>
      </div>
      <div class="choose_cell" @click="handleChooseEnd">
        <div class="end_img"></div>
        <div class="right_input">
          {{ endSiteData ? endSiteData : '请选择终点位置' }}
        </div>
        <div class="arrow"></div>
      </div>
      <div class="map-btn" @click="handleClick" v-if="!btnStatus">立即预约</div>
      <div class="map-close" v-else>
        <div class="mag-btn" v-if="orderStatus == 1">
          {{ '距您：' + distance + 'm' }}
        </div>
        <div class="close-btn" v-if="orderStatus == 1" @click="handleCloseClick">取消预约</div>
        <div class="map-btn" v-else-if="orderStatus == 2">
          {{ '大约：' + timeMinutes + '分钟' }}
        </div>
      </div>
    </div>
    <el-drawer v-model="isDrawer" :show-close="false" direction="btt">
      <template #header>
        <div class="drawer_title">
          {{ statusData ? '请选择终点位置' : '请选择出发位置' }}
        </div>
      </template>
      <template #default>
        <div class="cell-block">
          <div
            class="cell-content"
            :class="item?.id === (statusData ? startLocation : endLocation) ? 'selected' : ''"
            v-for="item in siteInfoData"
            :key="item.siteName"
            @click="handleSite(item)"
          >
            <div class="cell-left">
              <div class="left-icon"></div>
              <div class="left-text">
                <div class="left-name">
                  {{ item.siteName }}
                </div>
              </div>
            </div>
            <div :class="item?.id === (statusData ? startLocation : endLocation) ? 'cell-right' : ''"></div>
          </div>
        </div>
      </template>
    </el-drawer>
    <el-drawer v-model="isModeDrawer" :show-close="false" direction="btt">
      <template #header>
        <div class="drawer_title">请选择模式</div>
      </template>
      <template #default>
        <div class="cell-block">
          <div
            class="cell-content"
            v-for="item in modeData"
            :key="item.name"
            :class="item?.id === chooseMode ? 'selected' : ''"
            @click="handleSwitchMap(item.id)"
          >
            <div class="cell-left">
              <div class="left-icon"></div>
              <div class="left-text">
                <div class="left-name">
                  {{ item.name }}
                </div>
              </div>
            </div>
            <div :class="item?.id === chooseMode ? 'cell-right' : ''"></div>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
import { loadBaiDuMap } from '@/views/dashboard/baiduMap'
import useFetchData from '@/hooks/fetchList'
const { getAllCarInfoManageh5Data, getAllSiteManagh5eData } = useFetchData()
import startIcon from '@/assets/bus/start1.png'
import endIcon from '@/assets/bus/finished1.png'
import vehicleIcon from '@/assets/bus/car.png'
import siteIcon from '@/assets/bus/finished_location.png'
import { useRouter } from 'vue-router'
const router = useRouter()
import { gettripOrder, getCancelOrder, getOrderReview, postUpdateItem } from '@/api/webPage/index'
import { vehicleInfo } from '@/api/webPage/types'
let paramsForm: any = reactive<vehicleInfo>({
  plateNumber: '',
  startPointId: '',
  endPointId: '',
  startPointName: '',
  endPointName: '',
  chooseStartPoint: '',
  chooseEndPoint: ''
})

const phoneUser = useUserStoreHook().phoneUser

let wsOptions = `ws://39.129.24.51:9015/websocket/server/web/${phoneUser.id}`

let headAngle = ref(0) // 自车航向角
let navData = ref()
let distance = ref(0)
let orderStatus = ref()
let timeMinutes = ref()
let isFirst = ref(true)
const { data, status, close, send, open } = useWebSocket(wsOptions, {
  onConnected(ws) {
    console.log('websockt连接打开')
    // send();
  },
  onMessage(ws, event) {
    // 获取接收到的消息内容
    const result = JSON.parse(event.data)

    const driveInfo = result.driveInfo
    if (driveInfo) {
      headAngle.value = driveInfo.headAngle
      navData.value = result.gps
      handleVehicle()
    }

    //当状态为3（已完成）跳转评价页面
    if (result.orderStatus === 3) {
      router.push('/busFeedback')
    }

    if (result.type === 1) {
      orderStatus.value = result.orderStatus
      if (orderStatus.value === 1 || orderStatus.value === 2) {
        // console.log('websockt获取接收到的预约消息内容', result)
        if (!paramsForm.startPointId || !paramsForm.endPointId) {
          if (isFirst.value) {
            isFirst.value = false
            handleFetchOrderReview(result.orderId)
          }
        }
      }
      if (result.distance) {
        distance.value = result.distance
        const speed = 11 // 速度以千米每小时为单位
        const distanceInKm = distance.value / 1000
        const timeToArriveInHours = distanceInKm / speed
        const timeToArriveInMinutes = timeToArriveInHours * 60
        timeMinutes.value = Math.round(timeToArriveInMinutes).toFixed(2)
      }
    }
  }
})

onMounted(() => {
  initMap()
  handleCareData()
})

// 添加组件卸载时的清理函数
onUnmounted(() => {
  if (close) {
    // 关闭websocket连接
    console.log('关闭websocket连接')
    close()
  }
})

let map: any
let marker: any
let markerPoint: any = ref(0)
function initMap() {
  // 传入密钥获取地图回调。
  loadBaiDuMap().then((BMapGL: any) => {
    // 创建地图实例
    map = new BMapGL.Map('containerGL', { enableMapClick: false })
    map.disableDoubleClickZoom() //阻止双击放大
    const point = new BMapGL.Point(102.886223, 24.974171)
    map.centerAndZoom(point, 19)
    //开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true)
    // 设置地图样式
    map.setMapStyleV2({
      styleId: 'da2c765a8149fae954d5bda46d8cb766'
    })
    handleSiteData()
  })
}
const handleVehicle = () => {
  if (marker) {
    map.removeOverlay(marker)
  }
  if (navData.value) {
    // 添加车辆图标
    markerPoint.value = new BMapGL.Point(navData.value.gpsLon, navData.value.gpsLat) // 车辆图标的位置
    marker = new BMapGL.Marker(markerPoint.value, {
      icon: new BMapGL.Icon(vehicleIcon, new BMapGL.Size(40, 60))
    }) // 创建标注
    marker.setRotation(headAngle.value)
    marker.setZIndex(1000)
    map.addOverlay(marker)
    // 实时刷新车辆当前位置
    // map.centerAndZoom(markerPoint.value, 19)
    var html = `<div style="display:flex;justify-content: center;align-items: center;"><img src="/src/assets/bus/bus.jpg" style="width:80px;height:40px"></div>
        <div style="border-radius: 8px;font-size:16px;padding:0px 15px 30px 15px;color:black">
                    <div style="display:flex;justify-content: space-between;align-items: center;margin-bottom:5px"><span>车辆编号：</span><span style="color:#4b89fe">${carInfoData.value.plateNumber}</span></div>
                    <div style="display:flex;justify-content: space-between;align-items: center;margin-bottom:5px"><span>速度：</span><span>1111&nbsp;km/h</span></div>
            </div>
            `
    // 设置点击事件
    marker.addEventListener('click', (val: any) => {
      let infoWindow = new BMapGL.InfoWindow(html, {
        offset: new BMapGL.Size(5, -10),
        width: 250,
        height: 100,
        maxWidth: 250,
        title: '车辆信息',
        enableAutoPan: true,
        enableCloseOnClick: true
      })
      // // 打开每一项
      marker.openInfoWindow(infoWindow)
    })
  }
}
const btnStatus = ref(false)
let polyline: any
let markers = ref([])
let tripGpsPolyline: any
let vehGpsPolyline: any
let vehStatus = ref(false)
let sIcon: any
let eIcon: any
const tripId = ref()
const handleClick = () => {
  if (!paramsForm.startPointId) {
    return ElMessage.warning('请选择出发位置')
  }
  if (!paramsForm.endPointId) {
    return ElMessage.warning('请选择终点位置')
  }
  gettripOrder(paramsForm)
    .then(res => {
      tripId.value = res.data.orderId
      const tripStart = new BMapGL.Point(parseFloat(res.data.tripGps[0].lng), parseFloat(res.data.tripGps[0].lat))
      map.centerAndZoom(tripStart, 19)
      const tripend = new BMapGL.Point(
        parseFloat(res.data.tripGps[res.data.tripGps.length - 1].lng),
        parseFloat(res.data.tripGps[res.data.tripGps.length - 1].lat)
      )
      const tripCenter = res.data.tripGps.map((point: any) => ({
        lng: parseFloat(point.lng),
        lat: parseFloat(point.lat)
      }))
      vehGpsPolyline = res.data.vehGps.map((point: any) => ({
        lng: parseFloat(point.lng),
        lat: parseFloat(point.lat)
      }))
      btnStatus.value = true
      //从起点到终点
      tripGpsPolyline = new BMapGL.Polyline(
        tripCenter, // 起点和终点坐标
        {
          strokeColor: '#0085c5',
          strokeWeight: 5,
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        }
      )
      map.addOverlay(tripGpsPolyline)
      sIcon = new BMapGL.Marker(tripStart, {
        icon: new BMapGL.Icon(startIcon, new BMapGL.Size(50, 50))
      })
      map.addOverlay(sIcon)
      eIcon = new BMapGL.Marker(tripend, {
        icon: new BMapGL.Icon(endIcon, new BMapGL.Size(50, 50))
      })
      map.addOverlay(eIcon)
      updatePolyline()
    })
    .catch(err => {
      const { code } = err
      if (code === 401) {
        const userStore = useUserStoreHook()
        userStore.resetTokenH5()
        router.push(`/busLogin`)
      }
    })
}
// 获取已经预约了订单数据
function handleFetchOrderReview(orderId: any) {
  let params = {
    id: orderId
  }
  getOrderReview(params)
    .then(res => {
      tripId.value = res.data.orderId
      startSiteData.value = res.data.startPointName
      endSiteData.value = res.data.endPointName
      const tripStart = new BMapGL.Point(parseFloat(res.data.tripGps[0].lng), parseFloat(res.data.tripGps[0].lat))
      map.centerAndZoom(tripStart, 19)
      const tripend = new BMapGL.Point(
        parseFloat(res.data.tripGps[res.data.tripGps.length - 1].lng),
        parseFloat(res.data.tripGps[res.data.tripGps.length - 1].lat)
      )
      const tripCenter = res.data.tripGps.map((point: any) => ({
        lng: parseFloat(point.lng),
        lat: parseFloat(point.lat)
      }))
      vehGpsPolyline = res.data.vehGps.map((point: any) => ({
        lng: parseFloat(point.lng),
        lat: parseFloat(point.lat)
      }))
      btnStatus.value = true
      //从起点到终点
      tripGpsPolyline = new BMapGL.Polyline(
        tripCenter, // 起点和终点坐标
        {
          strokeColor: '#0085c5',
          strokeWeight: 5,
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        }
      )
      map.addOverlay(tripGpsPolyline)
      sIcon = new BMapGL.Marker(tripStart, {
        icon: new BMapGL.Icon(startIcon, new BMapGL.Size(50, 50))
      })
      map.addOverlay(sIcon)
      eIcon = new BMapGL.Marker(tripend, {
        icon: new BMapGL.Icon(endIcon, new BMapGL.Size(50, 50))
      })
      map.addOverlay(eIcon)
      updatePolyline()
    })
    .catch(err => {
      const { code } = err
      if (code === 401) {
        const userStore = useUserStoreHook()
        userStore.resetTokenH5()
        router.push(`/busLogin`)
      }
    })
}

// 更新折线
const updatePolyline = () => {
  const polylinePoints = [markerPoint.value, ...vehGpsPolyline]
  polyline = new BMapGL.Polyline(polylinePoints, {
    strokeColor: '#ccc',
    strokeWeight: 7,
    strokeOpacity: 0.8,
    strokeStyle: 'dashed'
  })
  map.addOverlay(polyline)
}

watch(
  () => orderStatus.value, //这样才可以检测到对象里面的值
  (newValue, oldValue) => {
    if (newValue === 2) {
      map.removeOverlay(polyline)
    }
  },
  {
    deep: true
  }
)
const handleCloseClick = () => {
  btnStatus.value = false
  vehStatus.value = false
  getCancelOrder({ id: tripId.value })
    .then(res => {
      map.removeOverlay(polyline)
      map.removeOverlay(tripGpsPolyline)
      ElMessage.success('取消成功')
      if (sIcon || eIcon) {
        map.removeOverlay(sIcon)
        map.removeOverlay(eIcon)
      }
      startSiteData.value = ''
      endSiteData.value = ''
      startLocation.value = undefined // 重置出发点
      endLocation.value = undefined // 重置终点
    })
    .catch(err => {
      const { code } = err
      if (code === 401) {
        const userStore = useUserStoreHook()
        userStore.resetTokenH5()
        router.push(`/busLogin`)
      }
    })
}
const isDrawer = ref(false)
function handleChooseStart() {
  if (orderStatus.value === 1 || orderStatus.value === 2) {
    return false
  }
  isDrawer.value = true
  statusData.value = false
}
const handleChooseEnd = () => {
  if (orderStatus.value === 1 || orderStatus.value === 2) {
    return false
  }
  isDrawer.value = true
  statusData.value = true
}
const siteInfoData: any = ref([])
const statusData = ref(false)
//全部站点信息
const handleSiteData = async () => {
  getAllSiteManagh5eData({})
    .then((res: any) => {
      siteInfoData.value = res
      siteInfoData.value.map((item: any) => {
        const points = new BMapGL.Point(parseFloat(item.lng), parseFloat(item.lat))
        const siteMarker = new BMapGL.Marker(points, {
          icon: new BMapGL.Icon(siteIcon, new BMapGL.Size(30, 35))
        })
        siteMarker.setZIndex(10)
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
        label.setZIndex(10)
        map.addOverlay(label) //添加到地图上;
      })
    })
    .catch(err => {
      const { code } = err
      if (code === 401) {
        const userStore = useUserStoreHook()
        userStore.resetTokenH5()
        router.push(`/busLogin`)
      }
    })
}

const carInfoData: any = ref([])
const handleCareData = async () => {
  getAllCarInfoManageh5Data({})
    .then((res: any) => {
      carInfoData.value = res[0]
      paramsForm.plateNumber = carInfoData.value.plateNumber
    })
    .catch(err => {
      const { code } = err
      if (code === 401) {
        const userStore = useUserStoreHook()
        userStore.resetTokenH5()
        router.push(`/busLogin`)
      }
    })
}
const startSiteData = ref('')
const endSiteData = ref('')
const startLocation = ref()
const endLocation = ref()
//切换出发/终点站点
const handleSite = (val?: any) => {
  if (val?.id === startLocation.value || val?.id === endLocation.value) {
    ElMessage.warning('出发和终点不能相同')
    return
  }
  if (statusData.value) {
    //终点
    startLocation.value = val?.id
    paramsForm.endPointId = val?.id
    paramsForm.endPointName = val?.siteName
    endSiteData.value = val?.siteName
  } else {
    //出发点
    endLocation.value = val?.id
    paramsForm.startPointId = val?.id
    paramsForm.startPointName = val?.siteName
    startSiteData.value = val?.siteName
  }
  isDrawer.value = false
}

const isModeDrawer = ref(false)
const modeData = ref([
  {
    id: 2,
    name: '点对点模式'
  },
  {
    id: 3,
    name: '精准点模式'
  }
])
const chooseMode = ref(0)
function handleSwitchMap(id: number) {
  if (!id) return ElMessage.error('请选择模式')
  chooseMode.value = id
  postUpdateItem({ paramCode: 'system_mode', paramValue: id })
    .then(res => {
      ElMessage.success('切换成功')
      // 更新 localStorage 中的 phoneUser 的 modeType
      const phoneUser = JSON.parse(localStorage.getItem('phoneUser') || '{}')
      phoneUser.modeType = id
      localStorage.setItem('phoneUser', JSON.stringify(phoneUser))
      isModeDrawer.value = false
      switch (id) {
        case 1:
          router.push('/busReserve')
          break
        case 2:
          router.push('/vipReserve')
          break
        case 3:
          router.push('/stationReserve')
          break
      }
    })
    .catch(err => {
      const { code } = err
      if (code === 401) {
        const userStore = useUserStoreHook()
        userStore.resetTokenH5()
        router.push(`/busLogin`)
      }
    })
    .finally(() => {
      isModeDrawer.value = false
    })
}
</script>
<style lang="scss" scope>
.feedback {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .map-image {
    width: 100%;
    height: 100%;
  }
  .map-switch {
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 8px 16px;
    background: linear-gradient(142.09deg, rgba(52, 200, 232, 0.8) 0%, rgba(78, 74, 242, 0.8) 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    z-index: 100;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    display: flex;
    align-items: center;
    gap: 6px;

    .switch-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2L4 7v10l8 5 8-5V7l-8-5zm6 11.59L12 18.5l-6-3.91V8.09L12 4.5l6 3.59v7.5z'/%3E%3Cpath d='M12 6.5l-6 3.59v7.5l6 3.91 6-3.91v-7.5L12 6.5zm0 12.5l-6-3.91V8.09L12 4.5l6 3.59v7.5L12 19z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      background: linear-gradient(142.09deg, rgba(52, 200, 232, 1) 0%, rgba(78, 74, 242, 1) 100%);

      .switch-icon {
        transform: rotate(180deg);
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
  .map-box {
    padding: 36px;
    width: 92vw;
    height: 250px;
    opacity: 1;
    border-radius: 20px;
    background: radial-gradient(
      80% 110.38% at 17.83783783783784% 4.245283018867925%,
      rgba(46, 167, 255, 0.65) 0%,
      rgba(46, 167, 255, 0.25) 78.06%
    );

    // backdrop-filter: blur(60px);
    position: absolute;
    z-index: 99;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 500px;
    margin: 0 auto;
    .choose_cell {
      width: 100%;
      height: 48px;
      border-radius: 48px;
      background: #fafafa;
      border: 1px solid rgba(237, 237, 237, 1);
      display: flex;
      align-items: center;
      padding: 0 10px;
      margin-bottom: 20px;
      .start_img {
        width: 35px;
        height: 30px;
        background-image: url('@/assets/bus/c_location.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-right: 20px;
      }
      .end_img {
        width: 30px;
        height: 30px;
        background-image: url('@/assets/bus/c_end.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-right: 26px;
      }
      .right_input {
        width: 80%;
        font-size: 14px;
        font-weight: 400;
        color: #656565;
      }
      .arrow {
        width: 35px;
        height: 30px;
        background-image: url('@/assets/bus/right_arrow.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-top: 4px;
      }
    }
    .map-btn {
      width: 260px;
      height: 44px;
      line-height: 44px;
      margin: 0 auto;
      opacity: 1;
      border-radius: 44px;
      background: linear-gradient(142.09deg, rgba(52, 200, 232, 1) 0%, rgba(78, 74, 242, 1) 100%);
      box-shadow: 0px 20px 30px rgba(16, 20, 28, 0.6);
      border: 1px solid undefined;
      backdrop-filter: blur(20px);
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      text-align: center;
    }
    .map-close {
      height: 44px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      color: #fff;
      text-align: center;
      font-size: 17px;
      font-weight: 600;
      .mag-btn {
        width: 160px;
        opacity: 1;
        border-radius: 44px;
        background: linear-gradient(142.09deg, rgba(52, 200, 232, 1) 0%, rgba(78, 74, 242, 1) 100%);
        box-shadow: 0px 20px 30px rgba(16, 20, 28, 0.6);
        border: 1px solid undefined;
        backdrop-filter: blur(20px);
        line-height: 44px;
      }
      .close-btn {
        line-height: 44px;
        width: 160px;
        opacity: 1;
        border-radius: 44px;
        background: linear-gradient(142.09deg, rgba(255, 0, 0, 1) 0%, rgba(130, 0, 0, 1) 100%);
        box-shadow: 0px 20px 30px rgba(16, 20, 28, 0.6);
        border: 1px solid undefined;
        backdrop-filter: blur(20px);
      }
    }
  }
  .drawer_title {
    text-align: center;
    font-size: 18px;
    color: #000;
    font-weight: bold;
  }
  .cell-block {
    max-height: 500px;
    overflow: auto;
    .cell-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      border-radius: 12px;
      margin-bottom: 10px;
      .cell-left {
        display: flex;
        align-items: center;
        .left-icon {
          width: 25px;
          height: 25px;
          margin-right: 10px;
          background-image: url('https://img.lgfw24hours.com:8443/upload/parkingManage/2024-08-22/135850.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .left-text {
          .left-name {
            font-weight: 500;
            font-size: 14px;
            color: #2a304a;
            line-height: 20px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
          .left-desc {
            font-weight: 500;
            font-size: 12px;
            color: #a0a7c2;
            line-height: 17px;
            text-align: left;
            font-style: normal;
          }
        }
      }
      .cell-right {
        width: 24px;
        height: 24px;
        background-image: url(https://img.lgfw24hours.com:8443/upload/parkingManage/2024-08-22/140143.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
    .selected {
      background: #f0f7ff;
      border-radius: 12px;
    }
  }
  .sure-btn {
    width: 100%;
    height: 52px;
    line-height: 52px;
    background: linear-gradient(307deg, #3562dc 0%, #6baaff 100%), linear-gradient(180deg, #68a7fd 0%, #5370ff 100%);
    box-shadow: 0px 4px 10px 0px #a7c1f4;
    color: #fff;
    text-align: center;
    font-style: normal;
    text-transform: none;
    border-radius: 200px;
    font-weight: 700;
    font-size: 18px;
  }
}

.el-drawer {
  height: auto !important;
  width: auto !important;
  margin: 0px 10px 10px;
  border-radius: 20px !important;
  background-image: none !important;
}
.el-drawer__header {
  margin-bottom: 0px;
}
</style>
