<template>
  <div v-if="visible" class="qr-scanner-container">
    <div class="qr-scanner-wrapper">
      <!-- 扫码区域 -->
      <div class="video-container">
        <video ref="video" class="scanner-video"></video>
        <div class="scanner-overlay">
          <!-- 顶部区域 -->
          <div class="scanner-header">
            <div class="close-button" @click="closeScanner">
              <x-svg-icon class="close-icon" name="close"></x-svg-icon>
            </div>
            <div class="scanner-title">{{ title }}</div>
          </div>

          <!-- 扫码框 -->
          <div class="scanner-frame">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
            <div class="scan-line"></div>
          </div>

          <!-- 提示文字 -->
          <div class="scanner-tips">{{ tips }}</div>

          <!-- 底部功能区 -->
          <div class="scanner-footer">
            <div v-if="hasFlash" class="action-button" @click="toggleFlash">
              <div class="action-icon">
                <x-svg-icon :name="flashOn ? 'lightning-on' : 'lightning-off'"></x-svg-icon>
              </div>
            </div>
            <div class="action-button" @click="openAlbum">
              <div class="action-icon">
                <x-svg-icon name="album"></x-svg-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐藏的文件选择器 -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display:none"
        @change="processFile"
      />
    </div>
  </div>
</template>

<script>
import jsQR from 'jsqr'

export default {
  name: 'QrScanner',
  props: {
    // 控制扫码组件显示/隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 扫码成功后是否自动停止
    autoStop: {
      type: Boolean,
      default: true
    },
    // 扫码组件标题
    title: {
      type: String,
      default: '扫一扫'
    },
    // 扫码提示文字
    tips: {
      type: String,
      default: '将二维码放入框内，即可自动扫描'
    }
  },
  data() {
    return {
      isScanning: false,
      canvasElement: null,
      canvas: null,
      video: null,
      stream: null,
      flashOn: false,
      hasFlash: false,
      scanInterval: null,
      visibilityHandler: null
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.startScanning()
        })
      } else {
        this.stopScanning()
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.startScanning()
    }
  },
  beforeDestroy() {
    this.stopScanning()
  },
  // 添加更多的生命周期钩子来确保摄像头资源被释放
  deactivated() {
    // 处理keep-alive组件被停用的情况
    this.stopScanning()
  },
  methods: {
    /**
     * 启动摄像头并开始扫描二维码
     * 请求用户摄像头权限，设置视频流，并初始化扫描过程
     * @async
     * @returns {Promise<void>}
     * @emits error - 当摄像头无法访问时触发
     */
    async startScanning() {
      try {
        this.video = this.$refs.video

        // 请求摄像头权限
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })

        // 检查设备是否支持闪光灯
        const tracks = this.stream.getVideoTracks()
        if (tracks.length > 0) {
          const capabilities = tracks[0].getCapabilities()
          this.hasFlash = capabilities.torch !== undefined
        }

        this.video.srcObject = this.stream
        this.video.setAttribute('playsinline', true)
        this.video.play()

        this.isScanning = true
        this.setupCanvas()
        this.scan()

        // 监听页面可见性变化
        this.setupVisibilityListener()
      } catch (error) {
        this.$emit('error', error)
        console.error('无法访问摄像头:', error)
      }
    },
    /**
     * 创建用于二维码分析的Canvas元素
     * @returns {void}
     */
    setupCanvas() {
      this.canvasElement = document.createElement('canvas')
      this.canvas = this.canvasElement.getContext('2d')
    },
    /**
     * 设置页面可见性变化的监听器
     * 当页面不可见时暂停扫描，重新可见时恢复扫描
     * @returns {void}
     */
    setupVisibilityListener() {
      // 移除之前的监听器
      this.removeVisibilityListener()

      // 添加页面可见性变化监听
      this.visibilityHandler = () => {
        if (document.hidden) {
          this.pauseScanning()
        } else {
          // 仅当组件仍然可见时才恢复扫描
          if (this.visible && !this.isScanning) {
            this.resumeScanning()
          }
        }
      }
      document.addEventListener('visibilitychange', this.visibilityHandler)
    },
    /**
     * 移除页面可见性变化的监听器
     * @returns {void}
     */
    removeVisibilityListener() {
      if (this.visibilityHandler) {
        document.removeEventListener('visibilitychange', this.visibilityHandler)
        this.visibilityHandler = null
      }
    },
    /**
     * 暂停扫描过程但不释放摄像头资源
     * 用于临时性中断，如页面切换到后台时
     * @returns {void}
     */
    pauseScanning() {
      if (this.scanInterval) {
        clearInterval(this.scanInterval)
        this.scanInterval = null
      }

      if (this.stream) {
        // 暂停摄像头但不释放资源
        const tracks = this.stream.getVideoTracks()
        tracks.forEach((track) => {
          track.enabled = false
        })
      }

      this.isScanning = false
    },
    /**
     * 恢复之前暂停的扫描过程
     * 重新启用摄像头并继续扫描
     * @returns {void}
     */
    resumeScanning() {
      if (!this.stream) return

      // 恢复摄像头
      const tracks = this.stream.getVideoTracks()
      tracks.forEach((track) => {
        track.enabled = true
      })

      this.isScanning = true
      this.scan()
    },

    /**
     * 创建定时器从视频帧中扫描二维码
     * @returns {void}
     * @emits result - 扫描到有效二维码时触发，传递扫描结果
     */
    scan() {
      // 确保没有重复的扫描间隔
      if (this.scanInterval) {
        clearInterval(this.scanInterval)
      }

      this.scanInterval = setInterval(() => {
        if (this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
          this.canvasElement.height = this.video.videoHeight
          this.canvasElement.width = this.video.videoWidth
          this.canvas.drawImage(
            this.video,
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
          )

          const imageData = this.canvas.getImageData(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
          )
          try {
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            })

            if (code) {
              // 扫码成功
              this.$emit('result', code.data)

              if (this.autoStop) {
                this.closeScanner()
              }
            }
          } catch (e) {
            console.error('QR码识别错误:', e)
          }
        }
      }, 100)
    },
    /**
     * 完全停止扫描并释放摄像头资源
     * 清理所有相关资源和事件监听器
     * @returns {void}
     */
    stopScanning() {
      if (this.scanInterval) {
        clearInterval(this.scanInterval)
        this.scanInterval = null
      }

      this.removeVisibilityListener()

      if (this.stream) {
        const tracks = this.stream.getTracks()
        tracks.forEach((track) => {
          track.stop()
        })
        this.stream = null
      }

      if (this.video) {
        this.video.srcObject = null
      }

      this.isScanning = false
      this.flashOn = false
    },
    /**
     * 切换摄像头闪光灯的开关状态
     * @async
     * @returns {Promise<void>}
     */
    async toggleFlash() {
      if (!this.hasFlash || !this.stream) return

      const track = this.stream.getVideoTracks()[0]
      this.flashOn = !this.flashOn
      try {
        await track.applyConstraints({
          advanced: [{ torch: this.flashOn }]
        })
      } catch (e) {
        console.error('无法控制闪光灯:', e)
        this.flashOn = !this.flashOn // 恢复状态
      }
    },
    /**
     * 关闭扫码组件并触发相关事件
     * @returns {void}
     * @emits update:visible - 更新visible属性
     * @emits close - 扫码器关闭事件
     */
    closeScanner() {
      this.stopScanning()
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    /**
     * 触发文件选择对话框，打开相册
     * @returns {void}
     */
    openAlbum() {
      this.$refs.fileInput.click()
    },
    /**
     * 处理从相册选择的图片文件，尝试从中识别二维码
     * @param {Event} event - 文件选择事件对象
     * @returns {void}
     * @emits result - 识别到二维码时触发
     * @emits error - 图片中无有效二维码或处理出错时触发
     */
    processFile(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // 创建临时canvas解析图片中的二维码
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height)

          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            })

            if (code) {
              this.$emit('result', code.data)
              if (this.autoStop) {
                this.closeScanner()
              }
            } else {
              this.$emit('error', new Error('未检测到有效的二维码'))
            }
          } catch (error) {
            this.$emit('error', error)
          }
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)

      // 清空input，确保可以重复选择同一文件
      event.target.value = ''
    }
  },
  /**
   * Vue Router的导航守卫钩子，确保在路由离开时释放摄像头资源
   * @param {Object} to - 目标路由对象
   * @param {Object} from - 当前路由对象
   * @param {Function} next - 导航函数
   * @returns {void}
   */
  beforeRouteLeave(to, from, next) {
    // 处理路由离开的情况
    this.stopScanning()
    next()
  }
}
</script>

