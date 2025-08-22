<!--
 * @Author: YinXuan
 * @Date: 2024-11-12 10:15:18
 * @LastEditTime: 2025-04-21 13:14:51
 * @Description: 无人小巴登录页
-->
<script setup lang="ts">
import { getPhoneCode } from '@/api/webPage'
import { useUserStore } from '@/store/modules/user'
const phoneNumber = ref('')
const verifyCode = ref('')
const password = ref('')
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
import CryptoJS from 'crypto-js'
function handleClick() {
  if (!phoneNumber.value) {
    return ElMessage.warning('请输入手机号')
  }
  if (!/^1[3456789]\d{9}$/.test(phoneNumber.value)) {
    return ElMessage.warning('请输入正确的手机号')
  }
  let params
  if (isPassword.value) {
    if (!password.value) {
      return ElMessage.warning('请输入密码')
    }
    let key = 'sicv33cb91484b04a177828829081ab7'
    key = CryptoJS.enc.Utf8.parse(key)
    const encryptedContent = CryptoJS.AES.encrypt(password.value, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    const encStr = encryptedContent.ciphertext.toString()
    params = {
      userName: phoneNumber.value,
      password: encStr
    }
  } else {
    if (!verifyCode.value) {
      return ElMessage.warning('请输入手机验证码')
    }
    params = {
      userName: phoneNumber.value,
      msgCode: verifyCode.value
    }
  }
  userStore
    .loginH5(params)
    .then(() => {
      // router.push(`/busReserve`)
    })
    .catch(err => {
      console.log('err:', err)
    })
}
const isPassword = ref(false)
function handleCheck() {
  isPassword.value = !isPassword.value
  if (isPassword.value) {
    verifyCode.value = ''
  } else {
    password.value = ''
  }
}
const countdown = ref(60)
const isCounting = ref(false)
let timer: any = null
function handleFetchCode() {
  if (!phoneNumber.value) {
    return ElMessage.warning('请输入手机号')
  }
  if (!/^1[3456789]\d{9}$/.test(phoneNumber.value)) {
    return ElMessage.warning('请输入正确的手机号')
  }
  // 短信验证码60s倒计时
  if (isCounting.value) return
  isCounting.value = true
  countdown.value = 60
  getPhoneCode(phoneNumber.value).then(res => {
    console.log('res:', res)
  })
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer!)
      isCounting.value = false
    }
  }, 1000)
}
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
<template>
  <div class="home">
    <div class="home_bg">
      <div class="bus_logo"></div>
      <div class="cell">
        <div class="scan_cell">
          <span class="scan_cell_title">登 录</span>
          <div class="scan_block mb30px">
            <div class="flex items-center mb20px">
              <svg-icon icon-class="phoneNumber" mr10px size="48px" />
              <el-input
                v-model="phoneNumber"
                size="large"
                type="number"
                pattern="[0-9]*"
                :placeholder="isPassword ? '请输入手机号/用户名' : '请输入手机号'"
              />
            </div>
            <template v-if="isPassword">
              <div class="flex items-center">
                <svg-icon icon-class="phoneNumberValide" mr10px size="48px" />
                <el-input v-model="password" size="large" type="password" placeholder="请输入密码" />
              </div>
            </template>
            <template v-else>
              <div class="flex items-center">
                <svg-icon icon-class="phoneNumberValide" mr10px size="48px" />
                <el-input v-model="verifyCode" size="large" type="number" pattern="[0-9]*" placeholder="请输入验证码">
                  <template #suffix>
                    <el-button :disabled="isCounting" @click.stop="handleFetchCode" size="small" color="#626aef">
                      {{ isCounting ? `${countdown}秒后重新获取` : '获取验证码' }}
                    </el-button>
                  </template>
                </el-input>
              </div>
            </template>
          </div>
          <div class="submit-btn" @click="handleClick">立即登录</div>
          <span class="login-title" @click="handleCheck">切换登录方式</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scope>
.home {
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  .home_bg {
    height: 100%;
    background-image: url('@/assets/bus/login.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    z-index: 1;
    padding-top: 30px;
    &::after {
      content: '';
      height: 100%;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.25);
      position: absolute;
      z-index: 2;
    }
  }
  .bus_logo {
    width: 100%;
    height: 187px;
    background-image: url('@/assets/bus/login_top.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    max-width: 500px;
    margin: 0 auto 30px;
  }
  .cell {
    width: 90%;
    margin: 0 auto;
    .scan_cell {
      width: 100%;
      border-radius: 20px;
      background-color: #fff;
      box-shadow: 0px 5px 20px 2px #0e0a0a;
      padding: 20px 30px 30px;
      text-align: center;
      max-width: 500px;
      margin: 0 auto;
      .scan_cell_title {
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(180deg, #262628 0%, #0f0f12 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding-bottom: 6px;
        border-bottom: 5px solid #2ecb70;
      }
      .scan_block {
        margin-top: 30px;
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
        margin: 0 auto 20px;
      }
      .login-title {
        font-size: 14px;
        color: #f0a535;
        padding: 4px 0;
        border-top: 0.5px dashed #f0a535;
        border-bottom: 0.5px dashed #f0a535;
      }
    }
  }
}
</style>
