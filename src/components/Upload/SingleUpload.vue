<!--
 * @Author: YinXuan
 * @Date: 2023-07-17 13:10:02
 * @LastEditTime: 2023-10-26 10:04:42
 * @Description: 
-->
<template>
  <!-- 上传组件 -->
  <el-upload
    class="single-uploader"
    :show-file-list="false"
    list-type="picture-card"
    accept=".jpeg,.png,.jpg,.gif"
    :before-upload="handleBeforeUpload"
    :http-request="uploadFile"
  >
    <el-icon class="single-uploader-icon"><i-ep-plus /></el-icon>
  </el-upload>
</template>

<script setup lang="ts">
import { UploadRawFile, UploadRequestOptions } from 'element-plus'
import { uploadFileApi } from '@/api/file'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// const emit = defineEmits(['update:modelValue'])
// const imgUrl = useVModel(props, 'modelValue', emit)

/**
 * 自定义图片上传
 *
 * @param options
 */
function uploadFile(options: UploadRequestOptions) {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  var newfile = new File([options.file], new Date().getTime() + options.file.name)
  console.log('newfile: ', newfile)
  uploadFileApi(newfile).then(() => {
    loading.close()
    handleSuccessUpload()
  })
}

const emit = defineEmits(['handleSuccessUpload'])
function handleSuccessUpload() {
  emit('handleSuccessUpload')
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (file.size > 5 * 1048 * 1048) {
    ElMessage.warning('上传图片不能大于5M')
    return false
  }
  const fileName = file.name
  const fileType = fileName.substring(fileName.lastIndexOf('.'))
  if (
    fileType === '.jpg' ||
    fileType === '.png' ||
    fileType === '.jpeg' ||
    fileType === '.bmp' ||
    fileType === '.gif'
  ) {
    // 不处理
  } else {
    ElMessage.warning('不是,jpeg,.png,.jpg,.gif文件,请上传正确的图片类型')
    return false
  }
  return true
}
</script>

<style scoped>
.single-uploader .single {
  display: block;
  width: 178px;
  height: 178px;
}
</style>

<style>
.single-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.single-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.single-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
