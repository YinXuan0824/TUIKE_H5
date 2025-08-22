<template>
  <div
    class="login-container flex items-center justify-center animate__animated animate__fadeIn"
    :style="{ 'background-image': 'url(' + loginBg + ')' }"
  >
    <div class="left_cell"></div>
    <div class="login-cell animate__animated animate__slideInDown">
      <el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form">
        <div mb30px text-center>
          <span class="login-title">欢迎登录</span>
        </div>

        <el-form-item prop="userName">
          <div class="p-2">
            <svg-icon icon-class="user" />
          </div>
          <el-input
            clearable
            ref="userName"
            v-model="loginData.userName"
            class="flex-1"
            size="large"
            placeholder="用户名"
            name="userName"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="p-2">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            clearable
            v-model="loginData.password"
            class="flex-1"
            placeholder="密码"
            :type="passwordVisible === false ? 'password' : 'input'"
            size="large"
            name="password"
          />
          <span class="mr-2" @click="passwordVisible = !passwordVisible">
            <svg-icon :icon-class="passwordVisible === false ? 'eye' : 'eye-open'" class="cursor-pointer" />
          </span>
        </el-form-item>

        <el-form-item prop="verifyCode">
          <span class="p-2">
            <svg-icon icon-class="verify" />
          </span>
          <el-input
            clearable
            v-model="loginData.verifyCode"
            class="flex-1"
            size="large"
            placeholder="验证码"
            @keyup.enter="handleLogin"
          />
          <div class="imgSize" :style="{ 'background-image': 'url(' + imgVerify + ')' }" @click="fetchVerifyCode"></div>
        </el-form-item>

        <el-button
          size="large"
          :loading="loading"
          type="primary"
          class="w-full mb6 h-50px rd-30px btn"
          @click.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import SvgIcon from '@/components/SvgIcon/index.vue'
// 状态管理依赖
import { useUserStore } from '@/store/modules/user'

// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from 'vue-router'
import { LoginData } from '@/api/auth/types'
import { loginVerify } from '@/api/auth/index'

// Vue3组件内部使用全局变量
import { inject } from 'vue'
const globalData: any = inject('globalData')

const userStore = useUserStore()
const route = useRoute()
import loginBg from '/static/img/login/login_bg.png'
import logoUrl from '/static/img/login/logo.jpg'
import bg from '/static/img/login/bg0.jpg'
import { showBackImg, preLoadImg } from './changeImg'
let imgUrl = ref(bg)
setInterval(() => {
  imgUrl.value = showBackImg()
}, 5000)

/**
 * 按钮loading
 */
const loading = ref(false)
/**
 * 密码是否可见
 */
const passwordVisible = ref(false)

/**
 * 登录表单引用
 */
const loginFormRef: any = ref(ElForm)

const loginData = ref<LoginData>({
  userName: '',
  password: '',
  verifyCode: ''
})

const loginRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, trigger: 'blur', validator: passwordValidator }],
  verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

/**
 * 密码校验器
 */
function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('密码长度必须在5到20个字符之间'))
  } else {
    callback()
  }
}

const imgVerify = ref('')
function fetchVerifyCode() {
  loginData.value.verifyCode = ''
  loginVerify({}).then((res: any) => {
    const objectURL = URL.createObjectURL(res.data)
    imgVerify.value = objectURL
  })
}

/**
 * 登录
 */
import CryptoJS from 'crypto-js'
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      let key = 'sicv33cb91484b04a177828829081ab7'
      key = CryptoJS.enc.Utf8.parse(key)
      const encryptedContent = CryptoJS.AES.encrypt(loginData.value.password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      const encStr = encryptedContent.ciphertext.toString()
      let params = {
        userName: loginData.value.userName,
        password: encStr,
        verifyCode: loginData.value.verifyCode
      }
      userStore
        .login(params)
        .then(() => {
          const query: LocationQuery = route.query
          const redirect = (query.redirect as LocationQueryValue) ?? '/dashboard'
          const otherQueryParams = Object.keys(query).reduce((acc: any, cur: string) => {
            if (cur !== 'redirect') {
              acc[cur] = query[cur]
            }
            return acc
          }, {})
          const merchantFlag = localStorage.getItem('merchantFlag')
          if (merchantFlag === 'true') {
            router.push({ path: '/merchantBuy' })
          } else {
            router.push({ path: redirect, query: otherQueryParams })
          }
        })
        .catch(() => {
          fetchVerifyCode()
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

onMounted(() => {
  fetchVerifyCode()
  preLoadImg()
})
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  animation-duration: 1s;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  .left_cell {
    width: 600px;
    height: 400px;
    background-image: url('@/assets/login/left_bg.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .login-cell {
    padding: 30px 60px 40px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.7);
    border: 2px solid rgba(255, 255, 255, 1);
    .login-title {
      font-size: 30px;
      font-weight: 700;
      color: rgba(0, 0, 0, 1);
      border-bottom: 8px solid rgba(69, 131, 250, 1);
    }
    .login-form {
      width: 300px;
      max-width: 100%;
      .captcha {
        position: absolute;
        top: 0;
        right: -10px;

        img {
          width: 120px;
          height: 48px;
          cursor: pointer;
          border-top-right-radius: 40px;
          border-bottom-right-radius: 40px;
        }
      }
    }
  }
}

.el-form-item {
  background-color: #a5cdf5;
  border: 1px solid #a5cdf5;
  border-radius: 50px;
  margin-bottom: 20px;
  padding: 0 10px;
}
.el-input {
  background: #a5cdf5;
  --el-input-placeholder-color: #fff;
  // 子组件 scoped 无效，使用 :deep
  :deep(.el-input__wrapper) {
    padding: 0;
    background: #a5cdf5;
    box-shadow: none;

    .el-input__inner {
      color: #fff;
      background: #a5cdf5;
      border: 0;
      border-radius: 0;
      caret-color: #fff;
      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #a5cdf5 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
      // 设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition: color 99999s ease-out, background-color 99999s ease-out;
        transition-delay: 99999s;
      }
    }
  }
}
.btn {
  position: relative;
  text-align: center;
  color: #fff;
  font-size: 14px;
  // 让英文字母全都变成大写
  // text-transform: uppercase;
  cursor: pointer;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 400%;
}
.btn:hover {
  animation: animate 8s linear infinite;
}
@keyframes animate {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 400%;
  }
}
.btn::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 400%;
  border-radius: 40px;
  opacity: 0;
  transition: 0.5s;
}

.btn:hover::before {
  filter: blur(20px);
  opacity: 1;
  animation: animate 8s linear infinite;
}

.imgSize {
  width: 120px;
  height: 34px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 2px;
  cursor: pointer;
}
:deep(.el-form-item.is-error) {
  box-shadow: none;
}
:deep(.el-input__wrapper:hover) {
  box-shadow: none !important;
}
</style>
