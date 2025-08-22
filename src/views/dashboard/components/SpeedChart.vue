<!--
 * @Author: YinXuan
 * @Date: 2024-12-24 15:25:32
 * @LastEditTime: 2024-12-26 15:11:02
 * @Description: 
-->
<script setup>
import * as Echarts from 'echarts'
let props = defineProps({
  vehSpd: {
    type: Number,
    default: 0
  }
})
let vehSpd = ref(0)
watch(
  () => props.vehSpd, //这样才可以检测到对象里面的值
  (newValue, oldValue) => {
    vehSpd.value = props?.vehSpd
    initEchart()
  },
  {
    deep: true
  }
)
function initEchart() {
  const echartsModel = Echarts.init(document.getElementById('SpeedChartId'))
  echartsModel.clear()
  let option = {
    series: [
      {
        type: 'gauge',
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.2, '#67e0e3'],
              [0.8, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        },
        splitNumber: 3,
        max: 180,
        pointer: {
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          distance: -20,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: '#fff',
            width: 4
          }
        },
        axisLabel: {
          color: 'inherit',
          distance: -15,
          fontSize: 12
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} km/h',
          color: 'inherit',
          fontSize: 14
        },
        data: [
          {
            value: vehSpd.value
          }
        ]
      }
    ]
  }
  echartsModel.setOption(option)
}
onMounted(() => {
  initEchart()
})
</script>

<template>
  <div flex justify-around items-center>
    <div id="SpeedChartId" w-300px h-180px></div>
  </div>
</template>
<style lang="scss" scoped></style>
