/*
 * @Author: YinXuan
 * @Date: 2023-07-26 13:07:39
 * @LastEditTime: 2023-09-21 15:49:28
 * @Description: 自定义统一hooks
 */
export default function () {
  // 是否编辑
  const isEdit = ref(false)
  // 打开抽屉
  const isOpenDrawer = ref(false)
  // 表格loading
  const loading = ref(false)
  // 表格List
  const menuList = ref([])
  // 分页器总数
  const total = ref(0)
  // 提交按钮loading
  const isLoading = ref(false)
  // 新增表单
  const menuFormRef = ref(ElForm)
  // 筛选表单
  const queryFormRef = ref(ElForm)

  const openDrawer = () => {
    isEdit.value = false
    isOpenDrawer.value = true
  }

  /**
   * 保存提交
   */
  function handleSaveFun(apiFun?: any, formData?: any) {
    return new Promise<void>(resolve => {
      menuFormRef.value.validate((isValid: boolean) => {
        if (isValid) {
          isLoading.value = true
          if (isEdit.value) {
            apiFun(formData)
              .then(() => {
                ElMessage.success('修改成功~')
                resolve()
              })
              .finally(() => {
                isLoading.value = false
              })
          } else {
            apiFun(formData)
              .then(() => {
                ElMessage.success('新增成功~')
                resolve()
              })
              .finally(() => {
                isLoading.value = false
              })
          }
        }
      })
    })
  }

  /**
   * 删除
   */
  const handleDeleteFun = function (apiFun?: any, row?: any) {
    return new Promise<void>(resolve => {
      ElMessageBox.confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiFun(row.id).then(() => {
          ElMessage.success('删除成功~')
          resolve()
        })
      })
    })
  }

  /**
   * 批量删除
   */
  const handleBatchDeleteFun = function (apiFun?: any, list?: any) {
    return new Promise<void>(resolve => {
      ElMessageBox.confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiFun(list).then(() => {
          ElMessage.success('删除成功~')
          resolve()
        })
      })
    })
  }

  /**
   * 查询
   */
  const handleQueryFun = function (apiFun?: any, params?: any) {
    return new Promise<void>(resolve => {
      loading.value = true
      apiFun(params)
        .then((res: any) => {
          menuList.value = res.data.records
          total.value = res.data.total
        })
        .finally(() => {
          loading.value = false
        })
    })
  }

  /**
   * 查询 菜单
   * 返回的是data，而且不需要分页
   *
   */
  const handleQueryMenuFun = function (apiFun?: any, params?: any) {
    return new Promise<any>(resolve => {
      loading.value = true
      apiFun(params)
        .then((res: any) => {
          menuList.value = res.data
          resolve(res.data)
        })
        .finally(() => {
          loading.value = false
        })
    })
  }

  /**
   * 返回表单规则 rules
   */
  // eg:
  // let arr = [
  //     {
  //       key: 'warehouseId',
  //       name: '场库名称',
  //       type: 'check'
  //     },
  //     {
  //       key: 'oem',
  //       name: '设备厂商',
  //       type: 'input'
  //     }
  //   ]
  const rulesReturnFun = function (tempList: any) {
    var result: any = {}
    tempList.forEach((item: any) => {
      result[item.key] = [
        {
          required: item.required || true,
          message: `请${item.type === 'check' ? '选择' : '输入'}${item.name}`,
          trigger: 'blur'
        }
      ]
    })
    return result
  }

  return {
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
    handleBatchDeleteFun,
    handleQueryFun,
    rulesReturnFun,
    handleSaveFun,
    handleQueryMenuFun
  }
}
