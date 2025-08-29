<!--
 * @Author: YinXuan
 * @Date: 2025-08-20 13:57:33
 * @LastEditTime: 2025-08-29 14:56:15
 * @Description: 聊天首页
-->
<script setup lang="ts">
import { getAigcOtherLiveVideos, getAigcOtherLivesList, getWechatJsapiTicket } from '@/api/webPage'
import { useRoute } from 'vue-router'
import wx from 'weixin-js-sdk'
import VConsole from 'vconsole'
// 判断是否在微信浏览器中
const isWeChatBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.indexOf('micromessenger') !== -1
}

const route = useRoute()

const redirectTo = decodeURIComponent(route.query.redirectTo as string)

// 从 redirectTo 中提取 智能体ID: agentId 和 语言 language: zh en
let liveId: any
let lan: any = ref('zh')
if (redirectTo && redirectTo.includes('agentId=')) {
  const urlParams = new URLSearchParams(redirectTo.split('?')[1])
  liveId = urlParams.get('agentId') || route.query.agentId
  lan.value = urlParams.get('language') || 'zh' // 默认中文
}

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
    type: 'user',
    content: lan.value === 'zh' ? '发个视频看看吧~' : 'Send a video~'
  },
  {
    id: 2,
    type: 'ai',
    content:
      lan.value === 'zh'
        ? '好的~ 让我想想发哪张... 啊！这张在浴室自拍看看怎么样~'
        : 'Oops~ You can’t be too impatient. Let me think... Ah! How about this one in a bathroom self-portrait? The sheer sleeves are most alluring~',
    url: 'https://smsaas.oss-cn-hangzhou.aliyuncs.com/document/1754273840880.mp4?x-oss-process=video/snapshot,t_1,f_jpg,m_fast,ar_auto'
  },
  {
    id: 3,
    type: 'user',
    content: lan.value === 'zh' ? '不错~ 真听话！#送了个礼物火箭🚀#～' : 'Good job!#Sent a gift rocket🚀#~'
  },
  {
    id: 4,
    type: 'ai',
    content: lan.value === 'zh' ? '太感谢啦！亲一下~mua~' : 'Thanks so much! Kiss me~mua~',
    url: 'https://smsaas.oss-cn-hangzhou.aliyuncs.com/document/1754036458432.jpeg'
  }
])

// APP下载链接
const appDownloadUrls = {
  ios: 'https://apps.apple.com/us/app/tuikor-ai/id6470340604', // iOS App Store链接
  android: 'https://smjzt.oss-cn-hangzhou.aliyuncs.com/Download/tuikor_mainland.apk' // 安卓APK直接下载链接
}

// APP的URL Scheme（需要与APP端配置一致）
const appScheme = 'tuikor://' + redirectTo

let subTitle = ref('')

