<!--
 * @Author: YinXuan
 * @Date: 2025-08-20 13:57:33
 * @LastEditTime: 2025-08-22 11:46:14
 * @Description: 聊天首页
-->
<script setup lang="ts">
import { getAigcOtherLiveVideos } from '@/api/webPage'
import { useRoute } from 'vue-router'

const route = useRoute()
const liveId = route.query.liveId
let liveData: any = ref([])

// 设备检测
const deviceInfo = ref({
  isIOS: false,
  isAndroid: false,
  isWechat: false,
  isMobile: false,
  browser: 'Unknown',
  isSafari: false
})

// 聊天消息列表
const messageList = ref([
  {
    id: 1,
    type: 'ai',
    content: '您好！我是推氪AI，请问有什么可以帮助您的呢？'
  },
  {
    id: 2,
    type: 'user',
    content: '发个视频～'
  },
  {
    id: 3,
    type: 'ai',
    content: '哎呀~这么心急可不行呢，让我想想...啊!这张在复古浴室穿黄丝吊带的怎么样?纱袖若隐若现最勾人了~',
    url: 'https://smsaas.oss-cn-hangzhou.aliyuncs.com/document/1754273840880.mp4?x-oss-process=video/snapshot,t_1,f_jpg,m_fast,ar_auto'
  },
  {
    id: 4,
    type: 'user',
    content: '发个照片～'
  },
  {
    id: 5,
    type: 'ai',
    content: '(轻轻歪头)这么想看呀?那给你看这张在海边穿深V挂脖裙的，拎着裙摆笑得超甜~',
    url: 'https://smsaas.oss-cn-hangzhou.aliyuncs.com/document/1754036458432.jpeg'
  }
])

// APP下载链接
const appDownloadUrls = {
  ios: 'https://apps.apple.com/us/app/tuikor-ai/id6470340604', // iOS App Store链接
  android: 'https://smjzt.oss-cn-hangzhou.aliyuncs.com/Download/kolmint_v111.apk' // 安卓APK直接下载链接
}

onMounted(() => {
  // 检测设备信息
  detectDevice()

  let params = {
    from: 'miniprogram',
    live_id: liveId,
    type: 0
  }
  getAigcOtherLiveVideos(params).then(res => {
    const { data } = res
    if (data.length > 0) {
      liveData.value = data[0]
    }
  })
})

// 检测设备类型
const detectDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const vendor = navigator.vendor

  // 检测浏览器
  let browser = 'Unknown'
  let isSafari = false

  if (vendor && vendor.indexOf('Apple') > -1) {
    browser = 'Safari'
    isSafari = true
  } else if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    browser = 'Chrome'
  } else if (userAgent.includes('firefox')) {
    browser = 'Firefox'
  } else if (userAgent.includes('edg')) {
    browser = 'Edge'
  }

  deviceInfo.value = {
    isIOS: /iphone|ipad|ipod/.test(userAgent),
    isAndroid: /android/.test(userAgent),
    isWechat: /micromessenger/.test(userAgent),
    isMobile: /mobile|android|iphone|ipad/.test(userAgent),
    browser,
    isSafari
  }
}

// 下载或打开APP
const handleDownloadApp = () => {
  if (deviceInfo.value.isWechat) {
    // 微信内提示去浏览器打开
    showToast('请使用默认浏览器打开并下载～')
    return
  }

  // 根据设备类型跳转到相应的下载页面
  const downloadUrl = deviceInfo.value.isIOS ? appDownloadUrls.ios : appDownloadUrls.android

  if (deviceInfo.value.isMobile) {
    // 移动端直接跳转
    window.location.href = downloadUrl
  } else {
    // PC端提示
    showToast('请使用默认浏览器打开并下载～')
  }
}

// 显示提示信息
const showToast = (message: string) => {
  // 创建遮罩提示
  showMaskGuide(message)
}

