<!--
 * @Author: YinXuan
 * @Date: 2023-09-22 13:09:01
 * @LastEditTime: 2025-04-23 09:58:55
 * @Description: 角色管理
-->
<script setup lang="ts">
import { fetchMenuManageList } from '@/api/menu'
import { fetchRoleManageList, saveRoleManage, batchDeleteRoleManage, editRoleManage } from '@/api/systemManage'
import { roleManageQuery, roleManageForm } from '@/api/systemManage/types'

let formData = reactive<roleManageForm>({})

const queryParams = reactive<roleManageQuery>({
  currentPage: 1,
  pageSize: 10
})

import useBaseHooks from '@/hooks/base'
const {
  queryFormRef,
  menuFormRef,
  loading,
  isLoading,
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
  formData = reactive<roleManageForm>({})
}

/**
 * 保存提交
 */

function handleSave() {
  if (isEdit.value) {
    handleSaveFun(editRoleManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveRoleManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(batchDeleteRoleManage, [row.id]).then(() => {
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
  formData.roleName = row.roleName
  formData.roleMenuList = row.roleMenuList
  formData.status = row.status
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
  handleQueryFun(fetchRoleManageList, queryParams)
}

const menuOptions = ref<OptionType[]>([])
function getMenuList() {
  fetchMenuManageList({}).then(res => {
    menuOptions.value = deepRecurve(res?.data)
  })
}

function deepRecurve(list: any) {
  if (!list && list.length === 0) {
    return []
  }
  let result = list.map((item: any) => {
    return {
      value: item.id,
      label: item.menuName,
      children: item.childMenus && item.childMenus.length ? deepRecurve(item.childMenus) : []
    }
  })
  return result
}

const rules = reactive({
  roleMenuList: [{ required: true, message: '请选择菜单', trigger: 'blur' }],
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
})

// 批量删除
const chooseList: any = ref([])
const isBatchDelete = computed(() => {
  return chooseList.value.length === 0
})
const handleSelectionChange = (list: any) => {
  chooseList.value = list
}
function batchDelete() {
  let paramsList: any = []
  chooseList.value.forEach((item: any) => {
    paramsList.push(item.id)
  })
  handleBatchDeleteFun(batchDeleteRoleManage, paramsList).then(() => {
    handleQuery()
  })
}

onMounted(() => {
  handleQuery()
  getMenuList()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryParams.roleName" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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

        <el-button :disabled="isBatchDelete" color="#626aef" @click="batchDelete">
          <template #icon><i-ep-delete /></template>
          批量删除</el-button
        >
      </template>

      <el-table
        v-loading="loading"
        :data="menuList"
        @selection-change="handleSelectionChange"
        highlight-current-row
        border
        size="small"
      >
        <el-table-column type="selection" align="center" width="50" />

        <el-table-column label="角色名称" align="center" width="150" prop="roleName" />

        <el-table-column label="状态" align="center" width="200">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="warning">停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" label="操作" min-width="220">
          <template #default="scope">
            <el-button type="primary" link size="small" @click.stop="handleEdit(scope.row)">
              <i-ep-edit />编辑
            </el-button>
            <el-button type="primary" link size="small" @click.stop="handleDelete(scope.row)"
              ><i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </el-card>

    <el-drawer
      v-model="isOpenDrawer"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="closeDialog"
    >
      <template #header>
        <h4>{{ isEdit ? '编辑' : '新增' }}角色</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="父级菜单" prop="roleMenuList">
              <el-tree-select
                v-model="formData.roleMenuList"
                placeholder="请选择"
                :data="menuOptions"
                class="w-full"
                accordion
                multiple
                clearable
                show-checkbox
                check-on-click-node
                :render-after-expand="false"
              />
            </el-form-item>

            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="formData.roleName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" clearable placeholder="请选择">
                <el-option label="正常" :value="1" />
                <el-option label="停用" :value="2" />
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
