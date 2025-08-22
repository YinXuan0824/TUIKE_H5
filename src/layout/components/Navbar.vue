<template>
  <!-- 顶部导航栏 -->
  <div class="navbar">
    <!-- 左侧面包屑 -->
    <div class="flex left">
      <div class="input-wrapper">
        <button class="Btn"></button>
        <!-- <button class="icon" @click="handleMenu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25px" width="25px">
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#fff"
              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            ></path>
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#fff"
              d="M22 22L20 20"
            ></path>
          </svg>
        </button>
        <input
          placeholder="search..."
          v-model="menuValue"
          class="input"
          name="text"
          type="text"
          @keyup.enter="handleMenu"
        /> -->
      </div>
    </div>

    <!-- 右侧导航设置 -->
    <div class="flex items-center" pr-10px>
      <!-- <button class="weather">
        <router-link to="/ncBigData?from=manage"> <span>停车数据大屏</span> </router-link>
      </button> -->
      <div class="current-time">{{ currentTime }}</div>
      <div class="white-line"></div>
      <!-- 用户头像 -->
      <div class="avatar-container">
        <img src="/src/assets/usual/avatar.png" alt="" />
        欢迎，{{ nickname }}
      </div>
      <div class="white-line"></div>
      <div @click="logout">
        <input id="checkbox" type="checkbox" v-model="isChecked" />
        <label class="switch" for="checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="slider">
            <path
              d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"
            ></path>
          </svg>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useUserStore } from '@/store/modules/user'
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()

const nickname = localStorage.getItem('nickname')

const route = useRoute()
const router = useRouter()

import dayjs from 'dayjs'
const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss')) // 定义一个响应式变量存储当前时间

setInterval(() => {
  currentTime.value = dayjs().add(1, 'second').format('YYYY-MM-DD HH:mm:ss') // 每隔一段时间更新当前时间
}, 1000)

const menuValue = ref('')

const handleMenu = () => {
  const result = containsStringInChildren(router.options.routes, menuValue.value)
  const res = findObjectWithPropertyInChildren(router.options.routes, menuValue.value)
  if (result) {
    router.push({ path: res.path })
  }
}

function containsStringInChildren(array: any, target: string) {
  for (let item of array) {
    if (item.children && Array.isArray(item.children)) {
      // 如果当前项有 children 属性且是一个数组，则递归调用本函数
      if (containsStringInChildren(item.children, target)) {
        return true
      }
    } else if (item.meta.title && typeof item.meta.title === 'string') {
      // 如果当前项是对象并且有指定的属性
      if (item.meta.title.includes(target)) {
        return true
      }
    }
  }
  return false
}

function findObjectWithPropertyInChildren(array: any, target: string) {
  for (let item of array) {
    if (item.children && Array.isArray(item.children)) {
      // 如果当前项有 children 属性且是一个数组，则递归调用本函数
      const foundChild: any = findObjectWithPropertyInChildren(item.children, target)
      if (foundChild) {
        return foundChild
      }
    } else if (item.meta.title && typeof item.meta.title === 'string' && item.meta.title.includes(target)) {
      // 如果当前项是对象并且有指定的属性，并且该属性包含目标字符串
      return item
    }
  }
  return null
}

/**
 * 注销
 */