<style scoped>
.qr-scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #000;
  display: flex;
  flex-direction: column;
}

.qr-scanner-wrapper {
  flex: 1;
  position: relative;
}

.video-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scanner-header {
  padding: 16px;
  display: flex;
  align-items: center;
  color: #fff;
  height: 60px;
}

.close-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 24px;
  font-weight: bold;
}

.scanner-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  margin-right: 30px; /* 平衡close-button的宽度 */
}

.scanner-frame {
  position: relative;
  width: 70%;
  height: 70vw; /* 正方形 */
  max-height: 70%;
  max-width: 70vw;
  margin: auto;
  box-sizing: border-box;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #07c160;
  border-style: solid;
  border-width: 0;
}

.top-left {
  top: 0;
  left: 0;
  border-top-width: 3px;
  border-left-width: 3px;
}

.top-right {
  top: 0;
  right: 0;
  border-top-width: 3px;
  border-right-width: 3px;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom-width: 3px;
  border-left-width: 3px;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom-width: 3px;
  border-right-width: 3px;
}

.scan-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 2px;
  background-color: #07c160;
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

.scanner-tips {
  margin-top: 20px;
  color: #fff;
  text-align: center;
  font-size: 14px;
  padding: 20px;
}

.scanner-footer {
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-around;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.action-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.action-text {
  font-size: 12px;
}
</style>
