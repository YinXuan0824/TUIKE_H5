<!--
 * @Author: YinXuan
 * @Date: 2023-08-03 13:23:25
 * @LastEditTime: 2024-01-11 13:19:46
 * @Description: 轮播表
-->
<script setup lang="ts">
let props = defineProps({
  tableData: {
    type: Object
  }
})
let orderTen = ref()
let config = ref()
watch(
  () => props.tableData, //这样才可以检测到对象里面的值
  (newValue, oldValue) => {
    orderTen.value = props?.tableData.orderTen
    if (orderTen.value.length > 0) {
      let data = orderTen.value.map((item: any, index: any) => {
        let result = []
        result.push(++index)
        result.push(`<span style="color:#37a2da;">${item.statisticsTime}</span>`)
        result.push(`${item.payAmount}元`)
        return result
      })
      config.value = {
        header: ['序号', '日期', '金额'],
        data: data,
        columnWidth: [80],
        align: ['center', 'center', 'center']
      }
    }
  },
  {
    deep: true
  }
)
</script>

<template>
  <el-card>
    <template #header> 停车费统计 </template>
    <div w-full h-400px><dv-scroll-board :config="config" /></div>
  </el-card>
</template>
<style lang="scss" scoped></style>
