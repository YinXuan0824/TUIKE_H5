<!--
 * @Author: YinXuan
 * @Date: 2023-08-22 13:31:53
 * @LastEditTime: 2024-01-23 16:48:26
 * @Description: 查看监控视频
-->
<script setup name="videoFlv">
import flvjs from 'flv.js'
// 首先定义flvPlayer为null
const flvPlayer = ref(null)
const props = defineProps({
  videoUrl: {
    type: String,
    default: () => {}
  }
})

const createVideo = () => {
  if (flvjs.isSupported()) {
    var videoElement = document.getElementById('videoElement')
    flvPlayer.value = flvjs.createPlayer(
      {
        type: 'flv',
        url: props?.videoUrl, //你的url地址
        isLive: true,
        hasAudio: false
      },
      {
        enableWorker: false, //不启用分离线程
        enableStashBuffer: false, //关闭IO隐藏缓冲区
        reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
        autoCleanupSourceBuffer: true //自动清除缓存
      }
    )
    flvPlayer.value.attachMediaElement(videoElement)
    flvPlayer.value.load()
    setTimeout(function () {
      flvPlayer.value.play()
    }, 300)
    //处理视频播放错误的语法
    flvPlayer.value.on('error', () => {
      ElMessage.error(`视频加载失败，请稍候重试！`)
      return false
    })
  }
}

// 我的视频是弹窗显示的，所以创建了destroy方法，在子组件中暴露出去后，在父组件调用即可，这样关闭弹窗后，视频流会停止请求。
const destroy = () => {
  flvPlayer.value.pause() //暂停播放数据流
  flvPlayer.value.unload() //取消数据流加载
  flvPlayer.value.detachMediaElement() //将播放实例从节点中取出
  flvPlayer.value.destroy() //销毁播放实例
  flvPlayer.value = null
}
defineExpose({ destroy })

onMounted(() => {
  createVideo()
})
onUnmounted(() => {
  destroy()
})
</script>

<template>
  <div class="videoBox">
    <dv-border-box9 py20px px20px :dur="5">
      <video id="videoElement" controls autoplay muted style="width: 100%; height: 100%; object-fit: fill"></video>
    </dv-border-box9>
  </div>
</template>
<style lang="scss" scoped>
.videoBox {
  overflow: hidden;
}
</style>
