<!--
 * @Author: YinXuan
 * @Date: 2024-12-27 14:18:01
 * @LastEditTime: 2025-04-23 09:57:07
 * @Description: 途径点管理
-->
<script setup lang="ts">
import { channelManageQuery, channelManageForm } from '@/api/operateManage/types'
import {
  fetchChannelManageList,
  saveChannelManage,
  deleteChannelManage,
  editChannelManage,
  fetchLineList
} from '@/api/operateManage'

// Form表单字段
let formData = reactive<channelManageForm>({})

const queryParams = reactive<channelManageQuery>({
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
  formData = reactive<channelManageForm>({})
}

/**
 * 保存提交
 */
function handleSave() {
  if (isEdit.value) {
    handleSaveFun(editChannelManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveChannelManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(deleteChannelManage, [row.id]).then(() => {
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
  formData.pointName = row.pointName
  formData.lng = row.lng
  formData.lat = row.lat
  formData.pointSort = row.pointSort
  formData.siteSign = row.siteSign
  formData.lineId = row.lineId
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
  handleQueryFun(fetchChannelManageList, queryParams)
}

const rules = {
  pointName: [{ required: true, message: '请输入途径点名称', trigger: 'blur' }],
  lng: [{ required: true, message: '请输入经度', trigger: 'blur' }],
  lat: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
  pointSort: [{ required: true, message: '请输入站点排序', trigger: 'blur' }],
  lineId: [{ required: true, message: '请选择线路名称', trigger: 'blur' }]
}

onMounted(() => {
  handleQuery()
  handleTransformData()
})

const lineList: any = ref([])
function handleTransformData() {
  fetchLineList({}).then(res => {
    lineList.value = res.data
  })
}
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="途径点名称" prop="pointName">
          <el-input v-model="queryParams.pointName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="站点标识" prop="siteSign">
          <el-select v-model="queryParams.siteSign" clearable placeholder="请选择">
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
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
      <template #header>
        <el-button class="add_btn" @click="openDrawer">
          <template #icon><i-ep-plus /></template>
          新增</el-button
        >
      </template>

      <el-table v-loading="loading" :data="menuList" highlight-current-row border size="small">
        <el-table-column label="途径点名称" align="center" width="150" prop="pointName" />

        <el-table-column label="途径点排序" align="center" width="150" prop="pointSort" />

        <el-table-column label="经度" align="center" width="250" prop="lng" />

        <el-table-column label="纬度" align="center" width="250" prop="lat" />

        <el-table-column label="站点标识" align="center" width="150" prop="siteSign">
          <template #default="scope">
            <el-tag v-if="scope.row.siteSign" type="success">是</el-tag>
            <el-tag v-else type="warning">否</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="路线名称" align="center" width="150" prop="lineName" />

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
        <h4>{{ isEdit ? '编辑' : '新增' }}途径点</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="途径点名称" prop="pointName">
              <el-input v-model="formData.pointName" clearable />
            </el-form-item>
            <el-form-item label="经度" prop="lng">
              <el-input v-model="formData.lng" clearable />
            </el-form-item>
            <el-form-item label="纬度" prop="lat">
              <el-input v-model="formData.lat" clearable />
            </el-form-item>
            <el-form-item label="排序" prop="pointSort">
              <el-input-number v-model="formData.pointSort" style="width: 100px" controls-position="right" :min="1" />
            </el-form-item>
            <el-form-item label="站点标识" prop="siteSign">
              <el-switch v-model="formData.siteSign" inline-prompt active-text="是" inactive-text="否" />
            </el-form-item>
            <el-form-item label="路线名称" prop="lineId">
              <el-select v-model="formData.lineId" clearable placeholder="请选择" style="width: 260px">
                <el-option v-for="item in lineList" :key="item.lineId" :label="item.lineName" :value="item.lineId" />
              </el-select>
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
