<template>
  <div class="pie-card">
    <div class="top_cell flex items-center justify-between">
      <div class="left_cell flex items-center">
        <div class="tips_image"></div>
        <div class="tips_word">车位总览</div>
      </div>
    </div>
    <div class="flex-pie">
      <Pie
        v-if="defaultList"
        class="pie_chart"
        :traffic-way-list="defaultList"
        :color-list="['#02BCA4', '#DE9007', '#4981FF']"
      ></Pie
      ><Pie v-else class="pie_chart" :color-list="['#02BCA4', '#DE9007', '#4981FF']"></Pie>

      <div>
        <div class="word_cell">
          <div class="green-bg line"></div>
          <div class="title">占用</div>
          <div class="green number">{{ tempList?.inParkTotal || 0 }}</div>
        </div>
        <div class="word_cell">
          <div class="yellow-bg line"></div>
          <div class="title">空闲</div>
          <div class="yellow number">{{ tempList?.notParkTotal || 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Pie from '@/components/ECharts/Pie/index.vue'
import * as echarts from 'echarts'

const props = defineProps({
  tempList: {
    type: Object,
    default: {}
  },
  id: {
    type: String,
    default: 'pieChart'
  }
})

let defaultList = ref()

watch(
  () => props.tempList, //这样才可以检测到对象里面的值
  (newValue, oldValue) => {
    defaultList.value = [
      {
        name: '占用',
        value: props?.tempList?.inParkTotal
      },
      {
        name: '空闲',
        value: props?.tempList?.notParkTotal
      }
    ]
  },
  {
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.pie-card {
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
  height: 100%;
  .top_cell {
    .left_cell {
      .tips_image {
        width: 24px;
        height: 24px;
        background-image: url('/src/assets/usual/tips.png');
        background-size: 100%;
        background-repeat: no-repeat;
        margin-right: 9px;
      }
      .tips_word {
        font-weight: bold;
        font-size: 14px;
        color: #333333;
      }
    }
    .right_cell {
      width: 80px;
      height: 30px;
      background: rgba(73, 129, 255, 0.15);
      border-radius: 8px;
      .word {
        font-weight: bold;
        font-size: 14px;
        color: #2969c2;
        margin-right: 8px;
      }
      .right_icon {
        width: 12px;
        height: 7px;
        background-image: url('/src/assets/usual/bottom.png');
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
  .flex-pie {
    height: 80%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .pie_chart {
      height: 100%;
    }
    .word_cell {
      height: 55px;
      margin-top: 10px;
      .line {
        width: 17px;
        height: 9px;
        border-radius: 4px;
      }
      .title {
        font-weight: bold;
        font-size: 16px;
        color: #333333;
      }
      .number {
        font-weight: bold;
        font-size: 20px;
        color: #02bca4;
      }
      .green {
        color: #02bca4;
      }
      .yellow {
        color: #de9007;
      }
      .blue {
        color: #749fff;
      }
      .red {
        color: red;
      }
      .green-bg {
        background: #02bca4;
      }
      .yellow-bg {
        background: #de9007;
      }
      .blue-bg {
        background: #749fff;
      }
      .red-bg {
        background: red;
      }
    }
  }
}
@media screen and (min-width: 1024px) and (max-width: 1600px) {
  .flex-pie {
    .word_cell {
      height: 55px;
      // margin: 0 !important; /* 将 margin-top 设置为 0 */
      .line {
        width: 17px;
        height: 9px;
        border-radius: 4px;
      }
      .title {
        font-weight: bold;
        font-size: 14px !important;
        color: #333333;
      }
      .number {
        font-weight: bold;
        font-size: 18px !important;
        color: #02bca4;
      }
    }
  }
}
// @media screen and (min-width: 1921px) and (max-width: 2976px) {
//   .flex-pie {
//     .word_cell {
//       height: 75px !important;
//       margin: 0 !important; /* 将 margin-top 设置为 0 */
//       .line {
//         width: 20px !important;
//         height: 9px;
//         border-radius: 4px;
//       }
//       .title {
//         font-weight: bold;
//         font-size: 18px !important;
//         color: #333333;
//       }
//       .number {
//         font-weight: bold;
//         font-size: 22px !important;
//         color: #02bca4;
//       }
//     }
//   }
// }
</style>