onMounted(() => {
  // 检测设备信息
  detectDevice()

  // 初始化vconsole（移动端调试工具）
  console.log('设备检测结果:', deviceInfo.value)
  // if (deviceInfo.value.isMobile) {
  //   console.log('检测到移动设备，正在初始化vConsole...')
  //   new VConsole()
  //   console.log('🚀 vConsole已启动，移动端可以查看日志了！')
  // } else {
  //   console.log('非移动设备，跳过vConsole初始化')
  // }

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

  getAigcOtherLivesList({
    from: 'miniprogram',
    id: liveId
  }).then(res => {
    const { data } = res
    if (data.length > 0) {
      subTitle.value = data[0].sub_title
    }
  })

  // 初始化微信分享
  initWechatShare()

  // 监听页面可见性变化，当用户切换应用时隐藏提示
  const handlePageVisibilityChange = () => {
    if (document.hidden || (document as any).webkitHidden) {
      hideLoading()
      console.log('页面被隐藏，清理提示')
    }
  }

  document.addEventListener('visibilitychange', handlePageVisibilityChange)

  // 保存监听器引用，用于清理
  const cleanupVisibilityListener = () => {
    document.removeEventListener('visibilitychange', handlePageVisibilityChange)
  }

  // 页面离开时清理
  onUnmounted(() => {
    hideLoading()
    cleanupVisibilityListener()
    console.log('页面离开，清理所有提示和监听器')
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

  // 更准确的移动设备检测
  const isIOS = /iphone|ipad|ipod/.test(userAgent)
  const isAndroid = /android/.test(userAgent)
  const isWechat = /micromessenger/.test(userAgent)
  const isMobile = isIOS || isAndroid || /mobile/.test(userAgent)

  deviceInfo.value = {
    isIOS,
    isAndroid,
    isWechat,
    isMobile,
    browser,
    isSafari
  }
}

// 初始化微信分享
const initWechatShare = async () => {
  if (!isWeChatBrowser()) {
    console.log('非微信环境，跳过微信分享配置')
    return
  }

  console.log('微信环境，开始配置分享...')
  const formData = new FormData()
  // formData.append('page_url', 'https://www.west999.com/info/html/')
  // 如果需要传递当前页面URL，可以这样：
  formData.append('page_url', window.location.href)

  const res = await getWechatJsapiTicket(formData)
  console.log('res', res)
  const { data } = res
  const { appId, timestamp, nonceStr, signature } = data

  // 微信分享配置
  wx.config({
    debug: false, // 生产环境设为false
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature, // 这里需要后端提供签名，暂时留空
    jsApiList: [
      'updateAppMessageShareData', // 分享给朋友
      'updateTimelineShareData' // 分享到朋友圈
    ]
  })

  // 微信SDK准备就绪
  wx.ready(() => {
    console.log('微信SDK准备就绪，配置分享内容')

    console.log('link', window.location.href)

    // 分享给朋友
    wx.updateAppMessageShareData({
      title: '推氪AI',
      desc: '全天候与你的偶像聊天',
      link: window.location.href,
      imgUrl: 'https://www.tuikeai.com/assets/saas/img/tuikeai/logo.png?1',
      success: () => {
        console.log('分享给朋友配置成功')
      },
      fail: (err: any) => {
        console.error('分享给朋友配置失败:', err)
      }
    })

    // 分享到朋友圈
    wx.updateTimelineShareData({
      title: lan.value === 'zh' ? '推氪AI' : 'Tuikor AI',
      link: window.location.href,
      imgUrl: 'https://www.tuikeai.com/assets/saas/img/tuikeai/logo.png?1',
      success: () => {
        console.log('分享到朋友圈配置成功')
      },
      fail: (err: any) => {
        console.error('分享到朋友圈配置失败:', err)
      }
    })
  })

  // 微信SDK配置失败
  wx.error((err: any) => {
    console.error('微信SDK配置失败:', err)
  })
}

// 智能打开或下载APP
const handleDownloadApp = () => {
  if (deviceInfo.value.isWechat) {
    // 微信内提示去浏览器打开
    showToast('请使用默认浏览器打开并下载～')
    return
  }

  if (deviceInfo.value.isMobile) {
    // 移动端：尝试打开APP，失败则下载
    console.log('移动端设备，尝试打开APP')
    if (deviceInfo.value.isSafari) {
      showLoading('正在跳转App...')
    } else {
      showLoading('正在打开APP...')
    }
    smartOpenApp()
  } else {
    // PC端提示
    console.log('PC端设备，显示提示')
    showToast('请使用默认浏览器打开并下载～')
  }
}

// 智能打开APP或下载
const smartOpenApp = () => {
  if (deviceInfo.value.isIOS) {
    // iOS设备：先尝试打开APP，失败则跳转App Store
    console.log('iOS设备，尝试打开APP')
    tryOpenApp(appScheme, appDownloadUrls.ios)
  } else if (deviceInfo.value.isAndroid) {
    // Android: 尝试打开APP，失败则下载APK
    tryOpenApp(appScheme, appDownloadUrls.android)
  }
}

// 尝试打开APP，失败则执行fallback
const tryOpenApp = (scheme: string, fallbackUrl: string) => {
  let appOpened = false
  let fallbackExecuted = false

  // 显示加载状态
  // showLoading('正在打开APP...')

  // 检测APP是否打开的函数
  const checkAppOpened = () => {
    if (document.hidden || (document as any).webkitHidden) {
      appOpened = true
      console.log('✅ APP已打开')
      hideLoading()
      return true
    }
    return false
  }

  // 监听页面失去焦点（APP打开时页面会失去焦点）
  const handleBlur = () => {
    if (!appOpened && !fallbackExecuted) {
      // 延迟检测，避免误判
      setTimeout(() => {
        if (document.hidden || (document as any).webkitHidden) {
          appOpened = true
          console.log('✅ APP已打开（页面失去焦点）')
          hideLoading()
          // 清理事件监听器
          window.removeEventListener('blur', handleBlur)
          document.removeEventListener('visibilitychange', handleVisibilityChange)
        } else {
          console.log('⚠️ 页面失去焦点但未隐藏，可能是误判')
        }
      }, 500)
    }
  }

  // 执行fallback的函数
  const executeFallback = () => {
    if (fallbackExecuted || appOpened) return
    fallbackExecuted = true
    hideLoading()
    console.log('🚀 执行fallback，跳转下载页面')

    if (deviceInfo.value.isIOS) {
      // iOS设备：在当前页面跳转App Store
      window.location.href = fallbackUrl
    } else {
      // Android设备：下载APK
      window.location.href = fallbackUrl
    }
  }

  // 尝试打开APP
  try {
    if (deviceInfo.value.isIOS) {
      // iOS设备：使用iframe方式尝试打开APP
      console.log('iOS设备：尝试打开APP...')

      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = scheme
      document.body.appendChild(iframe)

      // 1秒后移除iframe
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 1000)

      // 延迟后尝试location.href方式
      setTimeout(() => {
        if (!appOpened && !fallbackExecuted) {
          console.log('iOS：尝试location.href方式...')
          try {
            window.location.href = scheme
          } catch (e) {
            console.log('iOS：location.href失败，继续...')
          }
        }
      }, 1000)
    } else {
      // Android设备：直接使用location.href
      console.log('Android设备：尝试打开APP...')
      window.location.href = scheme
    }
  } catch (error) {
    console.error('打开APP失败:', error)
    executeFallback()
    return
  }

  // 监听页面可见性变化
  const handleVisibilityChange = () => {
    checkAppOpened()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('blur', handleBlur)

  // 延迟检查APP是否打开 - iOS给更多时间
  const checkDelay = deviceInfo.value.isIOS ? 4500 : 2000
  setTimeout(() => {
    console.log(`⏰ ${checkDelay / 1000}秒后检查APP状态：`, {
      appOpened,
      fallbackExecuted,
      documentHidden: document.hidden,
      webkitHidden: (document as any).webkitHidden
    })

    if (checkAppOpened()) return

    // 如果APP未打开，执行fallback
    console.log(`⏰ ${checkDelay / 1000}秒后APP未打开，执行fallback`)
    executeFallback()
  }, checkDelay)

  // 清理事件监听器
  setTimeout(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('blur', handleBlur)
  }, checkDelay + 1000)

  // 强制fallback保护机制 - 确保最终能跳转
  if (deviceInfo.value.isIOS) {
    setTimeout(() => {
      if (!fallbackExecuted && !appOpened) {
        console.log('🛡️ iOS强制fallback保护机制：强制跳转App Store')
        executeFallback()
      }
    }, 6500) // 6.5秒后强制fallback
  }
}

// 显示提示信息
const showToast = (message: string) => {
  // 创建遮罩提示
  showMaskGuide(message)
}

// 显示加载状态
const showLoading = (message: string) => {
  // 创建加载提示
  showMaskGuide(message)
}

// 隐藏加载状态
const hideLoading = () => {
  // 移除所有mask-guide元素
  const masks = document.querySelectorAll('.mask-guide')
  masks.forEach(mask => {
    if (document.body.contains(mask)) {
      document.body.removeChild(mask)
    }
  })
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
      <!-- <video :src="liveData.video_url" autoplay muted loop></video> -->
    </div>
    <div class="home_content">
      <div class="home_content_bar">
        <div class="home_content_bar_left">
          <img src="@/assets/chat/logo.png" class="logo" alt="" />
          <div class="title_box">
            <div class="title">{{ lan === 'zh' ? '推氪AI' : 'Tuikor AI' }}</div>
            <div class="desc">{{ lan === 'zh' ? '全天候与你的偶像聊天' : '24/7 chat with your idol' }}</div>
          </div>
        </div>
        <div class="home_content_bar_right">
          <div class="right_btn" @click="handleDownloadApp">{{ lan === 'zh' ? '下载APP' : 'Download APP' }}</div>
        </div>
      </div>
      <div class="message_box">
        <div class="notice">
          {{ lan === 'zh' ? '内容由AI生成' : 'Content generated by AI' }}
        </div>
        <template v-if="subTitle">
          <div class="introduce">
            <div class="content">
              <span class="title">{{ lan === 'zh' ? '简介:' : 'Introduction:' }}&nbsp;</span>
              {{ subTitle }}
              <!-- 推氪AI，是神马工场旗下行业领先的AI数字人智能体平台。平台隶属上海徽源智能科技有限公司、上海推氪智能科技有限公司（VIE架构主体）。公司成立于2020年，核心团队来自腾讯、字节、阿里等知名互联网公司，公司已完成由创业工场、万物为、华山资本、第九城市等VC机构领投的B轮1500万美元融资，公司致力于通过AI科技不断创新探索，为人类提供跨时代的交互体验~ -->
            </div>
          </div>
        </template>
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
              class="send_input"
              :placeholder="lan === 'zh' ? '按住说话' : 'Hold to Talk'"
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
  background-color: #2a2b2e;
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
                filter: blur(0.1rem) brightness(0.4);
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
          background: rgba(50, 50, 50, 0.68);
          height: 0.44rem;
          display: flex; // 添加flex布局
          align-items: center; // 垂直居中
          box-sizing: border-box; // 确保padding不影响总尺寸
          box-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.1);
          .send_input {
            width: 100%;
            height: 100%;
            border: none;
            padding: 0 0.16rem;
            background: transparent;
            outline: none;
            font-size: 0.16rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            box-sizing: border-box;
            display: block; // 确保input正确显示
            pointer-events: none; // 禁用鼠标事件，让点击事件传递到父级

            &::placeholder {
              text-align: center;
              color: rgba(255, 255, 255, 1); // 更亮的灰白色placeholder
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

    .arrow-top-right {
      margin: -0.85rem 0.2rem 0.08rem auto;
      animation: arrow-bounce 2s infinite;
      transform: translateY(-0.05rem);

      svg {
        width: 0.16rem;
        height: 0.16rem;
        filter: drop-shadow(0 0.01rem 0.02rem rgba(255, 255, 255, 0.5));
      }
    }

    .guide-text {
      font-size: 0.14rem;
      font-weight: 500;
      // margin-bottom: 0.08rem;
      text-shadow: none;
      line-height: 1.3;
      background: rgba(255, 255, 255, 0.9);
      color: rgba(0, 0, 0, 0.9);
      padding: 0.08rem 0.12rem;
      border-radius: 0.08rem;
      backdrop-filter: blur(0.1rem);
      // white-space: nowrap;
    }

    .guide-tip {
      font-size: 0.11rem;
      color: rgba(0, 0, 0, 0.7);
      opacity: 0.9;
      background: rgba(255, 255, 255, 0.9);
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
