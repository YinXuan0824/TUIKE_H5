<!--  线 + 柱混合图 -->
<template>
  <el-card>
    <template #header>
      <div class="title">
        2022收入完成情况分析
        <el-tooltip effect="dark" content="点击试试下载" placement="bottom">
          <i-ep-download class="download" @click="downloadEchart"></i-ep-download>
        </el-tooltip>
      </div>
    </template>

    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

const props = defineProps({
  id: {
    type: String,
    default: 'barChart'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '400px',
    required: false
  },
  height: {
    type: String,
    default: '400px',
    required: false
  }
})

const options = {
  backgroundColor: '#fff',
  title: {
    text: '2022收入完成情况分析',
    top: '17%',
    textAlign: 'center',
    left: '49.5%'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    top: '0%',
    right: '0%'
  },
  grid: {
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['实际收入', '确保收入', '目标收入', '挑战收入'],
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: 'rgba(73,80,87,0.9)',
        fontSize: 12,
        fontWeight: 600,
        interval: 0,
        padding: [8, 0, 0, 0]
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '（万元）',
      nameTextStyle: {
        color: 'rgba(73,80,87,0.9)',
        fontSize: 12,
        padding: [0, 0, 6, -60]
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: 'rgba(73,80,87,0.9)'
        },
        padding: 10
      }
    }
  ],
  series: [
    {
      name: '对外收入',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      barWidth: 20,
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: function (data: any) {
            return '{a0|' + data.value + '}'
          },
          rich: {
            a0: {
              color: '#5470c6',
              fontSize: 12,
              fontFamily: 'DIN',
              fontWeight: 'bold'
            }
          }
        }
      },
      data: [188.82, 180, 200, 260]
    },
    {
      name: '对内收入',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barWidth: 20,
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: function (data: any) {
            return '{a1|' + data.value + '}'
          },
          rich: {
            a1: {
              color: '#94ce79',
              fontSize: 12,
              fontFamily: 'DIN',
              fontWeight: 'bold'
            }
          }
        }
      },
      data: [33.45, 20, 50, 100]
    }
  ]
}
let chart: any = ref('')
onMounted(() => {
  // 图表初始化
  chart.value = markRaw(echarts.init(document.getElementById(props.id) as HTMLDivElement))

  chart.value.setOption(options)

  // 大小自适应
  window.addEventListener('resize', () => {
    chart.value.resize()
  })
})
const downloadEchart = () => {
  // 获取画布图表地址信息
  const img = new Image()
  img.src = chart.value.getDataURL({
    type: 'png',
    pixelRatio: 1,
    backgroundColor: '#fff'
  })
  // 当图片加载完成后，生成 URL 并下载
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const link = document.createElement('a')
      link.download = `业绩柱状图.png`
      link.href = canvas.toDataURL('image/png', 0.9)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  .download {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
