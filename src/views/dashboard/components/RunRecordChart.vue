<!--
 * @Author: YinXuan
 * @Date: 2023-07-11 17:13:21
 * @LastEditTime: 2024-05-29 10:01:16
 * @Description: 车辆流量统计
-->

<script setup>
import * as Echarts from 'echarts'
let props = defineProps({
  tableData: {
    type: Object
  }
})
// 昨日收入
let yesterAmount = ref(0)
// 临时车停放收入
let temporaryAmount = ref(0)
// 会员包月费用
let vipMonthAmount = ref(0)
// 全日车流量
let trafficVolumeToday = ref(0)
let mapData = ref()
watch(
  () => props.tableData, //这样才可以检测到对象里面的值
  (newValue, oldValue) => {
    mapData.value = props?.tableData
    initEchart()
    yesterAmount.value = props?.tableData?.yesterAmount
    temporaryAmount.value = props?.tableData?.temporaryAmount
    vipMonthAmount.value = props?.tableData?.vipMonthAmount
    trafficVolumeToday.value = props?.tableData?.trafficVolumeToday
  },
  {
    deep: true
  }
)
function initEchart() {
  const echartsModel = Echarts.init(document.getElementById('chartsRunRecord'))
  echartsModel.clear()
  const map = {
    enterLabel: mapData.value.enterLabel,
    enterValue: mapData.value.enterValue,
    outLabel: mapData.value.outLabel,
    outValue: mapData.value.outValue
  }
  // 统计百分比
  var data1 = map.enterValue
  var data2 = map.outValue
  var json = {
    chart0: {
      xcategory: map.enterLabel,
      low: data1,
      lowLine: []
    }
  }
  var json2 = {
    chart0: {
      xcategory: map.outLabel,
      low: data2,
      lowLine: []
    }
  }
  var datacoords = [
    {
      coords: []
    }
  ]
  var datacoords2 = [
    {
      coords: []
    }
  ]
  for (var i = 0; i < json.chart0.xcategory.length; i++) {
    datacoords[0].coords.push([json.chart0.xcategory[i], data1[i]])
  }
  for (var i = 0; i < json.chart0.xcategory.length; i++) {
    datacoords2[0].coords.push([json2.chart0.xcategory[i], data2[i]])
  }
  let option = {
    title: {
      text: '车辆流量统计',
      textStyle: {
        color: '#999',
        fontSize: '14',
        fontFamily: 'Alibaba'
      },
      top: '20px',
      left: '20px'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#fff'
        }
      },
      backgroundColor: 'rgba(255,255,255,.8)',
      extraCssText: 'box-shadow: 4px 4px 10px rgba(21, 250, 255,.6);',
      formatter: function (params) {
        var result = params[0].name + '<br>'
        params.forEach(function (item) {
          result +=
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
            item.color +
            '"></span>'
          result += item.seriesName + ': ' + item.data + '</span><br>'
        })
        return result
      }
    },
    legend: {
      data: ['驶入', '驶出'],
      textStyle: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Alibaba'
      },
      top: '5%',
      right: '5%'
    },
    grid: {
      bottom: 50,
      left: 70,
      right: 50
    },
    xAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#999',
          fontFamily: 'Alibaba'
        }
      },
      data: map.enterLabel
    },
    yAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#4b4d64'
        }
      },
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          //改变刻度字体样式
          color: '#999',
          fontFamily: 'Alibaba'
        }
      }
    },
    series: [
      {
        name: '驶出',
        type: 'line',
        // smooth: true,
        symbol: 'none',
        symbolSize: 10,
        areaStyle: {
          normal: {
            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, false),
            shadowColor: '#E6A23C',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: '#E6A23C'
          }
        },
        data: data1
      },
      {
        name: '驶出',
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        zlevel: 1,
        polyline: true,
        smooth: true,
        symbol: 'circle',
        effect: {
          show: true,
          trailLength: 0.4,
          symbol: 'circle',
          period: 8, //光点滑动速度
          symbolSize: 8
        },
        lineStyle: {
          normal: {
            color: '#E6A23C',
            width: 0,
            opacity: 0,
            curveness: 0
          }
        },
        data: datacoords
      },
      {
        name: '驶入',
        type: 'line',
        // smooth: true,
        symbol: 'none',
        symbolSize: 10,
        areaStyle: {
          normal: {
            color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, false),
            shadowColor: '#409EFF',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: '#409EFF'
          }
        },
        data: data2
      },
      {
        name: '驶入',
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        zlevel: 1,
        smooth: true,
        polyline: true,
        symbol: 'circle',
        effect: {
          show: true,
          trailLength: 0.4,
          symbol: 'circle',
          period: 8, //光点滑动速度
          symbolSize: 8
        },
        lineStyle: {
          normal: {
            color: '#409EFF',
            width: 0,
            opacity: 0,
            curveness: 0
          }
        },
        data: datacoords2
      }
    ]
  }
  echartsModel.setOption(option)
}
onMounted(() => {})
</script>

<template>
  <el-card>
    <template #header> 日车流量趋势 </template>
    <div flex justify-around items-center>
      <div id="chartsRunRecord" w-full h-400px></div>
      <div w-300px h-360px text-center>
        <dv-border-box-1>
          <div py40px>
            <div mb10px>昨日收入</div>
            <div mb20px>{{ yesterAmount || 0 }}元</div>
            <div mb10px>临时停车收入</div>
            <div mb20px>{{ temporaryAmount || 0 }}元</div>
            <div mb10px>会员车辆收入</div>
            <div mb20px>{{ vipMonthAmount || 0 }}元</div>
            <div mb10px>全日车流量</div>
            <div>{{ trafficVolumeToday || 0 }}辆</div>
          </div>
        </dv-border-box-1>
      </div>
    </div>
  </el-card>
</template>
<style lang="scss" scoped></style>
