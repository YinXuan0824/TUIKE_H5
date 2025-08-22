<!--
 * @Author: YinXuan
 * @Date: 2025-05-14 14:01:53
 * @LastEditTime: 2025-05-14 13:33:38
 * @Description: 精准点模式
-->
<script setup lang="ts">
import { siteManageQuery, siteManageForm } from '@/api/operateManage/types'
import { fetchStationManageList, saveStationManage, deleteStationManage, editStationManage } from '@/api/operateManage'

// Form表单字段
let formData = reactive<siteManageForm>({})

const queryParams = reactive<siteManageQuery>({
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
  formData = reactive<siteManageForm>({})
}

/**
 * 保存提交
 */
function handleSave() {
  if (isEdit.value) {
    handleSaveFun(editStationManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveStationManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(deleteStationManage, [row.id]).then(() => {
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
  formData.siteName = row.siteName
  formData.lng = row.lng
  formData.lat = row.lat
  formData.siteSort = row.siteSort
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
  handleQueryFun(fetchStationManageList, queryParams)
}

const rules = {
  siteName: [{ required: true, message: '请输入精准点名称', trigger: 'blur' }],
  lng: [{ required: true, message: '请输入经度', trigger: 'blur' }],
  lat: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
  siteSort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="精准点名称" prop="siteName">
          <el-input v-model="queryParams.siteName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="精准点点名称" align="center" width="150" prop="siteName" />

        <el-table-column label="经度" align="center" width="250" prop="lng" />

        <el-table-column label="纬度" align="center" width="250" prop="lat" />

        <el-table-column label="排序" align="center" width="150" prop="siteSort" />

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
        <h4>{{ isEdit ? '编辑' : '新增' }}精准点</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="精准点名称" prop="siteName">
              <el-input v-model="formData.siteName" clearable />
            </el-form-item>
            <el-form-item label="经度" prop="lng">
              <el-input v-model="formData.lng" clearable />
            </el-form-item>
            <el-form-item label="纬度" prop="lat">
              <el-input v-model="formData.lat" clearable />
            </el-form-item>
            <el-form-item label="排序" prop="siteSort">
              <el-input-number v-model="formData.siteSort" style="width: 100px" controls-position="right" :min="1" />
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
