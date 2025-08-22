<!--
 * @Author: YinXuan
 * @Date: 2024-12-23 14:01:53
 * @LastEditTime: 2024-12-27 11:19:08
 * @Description: 安全员管理
-->
<script setup lang="ts">
import { checkPlateNoColor } from '@/utils/common'
import { safeManageQuery, safeManageForm } from '@/api/operateManage/types'
import { fetchSafeManageList, saveSafeManage, deleteSafeManage, editSafeManage } from '@/api/operateManage'

// Form表单字段
let formData = reactive<safeManageForm>({})

const queryParams = reactive<safeManageQuery>({
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
 * 关闭抽屉
 */
function closeDialog() {
  isOpenDrawer.value = false
  resetForm()
}
/**
 * 重置表单
 */
function resetForm() {
  menuFormRef.value.resetFields()
  formData = reactive<safeManageForm>({})
}

/**
 * 保存提交
 */
function handleSave() {
  if (isEdit.value) {
    handleSaveFun(editSafeManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveSafeManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(deleteSafeManage, [row.id]).then(() => {
    handleQuery()
  })
}

/**
 * 编辑
 */
function handleEdit(row: any) {
  isEdit.value = true
  isOpenDrawer.value = true
  formData.id = row.id
  formData.name = row.name
  formData.vehicleId = row.vehicleId
  formData.age = row.age
  formData.gender = row.gender
  formData.phone = row.phone
  formData.qualificationsNo = row.qualificationsNo
  formData.periodValidity = row.periodValidity
  formData.drivingExperience = row.drivingExperience
}

/**
 * 查询重置
 */
function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.currentPage = 1
  handleQuery()
}

/**
 * 查询
 */
function handleQuery() {
  handleQueryFun(fetchSafeManageList, queryParams)
}

import useFetchValidateHooks from '@/hooks/useValidate'
const { usePhoneValidate } = useFetchValidateHooks()
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  vehicleId: [{ required: true, message: '请选择车辆', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: usePhoneValidate, trigger: 'blur' }
  ]
}

import useFetchApiHooks from '@/hooks/fetchList'
const { getAllCarInfoManageData } = useFetchApiHooks()
let carInfoList: any = ref([])
function initEditQueryList() {
  getAllCarInfoManageData({}).then(res => {
    carInfoList.value = res
  })
}

onMounted(() => {
  handleQuery()
  initEditQueryList()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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
      <template #header>
        <el-button class="add_btn" @click="openDrawer">
          <template #icon><i-ep-plus /></template>
          新增</el-button
        >
      </template>

      <el-table v-loading="loading" :data="menuList" highlight-current-row border size="small">
        <el-table-column label="姓名" align="center" width="150" prop="name" />

        <el-table-column label="车牌号码" align="center" width="150" prop="phone" />

        <el-table-column label="车辆" align="center" width="120">
          <template #default="scope">
            <div class="plateNo_class" :style="{ background: checkPlateNoColor(scope.row.plateNumber) }">
              {{ scope.row.plateNumber }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="年龄" align="center" width="100" prop="age" />

        <el-table-column label="性别" align="center" width="100" prop="gender">
          <template #default="scope">
            {{ scope.row.gender === 0 ? '男' : '女' }}
          </template>
        </el-table-column>

        <el-table-column label="资格证编号" align="center" width="200" prop="qualificationsNo" />

        <el-table-column label="驾龄" align="center" width="100" prop="drivingExperience" />

        <el-table-column label="有效期" align="center" width="150" prop="periodValidity" />

        <el-table-column fixed="right" align="center" label="操作" min-width="220">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="handleEdit(scope.row)"> <i-ep-edit />编辑 </el-button>
            <el-button type="primary" link size="small" @click="handleDelete(scope.row)"
              ><i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>

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

    <el-drawer
      v-model="isOpenDrawer"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="closeDialog"
    >
      <template #header>
        <h4>{{ isEdit ? '编辑' : '新增' }}安全员</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" clearable />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" clearable />
            </el-form-item>
            <el-form-item label="车辆" prop="vehicleId">
              <el-select v-model="formData.vehicleId" clearable placeholder="请选择">
                <el-option v-for="item in carInfoList" :key="item.id" :label="item.plateNumber" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="formData.age" clearable />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="formData.gender" clearable placeholder="请选择">
                <el-option label="男" :value="0" />
                <el-option label="女" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="资格证编号" prop="qualificationsNo">
              <el-input v-model="formData.qualificationsNo" clearable />
            </el-form-item>
            <el-form-item label="驾龄" prop="drivingExperience">
              <el-input v-model="formData.drivingExperience" clearable />
            </el-form-item>
            <el-form-item label="有效期" prop="periodValidity">
              <el-date-picker
                v-model="formData.periodValidity"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <el-button type="primary" :loading="isLoading" @click="handleSave">{{ isEdit ? '编辑' : '保存' }}</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped></style>
