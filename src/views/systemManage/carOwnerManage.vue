<!--
 * @Author: YinXuan
 * @Date: 2024-12-23 09:42:30
 * @LastEditTime: 2025-04-23 09:32:09
 * @Description: 车主用户
-->
<script setup lang="ts">
import { carOwnerManageQuery, carOwnerManageForm } from '@/api/systemManage/types'
import {
  fetchCarOwnerManageList,
  saveCarOwnerManage,
  deleteCarOwnerManage,
  editCarOwnerManage
} from '@/api/systemManage'
import dayjs from 'dayjs'

// Form表单字段
let formData = reactive<carOwnerManageForm>({
  roleType: 1
})

const queryParams = reactive<carOwnerManageQuery>({
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
  formData = reactive<carOwnerManageForm>({})
}

/**
 * 保存提交
 */
function handleSave() {
  if (isEdit.value) {
    handleSaveFun(editCarOwnerManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveCarOwnerManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(deleteCarOwnerManage, [row.id]).then(() => {
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
  formData.nickName = row.nickName
  formData.phoneNumber = row.phoneNumber
  formData.roleType = row.roleType
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
  handleQueryFun(fetchCarOwnerManageList, queryParams)
}

import useFetchValidateHooks from '@/hooks/useValidate'
const { usePhoneValidate } = useFetchValidateHooks()
const rules = {
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: usePhoneValidate, trigger: 'blur' }
  ]
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="queryParams.phoneNumber" placeholder="请输入" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryParams.userName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="queryParams.nickName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="手机号/用户名" align="center" width="150" prop="phoneNumber" />

        <el-table-column label="昵称" align="center" width="150" prop="nickName" />

        <el-table-column label="账号" align="center" width="150" prop="userName" />

        <el-table-column label="角色" align="center" width="150" prop="roleType">
          <template #default="scope">
            <el-tag v-if="scope.row.roleType === 1" type="success">普通用户</el-tag>
            <el-tag v-else type="warning">管理员</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" width="200">
          <template #default="scope">
            {{ scope.row.createTime ? dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center" width="200">
          <template #default="scope">
            {{ scope.row.updateTime ? dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
          </template>
        </el-table-column>

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
        <h4>{{ isEdit ? '编辑' : '新增' }}车主用户</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="手机号/用户名" prop="phoneNumber">
              <el-input v-model="formData.phoneNumber" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="formData.nickName" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="formData.password" :maxlength="20" show-word-limit clearable />
            </el-form-item>
            <el-form-item label="角色" prop="roleType">
              <el-select v-model="formData.roleType">
                <el-option label="普通用户" :value="1" />
                <el-option label="管理员" :value="2" />
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