let isChecked = ref(false)
function logout() {
  isChecked.value = true
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore
        .logout()
        .then(() => {
          tagsViewStore.delAllViews()
        })
        .then(() => {
          router.push(`/login?redirect=${route.fullPath}`)
        })
    })
    .finally(() => {
      isChecked.value = false
    })
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  .Btn {
    width: 170px;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a);
    background-size: 250%;
    background-position: left;
    color: #ffd277;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-duration: 1s;
    overflow: hidden;
    margin-right: 40px;
  }

  .Btn::before {
    position: absolute;
    content: '云南无人小巴管理系统';
    color: #ffd277;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 97%;
    height: 90%;
    border-radius: 8px;
    transition-duration: 1s;
    background-color: rgba(0, 0, 0, 0.842);
    background-size: 200%;
  }

  .Btn:hover {
    background-position: right;
    transition-duration: 1s;
  }

  .Btn:hover::before {
    background-position: right;
    transition-duration: 1s;
  }

  .Btn:active {
    transform: scale(0.95);
  }
  /* From Uiverse.io by Codecite */
  .weather {
    --fancy-button-gradient-0: #8d49fd;
    --fancy-button-gradient-50: #7f56f3;
    --fancy-button-gradient-100: #5691f3;
    --fancy-button-inner-shadow-top: rgba(233, 209, 255, 0.2);
    --fancy-button-inner-shadow-top-lg: rgba(9, 12, 60, 0.1);
    --fancy-button-inner-shadow-bottom: rgba(137, 222, 246, 0.3);
    --fancy-button-shine-top: #e9d1ff;
    --fancy-button-shine-bottom: #adfff9;
    font-weight: 500;
    font-size: 15px;
    line-height: 21px;
    text-shadow: 0px 0.5px 0.5px rgba(0, 0, 0, 0.2);
    padding: 0;
    margin: 0 20px 0 0;
    appearance: none;
    border: none;
    outline: none;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    z-index: 1;
    border-radius: 25px;
    color: #fff;
    background-image: linear-gradient(
      to bottom,
      var(--fancy-button-gradient-0) 0%,
      var(--fancy-button-gradient-50) 50%,
      var(--fancy-button-gradient-100) 100%
    );
    box-shadow: 0px 4px 12px rgba(9, 12, 60, 0.15), 0px 2px 8px rgba(9, 12, 60, 0.15),
      0px 1px 3px var(--fancy-button-inner-shadow-top-lg), inset 0px 1px 1px var(--fancy-button-inner-shadow-top),
      inset 0px -1px 3px var(--fancy-button-inner-shadow-bottom);
  }

  .weather:before,
  .weather:after {
    content: '';
    position: absolute;
    border-radius: inherit;
    will-change: transform;
  }

  .weather:before {
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--fancy-button-shine-top);
    width: 96px;
    height: 6px;
    top: -3px;
    opacity: 0.6;
    filter: blur(6px);
    transition: opacity 0.25s;
  }

  .weather:after {
    inset: 0;
    background-size: cover;
    z-index: 2;
    opacity: 0.3;
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  .weather span {
    display: block;
    padding: 6px 12px;
    border-radius: inherit;
    overflow: hidden;
    position: relative;
    background-image: linear-gradient(to bottom, var(--fancy-button-shine-top), transparent 8px);
    background-position: 0 -6px;
    background-repeat: no-repeat;
    z-index: 1;
  }

  .weather span:before,
  .weather span:after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    background-color: var(--fancy-button-shine-bottom);
    transition: opacity 0.25s, transform 0.25s;
    will-change: transform;
  }

  .weather span:before {
    width: 92px;
    height: 8px;
    bottom: -4px;
    opacity: 0.75;
    filter: blur(6px);
  }

  .weather span:after {
    width: 112px;
    height: 1px;
    bottom: 0;
    opacity: 0.9;
    filter: blur(1px);
  }

  .weather:hover span:before {
    opacity: 0.8;
  }

  .weather:hover span:before {
    transform: translateX(-50%) scale(1.25);
  }

  .weather:hover span:after {
    opacity: 1;
  }

  .current-time {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    width: 150px;
  }

  .avatar-container {
    display: flex;
    align-items: center;
    justify-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
    }
  }
  .white-line {
    height: 29px;
    width: 1px;
    height: 29px;
    background-color: rgba(255, 255, 255, 0.6);
    margin: 0 37px;
  }
  .logout {
    width: 22px;
    height: 23px;
    margin-right: 34px;
    cursor: pointer;
  }
  .input-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    position: relative;
    .input {
      border-style: none;
      height: 30px;
      width: 30px;
      padding: 10px;
      outline: none;
      border-radius: 50%;
      transition: 0.3s ease-in-out;
      background-color: #537fbe;
      box-shadow: 0px 0px 3px #537fbe;
      padding-right: 20px;
      color: #fff;
    }
    .input::placeholder,
    .input {
      color: #537fbe;
      font-size: 16px;
    }
    .input::placeholder {
      color: #537fbe;
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 0px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      outline: none;
      border-style: none;
      border-radius: 50%;
      pointer-events: painted;
      background-color: transparent;
      transition: 0.1s linear;
    }

    .icon:focus ~ .input,
    .input:focus {
      box-shadow: none;
      width: 200px;
      border-radius: 0px !important;
      background-color: transparent !important;
      border-bottom: 3px solid #537fbe !important;
      transition: all 500ms cubic-bezier(0, 0.11, 0.35, 2);
    }

    .icon:focus svg path {
      stroke: #537fbe !important;
    }
  }
}
.left {
  padding-left: 20px;
}

#checkbox {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  z-index: 10;
  cursor: pointer;
  opacity: 0;
}

.switch {
  position: relative;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  z-index: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}
.switch svg {
  width: 1.2em;
}
.switch svg path {
  fill: rgb(48, 48, 48);
}
#checkbox:checked + .switch {
  box-shadow: 0px 0px 1px rgb(151, 243, 255) inset, 0px 0px 2px rgb(151, 243, 255) inset,
    0px 0px 10px rgb(151, 243, 255) inset, 0px 0px 40px rgb(151, 243, 255), 0px 0px 100px rgb(151, 243, 255),
    0px 0px 5px rgb(151, 243, 255);
  border: 2px solid rgb(255, 255, 255);
  background-color: rgb(146, 180, 184);
}
#checkbox:checked + .switch svg {
  filter: drop-shadow(0px 0px 5px rgb(151, 243, 255));
}
#checkbox:checked + .switch svg path {
  fill: rgb(255, 255, 255);
}
:deep(.el-select) {
  width: 150px !important;
}
</style>
