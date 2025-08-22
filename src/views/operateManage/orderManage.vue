<!--
 * @Author: YinXuan
 * @Date: 2024-12-27 14:50:20
 * @LastEditTime: 2024-12-29 13:47:57
 * @Description: 订单管理
-->
<script setup lang="ts">
import { checkPlateNoColor } from '@/utils/common'
import { orderManageQuery } from '@/api/operateManage/types'
import { fetchOrderManageList } from '@/api/operateManage'

const queryParams = reactive<orderManageQuery>({
  currentPage: 1,
  pageSize: 10
})

import useBaseHooks from '@/hooks/base'
const {
  queryFormRef,
  menuFormRef,
  loading,
  isLoading,
  total,
  menuList,
  isEdit,
  isOpenDrawer,
  openDrawer,
  handleBatchDeleteFun,
  handleQueryFun,
  handleSaveFun
} = useBaseHooks()

/**
 * 查询重置
 */
function resetQuery() {
  dateValue.value = ''
  dateValue1.value = ''
  dateValue2.value = ''
  queryFormRef.value.resetFields()
  queryParams.currentPage = 1
  handleQuery()
}

/**
 * 查询
 */
const dateValue = ref('')
const dateValue1 = ref('')
const dateValue2 = ref('')
function handleQuery() {
  if (dateValue?.value && dateValue?.value.length > 0) {
    queryParams.reserveBeginTime = dateValue.value[0] + ' 00:00:00'
    queryParams.reserveEndTime = dateValue.value[1] + ' 23:59:59'
  } else {
    delete queryParams.reserveBeginTime
    delete queryParams.reserveEndTime
  }
  if (dateValue1?.value && dateValue1?.value.length > 0) {
    queryParams.tripStartBeginTime = dateValue1.value[0] + ' 00:00:00'
    queryParams.tripStartEndTime = dateValue1.value[1] + ' 23:59:59'
  } else {
    delete queryParams.tripStartBeginTime
    delete queryParams.tripStartEndTime
  }
  if (dateValue2?.value && dateValue2?.value.length > 0) {
    queryParams.tripEndBeginTime = dateValue2.value[0] + ' 00:00:00'
    queryParams.tripEndEndTime = dateValue2.value[1] + ' 23:59:59'
  } else {
    delete queryParams.tripEndBeginTime
    delete queryParams.tripEndEndTime
  }
  handleQueryFun(fetchOrderManageList, queryParams)
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="车牌号码" prop="plateNumber">
          <el-input v-model="queryParams.plateNumber" placeholder="请输入" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="queryParams.phoneNumber" placeholder="请输入" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="预约时间">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="dateValue1"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="dateValue2"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatusList">
          <el-select v-model="queryParams.orderStatusList" multiple clearable placeholder="请选择">
            <el-option label="已取消" :value="0" />
            <el-option label="预约中" :value="1" />
            <el-option label="行程中" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已评价" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="query_btn" @click="handleQuery"
            ><template #icon><i-ep-search /></template>搜索</el-button
          >
          <el-button class="reset_btn" @click="resetQuery">
            <template #icon><i-ep-refresh /></template>
            重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" size="small">
      <el-table v-loading="loading" :data="menuList" highlight-current-row border size="small">
        <el-table-column label="手机号" align="center" width="150" prop="phoneNumber" />

        <el-table-column label="车牌号码" align="center" width="120">
          <template #default="scope">
            <div class="plateNo_class" :style="{ background: checkPlateNoColor(scope.row.plateNumber) }">
              {{ scope.row.plateNumber }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="订单状态" align="center" width="150" prop="orderStatusName">
          <template #default="scope">
            <el-tag :type="scope.row.orderStatusName === '已取消' ? 'danger' : 'success'">
              {{ scope.row.orderStatusName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="行程起点" align="center" width="150" prop="startPointName" />

        <el-table-column label="行程终点" align="center" width="150" prop="endPointName" />

        <el-table-column label="预约时间" align="center" width="150" prop="reserveTime" />

        <el-table-column label="行程开始时间" align="center" width="150" prop="tripStartTime" />

        <el-table-column label="行程结束时间" align="center" min-width="150" prop="tripEndTime" />

        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.currentPage"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