// 显示遮罩引导
const showMaskGuide = (message: string) => {
  // 创建遮罩容器
  const mask = document.createElement('div')
  mask.className = 'mask-guide'

  // 创建内容
  mask.innerHTML = `
    <div class="guide-content">
      <div class="arrow-top-right">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 6L18 18M18 6L6 18M18 6H6M18 6V18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="guide-text">${message}</div>
      <div class="guide-tip">点击关闭</div>
    </div>
  `

  // 添加到页面
  document.body.appendChild(mask)

  // 显示动画
  setTimeout(() => {
    mask.classList.add('show')
  }, 10)

  // 点击遮罩关闭
  mask.addEventListener('click', () => {
    mask.classList.remove('show')
    setTimeout(() => {
      if (document.body.contains(mask)) {
        document.body.removeChild(mask)
      }
    }, 300)
  })
}
</script>
<template>
  <div
    class="home"
    :style="{ backgroundImage: `url(${liveData.video_img})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
  >
    <div class="home_bg">
      <video :src="liveData.video_url" autoplay muted loop></video>
    </div>
    <div class="home_content">
      <div class="home_content_bar">
        <div class="home_content_bar_left">
          <img src="@/assets/chat/logo.png" class="logo" alt="" />
          <div class="title_box">
            <div class="title">推氪AI</div>
            <div class="desc">基于AIGC驱动</div>
          </div>
        </div>
        <div class="home_content_bar_right">
          <div class="right_btn" @click="handleDownloadApp">下载APP</div>
        </div>
      </div>
      <div class="message_box">
        <div class="notice">内容由AI生成，使用时请遵守平台社区公约</div>
        <div class="introduce">
          <div class="content">
            <span class="title">简介:&nbsp;</span>
            推氪AI，是神马工场旗下行业领先的AI数字人智能体平台。平台隶属上海徽源智能科技有限公司、上海推氪智能科技有限公司（VIE架构主体）。公司成立于2020年，核心团队来自腾讯、字节、阿里等知名互联网公司，公司已完成由创业工场、万物为、华山资本、第九城市等VC机构领投的B轮1500万美元融资，公司致力于通过AI科技不断创新探索，为人类提供跨时代的交互体验~
          </div>
        </div>
        <div class="message_list">
          <div
            v-for="message in messageList"
            :key="message.id"
            :class="['message-item', message.type === 'ai' ? 'ai-message' : 'user-message']"
          >
            <!-- 消息内容 -->
            <div class="message-content">
              <div class="message-text">
                {{ message.content }}
                <!-- 如果有图片URL，显示虚化背景和锁 -->
                <div v-if="message.url" class="message-image-lock" @click="handleDownloadApp">
                  <div class="blur-bg" :style="{ backgroundImage: `url(${message.url})` }"></div>
                  <div class="lock-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                        stroke="white"
                        stroke-width="2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                        stroke="white"
                        stroke-width="2"
                        stroke-linejoin="round"
                      />
                      <circle cx="12" cy="16" r="1" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="input_box"
        :style="{
          padding:
            deviceInfo.isSafari && !deviceInfo.isWechat
              ? '0.08rem 0.12rem 0.9rem 0.12rem'
              : '0.08rem 0.12rem 0.4rem 0.12rem'
        }"
      >
        <div class="input_wrapper">
          <div class="input_cell" @click.prevent.stop="handleDownloadApp">
            <input
              type="text"
              disabled
              class="send_input"
              placeholder="发消息给推氪AI吧，回复由AI生成"
              enterkeyhint="send"
              value=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scope>
