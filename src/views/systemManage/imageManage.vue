<!--
 * @Author: YinXuan
 * @Date: 2023-08-04 09:17:48
 * @LastEditTime: 2023-09-01 11:06:29
 * @Description: 图片管理
-->
<script setup lang="ts">
import { reactive } from 'vue'
import { fetchImageList, batchDeleteImageFile } from '@/api/file/index'
import dayjs from 'dayjs'
import { userManageQuery, userManageForm } from '@/api/systemManage/types'

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
  handleBatchDeleteFun,
  handleQueryFun
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
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(batchDeleteImageFile, [row.id]).then(() => {
    handleQuery()
  })
}

/**
 * 查询
 */
function handleQuery() {
  handleQueryFun(fetchImageList, queryParams)
}

const singlePicUrl = ref()
// 复制图片链接
function copyText(row: any) {
  let inputNode = document.createElement('input') // 创建input
  inputNode.value = row.url // 赋值给 input 值
  document.body.appendChild(inputNode) // 插入进去
  inputNode.select() // 选择对象
  document.execCommand('Copy') // 原生调用执行浏览器复制命令
  inputNode.className = 'oInput'
  inputNode.style.display = 'none' // 隐藏
  ElMessage.success('复制图片链接成功~')
}
function handleSuccessUpload() {
  ElMessage.success('图片上传成功')
  isOpenDrawer.value = false
  handleQuery()
}

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
  handleBatchDeleteFun(batchDeleteImageFile, paramsList).then(() => {
    handleQuery()
  })
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" size="small">
      <template #header>
        <el-button type="success" @click="openDrawer">
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

        <el-table-column label="图片" align="center" width="300">
          <template #default="scope">
            <el-image :src="scope.row.url" fit="contain" />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" width="180">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" label="操作" min-width="220">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="copyText(scope.row)"> <i-ep-link />复制链接 </el-button>
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
        <h4>{{ isEdit ? '编辑' : '新增' }}图片</h4>
      </template>
      <template #default>
        <div>
          <el-form label-position="top" label-width="100px">
            <el-form-item>
              <single-upload v-model="singlePicUrl" @handleSuccessUpload="handleSuccessUpload" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped></style>
