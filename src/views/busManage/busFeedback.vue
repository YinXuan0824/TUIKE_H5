<!--
 * @Author: YinXuan
 * @Date: 2024-11-12 10:15:18
 * @LastEditTime: 2024-12-30 14:19:36
 * @Description: 无人小巴反馈页
-->
<script setup lang="ts">
import { fetChevaluateSave } from '@/api/webPage'
import { useUserStoreHook } from '@/store/modules/user'
const rateValue = ref(0)
const remark = ref('')
let phoneUser: any = localStorage.getItem('phoneUser')
let currentUser = JSON.parse(phoneUser)
import { useRouter } from 'vue-router'
const router = useRouter()
function handleClick() {
  let params = {
    assessLevel: rateValue.value,
    remark: remark.value
  }
  fetChevaluateSave(params)
    .then(res => {
      ElMessage.success('感谢您的反馈~')
      router.push('/busReserve')
    })
    .catch(err => {
      const { code } = err
      if (code === 401) {
        const userStore = useUserStoreHook()
        userStore.resetTokenH5()
        router.push(`/busLogin`)
      }
    })
}
</script>
<template>
  <div class="feedback">
    <div class="feedback_bg">
      <div class="cell">
        <div class="scan_cell">
          <div class="scan_cell_img"></div>
          <div class="scan_cell_block">
            <div class="phone_number">{{ currentUser.phoneNumber }}</div>
            <div class="scan_cell_title">您觉得此次旅行怎么样?</div>
            <div class="scan_cell_desc">您的反馈将有助于改善驾驶体验</div>
            <el-rate v-model="rateValue" clearable mb20px />
            <el-input v-model="remark" :rows="6" type="textarea" placeholder="请输入反馈意见~" />
          </div>
          <div class="submit-btn" @click="handleClick">提交意见</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scope>
.feedback {
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  .feedback_bg {
    height: 100%;
    background-image: url('/src/assets/bus/login2.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cell {
    width: 90%;
    margin: 0 auto;
    .scan_cell {
      width: 100%;
      border-radius: 20px;
      background-color: #fff;
      box-shadow: 0px 5px 20px 2px #0e0a0a;
      padding: 0 30px 50px;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
      .scan_cell_img {
        width: 100px;
        height: 100px;
        background-image: url('/src/assets/bus/car_bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin: 0 auto;
        position: relative;
        top: -50px;
      }
      .scan_cell_block {
        position: relative;
        top: -30px;
        .phone_number {
          font-size: 20px;
          margin-bottom: 20px;
          color: #000;
        }
        .scan_cell_title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .scan_cell_desc {
          font-size: 16px;
          color: #999;
          margin-bottom: 20px;
        }
      }
      .submit-btn {
        width: 300px;
        height: 55px;
        line-height: 55px;
        background: linear-gradient(360deg, #ffc234 0%, #fffae3 100%);
        box-shadow: inset 0px -2px 1px 0px #f0a535, inset 0px -4px 4px 0px rgba(255, 255, 255, 0.25),
          0px 4px 15px 0px rgba(209, 202, 185, 0.8);
        border-radius: 200px;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        color: #de5d00;
        margin: 0 auto;
      }
    }
  }
}
.el-rate {
  --el-rate-icon-size: 40px;
}
</style>
