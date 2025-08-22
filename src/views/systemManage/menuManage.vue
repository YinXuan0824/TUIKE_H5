<script setup lang="ts">
import { MenuQuery, MenuForm } from '@/api/menu/types'
import { fetchMenuManageList, saveMenuManage, batchDeleteMenuManage, editMenuManage } from '@/api/menu'

let formData = reactive<MenuForm>({})

const queryParams = reactive<MenuQuery>({
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
  handleQueryMenuFun,
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
  formData = reactive<MenuForm>({})
}

/**
 * 保存提交
 */

function handleSave() {
  if (isEdit.value) {
    handleSaveFun(editMenuManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveMenuManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(batchDeleteMenuManage, [row.id]).then(() => {
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
  formData.parentId = row.parentId
  formData.menuName = row.menuName
  formData.component = row.component
  formData.icon = row.icon
  formData.sort = row.sort
  formData.url = row.url
  formData.type = row.type
}

/**
 * 查询重置
 */
function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.currentPage = 1
  handleQuery()
}

const menuOptions = ref<OptionType[]>([])

/**
 * 查询
 */
function handleQuery() {
  handleQueryMenuFun(fetchMenuManageList, queryParams).then(res => {
    menuOptions.value = [{ value: 0, label: '顶级菜单', children: deepRecurve(res) }]
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
  parentId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
  url: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
  sort: [{ required: true, message: '请选择排序', trigger: 'blur' }]
})

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryParams.menuName" placeholder="菜单名称" clearable @keyup.enter="handleQuery" />
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

      <el-table
        v-loading="loading"
        :data="menuList"
        highlight-current-row
        :tree-props="{
          children: 'childMenus',
          hasChildren: 'hasChildren'
        }"
        row-key="id"
        border
        size="small"
      >
        <el-table-column label="菜单名称" headerAlign="center" align="left" width="200">
          <template #default="scope">
            {{ scope.row.menuName }}
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 0" type="warning">目录</el-tag>
            <el-tag v-if="scope.row.type === 1" type="success">菜单</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="组件名" align="center" width="150" prop="component" />

        <el-table-column label="路由路径" align="center" width="250" prop="url" />

        <el-table-column label="排序" align="center" width="80" prop="sort" />

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
        <h4>{{ isEdit ? '编辑' : '新增' }}菜单</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="父级菜单" prop="parentId">
              <el-tree-select
                v-model="formData.parentId"
                placeholder="请选择"
                :data="menuOptions"
                show-checkbox
                check-strictly
                :render-after-expand="false"
              />
            </el-form-item>

            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="formData.menuName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="formData.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="组件名"
              prop="component"
              :rules="[{ required: true, message: '请输入组件路径', trigger: 'blur' }]"
            >
              <el-input v-model="formData.component" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="图标名" prop="icon">
              <el-input v-model="formData.icon" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="跳转路由" prop="url">
              <el-input v-model="formData.url" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" style="width: 100px" controls-position="right" :min="1" />
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