#app {
  background-image: none !important;
}
.home {
  height: 100vh;
  overflow: hidden;
  width: 100vw;

  .home_bg {
    width: 100%;
    height: 100%;
    position: absolute;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover; // 确保视频充满容器，可能会裁剪部分内容
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
  }
  .home_content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
    .home_content_bar {
      position: relative;
      margin: 0.08rem;
      margin-bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.53rem;
      padding: 0.08rem;
      background: rgba(0, 0, 0, 0.4);
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.03);
      z-index: 3;
      border-radius: 0.12rem;
      .home_content_bar_left {
        display: flex;
        align-items: center;
        .logo {
          width: 0.36rem;
          height: 0.36rem;
          margin-right: 0.08rem;
          border-radius: 0.1rem;
          border: 0.5px solid rgba(255, 255, 255, 0.1490196078);
        }
        .title_box {
          .title {
            height: 0.2rem;
            line-height: 0.2rem;
            font-size: 0.14rem;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.8);
          }
          .desc {
            height: 0.15rem;
            line-height: 0.15rem;
            font-size: 0.11rem;
            color: rgba(255, 255, 255, 0.75);
          }
        }
      }
      .home_content_bar_right {
        display: flex;
        align-items: center;
        .right_btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 0.34rem;
          padding: 0 0.16rem;
          background: #ffd980;
          border-radius: 2rem;
          color: #161823;
          font-size: 0.14rem;
          font-weight: 500;
          white-space: nowrap;
        }
      }
    }
    .message_box {
      flex: 1;
      display: flex;
      flex-direction: column;
      // flex-direction: column-reverse;
      position: relative;
      padding: 0.13rem;
      overflow-y: scroll;
      overscroll-behavior: none;
      .notice {
        margin: 0.06rem auto 0.15rem;
        padding: 0.05rem 0.08rem;
        box-sizing: border-box;
        border-radius: 0.21rem;
        background: rgba(0, 0, 0, 0.15);
        -webkit-backdrop-filter: blur(0.5rem);
        backdrop-filter: blur(0.5rem);
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
        font-size: 0.12rem;
        font-weight: 400;
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
      }
    }
    .introduce {
      padding: 0.1rem 0.16rem;
      border-radius: 0.1rem;
      background: linear-gradient(0deg, rgba(19, 94, 97, 0.01), rgba(19, 94, 97, 0.01)),
        linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));
      margin-bottom: 0.1rem;
      .content {
        margin-top: 0.06rem;
        max-height: 0.8rem;
        color: rgba(255, 255, 255, 0.75);
        font-size: 0.14rem;
        font-weight: 400;
        line-height: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 4;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        .title {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
    .message_list {
      flex: 1;
      overflow-y: auto;

      .message-item {
        display: flex;
        align-items: flex-start;

        &.ai-message {
          justify-content: flex-start;

          .message-content {
            .message-text {
              border-radius: 0.15rem 0.12rem 0.12rem;
              background: rgba(28, 28, 28, 0.8980392157);
              color: rgba(255, 255, 255, 0.9);
              font-size: 0.15rem;
              font-weight: 400;
              line-height: 0.21rem;
              word-break: break-word;
              width: -webkit-fit-content;
              width: -moz-fit-content;
              width: fit-content;
              max-width: 2.95rem;
              margin-top: 0.19rem;
              padding: 0.12rem 0.15rem;
              flex-shrink: 0;
            }

            // 图片锁样式
            .message-image-lock {
              margin-top: 0.12rem;
              position: relative;
              width: 1.2rem;
              height: 0.9rem;
              border-radius: 0.08rem;
              overflow: hidden;
              box-shadow: 0 0.04rem 0.12rem rgba(0, 0, 0, 0.2);

              .blur-bg {
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                filter: blur(0.02rem) brightness(0.7);
                position: absolute;
                top: 0;
                left: 0;
              }

              .lock-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(0.1rem);
                border-radius: 50%;
                padding: 0.08rem;
                box-shadow: 0 0.04rem 0.16rem rgba(0, 0, 0, 0.3);
                border: 0.02rem solid rgba(255, 255, 255, 0.2);
                width: 0.32rem;
                height: 0.32rem;
                display: flex;
                align-items: center;
                justify-content: center;

                svg {
                  width: 0.12rem;
                  height: 0.12rem;
                  filter: drop-shadow(0 0.02rem 0.04rem rgba(0, 0, 0, 0.5));
                }
              }

              // 添加一个微妙的边框
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 0.02rem solid rgba(255, 255, 255, 0.1);
                border-radius: 0.12rem;
                pointer-events: none;
              }
            }
          }

          // 第一个AI消息不需要margin-top
          &:first-child .message-content .message-text {
            margin-top: 0.09rem;
          }
        }

        &.user-message {
          justify-content: flex-end;

          .message-content {
            .message-text {
              border-radius: 0.12rem;
              background: rgba(250, 204, 129, 0.9098039216);
              color: #000;
              font-size: 0.15rem;
              font-weight: 400;
              line-height: 0.21rem;
              word-break: break-word;
              width: -webkit-fit-content;
              width: -moz-fit-content;
              width: fit-content;
              max-width: 2.95rem;
              margin-top: 0.19rem;
              padding: 0.12rem 0.15rem;
              flex-shrink: 0;
            }
          }
        }
      }
    }
    .input_box {
      position: relative;
      width: 100%;
      // height: 0.6rem;
      flex: none;
      // padding 现在通过动态样式根据浏览器类型设置
      display: flex;
      align-items: center;
      .input_wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        -webkit-user-drag: none;
        .input_cell {
          flex: 1;
          border-radius: 0.12rem;
          padding: 0.12rem 0;
          background: rgba(255, 255, 255, 0.3490196078);
          height: 0.44rem;
          display: flex; // 添加flex布局
          align-items: center; // 垂直居中
          box-sizing: border-box; // 确保padding不影响总尺寸
          .send_input {
            width: 100%;
            height: 100%;
            border: none;
            padding: 0 0.16rem;
            background: transparent;
            outline: none;
            font-size: 0.14rem;
            color: rgba(255, 255, 255, 0.9);
            caret-color: #ffd980;
            box-sizing: border-box;
            display: block; // 确保input正确显示
            pointer-events: none; // 禁用鼠标事件，让点击事件传递到父级

            &::placeholder {
              color: rgba(255, 255, 255, 0.9); // 更亮的灰白色placeholder
            }
          }
        }
      }
    }
  }
}
*::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}
@media (min-width: 385px) {
  html {
    font-size: 104px !important;
  }
}
@media (min-width: 375px) and (max-width: 385px) {
  html {
    font-size: 102.4px !important;
  }
}
@media (min-width: 360px) and (max-width: 375px) {
  html {
    font-size: 100px !important;
  }
}
@media (min-width: 344px) and (max-width: 360px) {
  html {
    font-size: 96px !important;
  }
}
@media (min-width: 320px) and (max-width: 344px) {
  html {
    font-size: 91.73px !important;
  }
}
@media (max-width: 320px) {
  html {
    font-size: 85.33px !important;
  }
}

