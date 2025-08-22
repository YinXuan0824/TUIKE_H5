<!--
 * @Author: YinXuan
 * @Date: 2024-12-23 14:01:53
 * @LastEditTime: 2025-04-23 09:58:04
 * @Description: 车辆信息
-->
<script setup lang="ts">
import { checkPlateNoColor } from '@/utils/common'
import { carInfoManageQuery, carInfoManageForm } from '@/api/operateManage/types'
import {
  fetchCarInfoManageList,
  saveCarInfoManage,
  deleteCarInfoManage,
  editCarInfoManage,
  fetchLineList
} from '@/api/operateManage'

// Form表单字段
let formData = reactive<carInfoManageForm>({})

const queryParams = reactive<carInfoManageQuery>({
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
  formData = reactive<carInfoManageForm>({})
}

/**
 * 保存提交
 */
function handleSave() {
  if (isEdit.value) {
    handleSaveFun(editCarInfoManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  } else {
    handleSaveFun(saveCarInfoManage, formData).then(() => {
      closeDialog()
      handleQuery()
    })
  }
}

/**
 * 删除
 */
function handleDelete(row: any) {
  handleBatchDeleteFun(deleteCarInfoManage, [row.id]).then(() => {
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
  formData.plateNumber = row.plateNumber
  formData.vehicleNo = row.vehicleNo
  formData.image = row.image
  formData.manufacturer = row.manufacturer
  formData.powerType = row.powerType
  formData.autoDrivingLevel = row.autoDrivingLevel
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
  handleQueryFun(fetchCarInfoManageList, queryParams)
}

const rules = {
  plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  vehicleNo: [{ required: true, message: '请输入车辆编号', trigger: 'blur' }],
  image: [{ required: true, message: '请选择车辆照片地址', trigger: 'blur' }]
}

function handleSuccessUpload(url: string) {
  formData.image = url
  ElMessage.success('图片上传成功')
}

onMounted(() => {
  handleQuery()
})

const isOpenDialog = ref(false)
const lineList: any = ref([])
function handleTransformData(item: any) {
  formData = reactive<carInfoManageForm>({})
  fetchLineList({}).then(res => {
    lineList.value = res.data
    formData.id = item.id
    isOpenDialog.value = true
  })
}
function handleSaveLine() {
  editCarInfoManage(formData).then(() => {
    isOpenDialog.value = false
    handleQuery()
  })
}
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="queryParams.plateNumber" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="车牌号码" align="center" width="120">
          <template #default="scope">
            <div class="plateNo_class" :style="{ background: checkPlateNoColor(scope.row.plateNumber) }">
              {{ scope.row.plateNumber }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="车辆编号" align="center" width="250" prop="vehicleNo" />

        <el-table-column label="车辆照片地址" align="center" width="250" prop="image">
          <template #default="scope">
            <el-image
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
              style="width: 200px; height: 100px"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>

        <el-table-column label="车企厂商" align="center" width="150" prop="manufacturer" />

        <el-table-column label="车辆行驶线路" align="center" width="150" prop="lineName" />

        <el-table-column label="动力类型" align="center" width="150" prop="powerType">
          <template #default="scope">
            <el-tag v-if="scope.row.powerType === 1" type="success">新能源</el-tag>
            <el-tag v-else type="warning">燃油车</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="自停标识" align="center" width="150" prop="autoStopSign">
          <template #default="scope">
            <el-tag v-if="scope.row.autoStopSign === 1" type="success">每站停</el-tag>
            <el-tag v-else type="warning">预约停</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="自动驾驶级别" align="center" width="150" prop="autoDrivingLevel" />

        <el-table-column fixed="right" align="center" label="操作" min-width="220">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="handleEdit(scope.row)"> <i-ep-edit />编辑 </el-button>
            <el-button type="primary" link size="small" @click="handleDelete(scope.row)"
              ><i-ep-delete />
              删除
            </el-button>
            <el-button type="primary" link size="small" @click="handleTransformData(scope.row)"
              ><i-ep-MagicStick />
              切换线路
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
        <h4>{{ isEdit ? '编辑' : '新增' }}车辆信息</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="menuFormRef" label-position="top" label-width="100px" :model="formData" :rules="rules">
            <el-form-item label="车牌号" prop="plateNumber">
              <el-input v-model="formData.plateNumber" clearable />
            </el-form-item>
            <el-form-item label="车辆编号" prop="vehicleNo">
              <el-input v-model="formData.vehicleNo" clearable />
            </el-form-item>
            <el-form-item label="车辆照片地址" prop="image">
              <image-upload
                v-if="isOpenDrawer"
                :modelValue="formData.image"
                uploadFrom="carInfo"
                @handleSuccessUpload="handleSuccessUpload"
              />
            </el-form-item>
            <el-form-item label="车企厂商" prop="manufacturer">
              <el-input v-model="formData.manufacturer" clearable />
            </el-form-item>
            <el-form-item label="动力类型" prop="powerType">
              <el-select v-model="formData.powerType" clearable placeholder="请选择">
                <el-option label="新能源" :value="1" />
                <el-option label="燃油车" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="自动驾驶级别" prop="autoDrivingLevel">
              <el-input v-model="formData.autoDrivingLevel" clearable />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <el-button type="primary" :loading="isLoading" @click="handleSave">{{ isEdit ? '编辑' : '保存' }}</el-button>
      </template>
    </el-drawer>

    <el-dialog v-model="isOpenDialog" width="400" align-center :show-close="false" center>
      <template #header> 切换线路 </template>
      <template #default>
        <div class="flex items-center justify-around">
          <div>路线名称:</div>
          <el-select v-model="formData.lineId" clearable placeholder="请选择" style="width: 260px">
            <el-option v-for="item in lineList" :key="item.lineId" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </div>
        <div class="tips mt20px">
          注: 路线设置成功后，智慧小巴不会立即切换路线，需等待以下任一条件满足才可完成路线切换
        </div>
        <div class="tips">① 当前处于人工驾驶模式。</div>
        <div class="tips">② 当前处于自动驾驶模式，且车速为 0</div>
      </template>
      <template #footer>
        <el-button class="purple_btn" :loading="isLoading" @click="handleSaveLine">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #ff8c00;
  margin-bottom: 6px;
}
</style>
