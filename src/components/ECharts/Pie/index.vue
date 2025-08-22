<template>
  <div class="pie_container flex justify-center">
    <div ref="charts" class="pie-chart"></div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
const props = defineProps({
  trafficWayList: {
    type: Array,
    default: []
  },
  colorList: {
    type: Array,
    default() {
      // return ["#00ffff", "#409B5C", "#006ced"];
      return ['#00ffff', '#006ced', '#409B5C']
    }
  }
})
const imgone = ref(120)
const imgtwo = ref(190)
const imgcenter = ref(80)
const radiusOne = ref(70)
const radiusTwo = ref(85)
watch(
  // 监听的数据
  () => window.innerWidth,

  // 当数据变化时执行的回调函数
  width => {
    if (width > 1000 && width < 1872) {
      // 页面宽度在 1004 到 1440 之间时，设置变量小20
      imgone.value = 70
      imgtwo.value = 130
      imgcenter.value = 50
      radiusOne.value = 45
      radiusTwo.value = 55
    } else if (width > 1873 && width < 1921) {
      // 页面宽度在 1004 到 1440 之间时，设置变量小20
      imgone.value = 80
      imgtwo.value = 150
      imgcenter.value = 50
      radiusOne.value = 50
      radiusTwo.value = 65
    } else {
      // 恢复默认值
      imgone.value = 120
      imgtwo.value = 190
      radiusOne.value = 70
      radiusTwo.value = 85
    }
  },
  { immediate: true } // 立即执行一次回调以确保初始值的设置
)
function initCharts(charts) {
  var img =
    'data:image/png;base64,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'
  var img2 =
    'data:image/png;base64,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'

  var trafficWay = props.trafficWayList
  console.log(trafficWay, '深层数据')
  let sum = trafficWay.reduce((cur, pre) => {
    return cur + pre.value
  }, 0)
  let data = []
  // var color = ['#00ffff', '#409B5C', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
  var color = props.colorList
  for (var i = 0; i < trafficWay.length; i++) {
    let name = trafficWay[i].name + '  ' + trafficWay[i].value + '个'
    console.log(name, 'name')
    data.push(
      {
        value: trafficWay[i].value,
        name: name,
        itemStyle: {
          borderWidth: 3,
          // shadowBlur: 20,
          borderColor: color[i]
          // shadowColor: color[i],
        }
      },
      {
        // value: sum / 5,
        name: '',
        itemStyle: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0
        }
      }
    )
  }

  let option = {
    color: color,
    tooltip: {
      trigger: 'item',
      show: false
    },
    graphic: {
      elements: [
        {
          type: 'image',
          z: 1,
          style: {
            image: img,
            width: imgone.value,
            height: imgone.value
          },
          left: 'center',
          top: 'center',
          position: [30, 30]
        },
        {
          type: 'image',
          z: 1,
          style: {
            image: img2,
            width: imgcenter.value,
            height: imgcenter.value
          },
          left: 'center',
          top: 'center',
          position: [50, 50]
        },
        {
          type: 'image',
          z: 1,
          style: {
            image: img,
            width: imgtwo.value,
            height: imgtwo.value
          },
          left: 'center',
          top: 'center',
          position: [75, 75]
        }
      ]
    },

    legend: {
      show: false
    },
    toolbox: {
      show: false
    },
    series: {
      name: '',
      type: 'pie',
      clockwise: false,
      radius: [radiusOne.value, radiusTwo.value],
      center: ['50%', '50%'],
      emphasis: {
        scale: false
      },
      label: {
        show: false
      },
      data: data
    }
  }
  charts.setOption(option)
}

onMounted(() => {
  // getCurrentInstance().refs.charts 获取charts节点对象
  const charts = echarts.init(getCurrentInstance().refs.charts)
  initCharts(charts)
})
</script>

<style lang="scss" scoped>
.pie_container {
  height: 100%;
}
.pie-chart {
  width: 250px;
  height: 100%;
  margin-top: 25px;
}
@media screen and (min-width: 1024px) and (max-width: 1600px) {
  .pie-chart {
    width: 200px !important;
    height: 100%;
    margin-top: 15px;
  }
}
// @media screen and (min-width: 2234px) and (max-width: 2976px) {
//   .pie-chart {
//     width: 500px !important;
//     height: 100%;
//     margin-top: 15px;
//   }
// }
</style>