/* 遮罩引导样式 */
.mask-guide {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0.05rem 0.1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &.show {
    opacity: 1;
  }

  .guide-content {
    position: relative;
    text-align: right;
    color: white;
    max-width: 60%;

    .arrow-top-right {
      margin: -0.85rem 0.2rem 0.08rem auto;
      animation: arrow-bounce 2s infinite;
      transform: translateY(-0.05rem);

      svg {
        width: 0.16rem;
        height: 0.16rem;
        filter: drop-shadow(0 0.01rem 0.02rem rgba(0, 0, 0, 0.5));
      }
    }

    .guide-text {
      font-size: 0.14rem;
      font-weight: 500;
      margin-bottom: 0.08rem;
      text-shadow: 0 0.01rem 0.02rem rgba(0, 0, 0, 0.5);
      line-height: 1.3;
      background: rgba(0, 0, 0, 0.3);
      padding: 0.08rem 0.12rem;
      border-radius: 0.08rem;
      backdrop-filter: blur(0.1rem);
      white-space: nowrap;
    }

    .guide-tip {
      font-size: 0.11rem;
      color: rgba(255, 255, 255, 0.7);
      opacity: 0.8;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.06rem 0.1rem;
      border-radius: 0.06rem;
      display: inline-block;
    }
  }
}

/* 箭头动画 */
@keyframes arrow-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  40% {
    transform: translateY(-0.05rem) scale(1.1);
    opacity: 0.8;
  }
  60% {
    transform: translateY(-0.02rem) scale(1.05);
    opacity: 0.9;
  }
}
</style>
