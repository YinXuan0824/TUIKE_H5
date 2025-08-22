<template>
  <div class="charge-details">
    <div class="top_cell flex items-center justify-between">
      <div class="left_cell flex items-center">
        <div class="tips_image"></div>
        <div class="tips_word">场库统计</div>
        <div class="contain">
          <div class="tabs">
            <input type="radio" id="radio-1" name="tabs" />
            <label class="tab" for="radio-1" @click="handleChooose(0)">月</label>
            <input type="radio" id="radio-2" name="tabs" />
            <label class="tab" for="radio-2" @click="handleChooose(1)">年</label>
            <span class="glider"></span>
          </div>
        </div>
      </div>
      <div class="right_cell flex items-center justify-center" style="width: 100px">
        <el-select
          v-model="value"
          clearable
          @change="handleChange"
          @clear="handleClear"
          placeholder="请选择"
          size="small"
          style="width: 100px"
        >
          <el-option v-for="item in allSiteManageList" :key="item.id" :label="item.warehouseName" :value="item.id" />
        </el-select>
      </div>
    </div>
    <div class="flex-table">
      <dv-scroll-board :config="config" class="tables" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  staticDataMap: {
    type: Array,
    default: []
  }
})

// warehouseName场库名称、orderNum订单总数、paymentAmount订单金额、actualPayment实付金额
const config: any = ref({
  header: ['场库名称', '订单总数', '订单金额(万元)'],
  data: [],
  columnWidth: [90, 90, 150],
  align: ['center', 'center', 'center'],
  headerBGC: '#e0eaf6',
  oddRowBGC: '#FFFFFF',
  evenRowBGC: '#F4F7FC',
  color: 'black'
})
const value = ref('0')
const emit = defineEmits(['selectValue'])
let warehouseId = ref('0')
const handleChange = (value: any) => {
  warehouseId.value = value
  let params = {
    warehouseId: warehouseId.value,
    type: type.value
  }
  emit('selectValue', params)
  getfetchHomeList()
}
let type = ref(0)
function handleChooose(value: number) {
  type.value = value
  let params = {
    warehouseId: warehouseId.value,
    type: type.value
  }
  emit('selectValue', params)
  getfetchHomeList()
}

const defaultList: any = ref([])
const allSiteManageList: any = ref([])

import useFetchApiHooks from '@/hooks/fetchList'
const { getAllStorageData } = useFetchApiHooks()
const postAllStaion = () => {
  getAllStorageData({}).then((res: any) => {
    allSiteManageList.value = res
    allSiteManageList.value.unshift({
      id: '0',
      warehouseName: '全部场库'
    })
  })
}
// warehouseName场库名称、orderNum订单总数、paymentAmount订单金额、actualPayment实付金额
const getfetchHomeList = () => {
  config.value.data = defaultList.value.map(({ warehouseName, orderNum, paymentAmount }) => ({
    warehouseName,
    orderNum,
    paymentAmount
  }))
}
watch(
  () => props.staticDataMap, //这样才可以检测到对象里面的值
  (newValue, oldValue) => {
    defaultList.value = newValue
    getfetchHomeList()
  },
  {
    deep: true,
    immediate: true
  }
)

const handleClear = () => {
  getfetchHomeList()
}

onMounted(() => {
  postAllStaion()
  getfetchHomeList()
})
</script>
<style lang="scss" scoped>
.charge-details {
  background: #ffffff;
  border-radius: 10px;
  height: 100%;
}
.flex-table {
  width: 90%;
  height: calc(100% - 40px);
  margin-left: 5%;
}
:deep(.el-select .el-input__wrapper) {
  width: 100px;
}
:deep(.dv-scroll-board .header) {
  font-family: Microsoft YaHei;
  font-weight: bold;
  font-size: 13px;
  color: #333333;
}
:deep(.dv-scroll-board .rows .row-item) {
  color: DimGray;
  font-family: Microsoft YaHei;
  // font-weight: bold;
  font-size: 13px;
}
:deep(.dv-scroll-board .rows .row-item .ceil) {
  width: 220px;
  display: inline-block;
}
:deep(.el-table) {
  height: 100%;
  color: red;
}
.pagination[data-v-8c60cd3a] {
  padding: 0;
  margin: 0;
}
.top_cell {
  .left_cell {
    .tips_image {
      margin: 10px 0 5px 10px;
      width: 24px;
      height: 24px;
      background-image: url('/src/assets/usual/location.png');
      background-size: 100%;
      background-repeat: no-repeat;
      margin-right: 9px;
    }
    .tips_word {
      font-weight: bold;
      font-size: 14px;
      color: #333333;
    }
    /* From Uiverse.io by Pradeepsaranbishnoi */
    .tabs {
      display: flex;
      position: relative;
      background-color: #fff;
      box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
      padding: 4px 6px;
      border-radius: 99px;
      margin-left: 6px;
    }

    .tabs * {
      z-index: 2;
    }

    .contain input[type='radio'] {
      display: none;
    }

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      width: 30px;
      font-size: 12px;
      color: black;
      font-weight: 500;
      border-radius: 99px;
      cursor: pointer;
      transition: color 0.15s ease-in;
    }

    .contain input[type='radio']:checked + label {
      color: #185ee0;
    }

    .contain input[id='radio-1']:checked ~ .glider {
      transform: translateX(0);
    }

    .contain input[id='radio-2']:checked ~ .glider {
      transform: translateX(100%);
    }

    .contain input[id='radio-3']:checked ~ .glider {
      transform: translateX(200%);
    }

    .glider {
      position: absolute;
      display: flex;
      height: 20px;
      width: 30px;
      background-color: #e6eef9;
      z-index: 1;
      border-radius: 99px;
      transition: 0.25s ease-out;
    }
  }

  .right_cell {
    margin-right: 20px;
    width: 80px;
    height: 30px;
    // background: rgba(73, 129, 255, 0.15);
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
.el-table--small {
  font-size: 10px;
  border-radius: 8px;
}
// @media screen and (min-width: 1921px) and (max-width: 2560px) {
//   .top_cell {
//     .left_cell {
//       .tips_image {
//         margin: 10px 0 5px 10px;
//         width: 30px;
//         height: 30px;
//         background-image: url("/src/assets/data-overview/location.png");
//         background-size: 100%;
//         background-repeat: no-repeat;
//         margin-right: 9px;
//       }
//       .tips_word {
//         font-weight: bold;
//         font-size: 18px !important;
//         color: #333333;
//       }
//     }

//     .right_cell {
//       margin-right: 20px;
//       width: 80px;
//       height: 30px;
//       // background: rgba(73, 129, 255, 0.15);
//       border-radius: 8px;
//       .word {
//         font-weight: bold;
//         font-size: 14px;
//         color: #2969c2;
//         margin-right: 8px;
//       }
//       .right_icon {
//         width: 12px;
//         height: 7px;
//         background-image: url("/src/assets/usual/bottom.png");
//         background-size: 100%;
//         background-repeat: no-repeat;
//       }
//     }
//   }
// }
</style>
