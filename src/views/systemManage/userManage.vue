<!--
 * @Author: YinXuan
 * @Date: 2023-08-04 09:17:48
 * @LastEditTime: 2024-12-24 09:36:27
 * @Description: 用户管理
-->
<script setup lang="ts">
import { userManageQuery, userManageForm } from '@/api/systemManage/types'
import {
  fetchUserManageList,
  saveUserManage,
  deleteUserManage,
  editUserManage,
  fetchAllRoleManageList
} from '@/api/systemManage'

// Form表单字段
let formData = reactive<userManageForm>({})

const queryParams = reactive<userManageQuery>({
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
  handleDeleteFun,
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
  formData = reactive<userManageForm>({})
}

/**
 * 保存提交
 */
function handleSave() {
  if (!formData.merchantFlag) {
    formData.merchantId = undefined
  }
  if (isEdit.value) {
    handleSaveFun(editUserManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveUserManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleDeleteFun(deleteUserManage, row).then(() => {
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
  formData.userName = row.userName
  formData.password = row.password
  formData.phoneNumber = row.phoneNumber
  formData.email = row.email
  formData.roleId = row.roleId
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
  handleQueryFun(fetchUserManageList, queryParams)
}

import useFetchValidateHooks from '@/hooks/useValidate'
const { usePhoneValidate, useEmailValidate } = useFetchValidateHooks()
const rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度必须在2到20个字符之间', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: usePhoneValidate, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: useEmailValidate, trigger: 'blur' }
  ],
  roleId: [{ required: true, message: '请选择用户类型', trigger: 'blur' }]
}

const roleList: any = ref([])
function getAllRoleManageList() {
  fetchAllRoleManageList({}).then(res => {
    roleList.value = res.data
  })
}

onMounted(() => {
  handleQuery()
  getAllRoleManageList()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="queryParams.userName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="用户名" align="center" width="150" prop="userName" />

        <el-table-column label="手机号" align="center" width="150" prop="phoneNumber" />

        <el-table-column label="邮箱" align="center" width="250" prop="email" />

        <el-table-column label="角色" align="center" width="150" prop="roleName" />

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
        <h4>{{ isEdit ? '编辑' : '新增' }}用户</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="formData.userName" :maxlength="20" show-word-limit clearable />
            </el-form-item>

            <template v-if="!isEdit">
              <el-form-item
                label="密码"
                prop="password"
                :rules="[
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 5, max: 20, message: '密码长度必须在5到20个字符之间', trigger: 'blur' }
                ]"
              >
                <el-input v-model="formData.password" :maxlength="20" show-word-limit clearable />
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" :maxlength="20" show-word-limit clearable />
              </el-form-item>
            </template>
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="formData.phoneNumber" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" clearable />
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="formData.roleId" clearable placeholder="请选择">
                <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
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
