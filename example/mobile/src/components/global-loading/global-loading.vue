<template>
  <div v-show="displayVisable" class="global-loading">
    <div class="global-loading-main">
      <img src="@/assets/img/loading.gif" alt="" srcset="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalLoading',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    delayTime: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      displayVisable: this.visible,
      timer: -1
    }
  },
  watch: {
    visible: {
      handler: function (newVal, oldVal) {
        // TODO 处理串行接口请求问题，暂未处理并发接口的情况
        if (newVal && this.timer === -1) {
          this.timestamp = new Date().getTime()
          this.displayVisable = true
          console.log('loading开始', this.timestamp)
        } else if (newVal && this.timer !== -1) {
          clearTimeout(this.timer)
          console.log('清除延时计时器', this.timer)
        } else {
          const endTimestamp = new Date().getTime()
          const temp = endTimestamp - this.timestamp
          if (temp >= this.delayTime) {
            console.log('loading结束，用时', temp)
            this.timer = -1
            this.displayVisable = false
          } else {
            this.timer = setTimeout(() => {
              this.displayVisable = false
              this.$forceUpdate()
              this.timer = -1
              console.log('延时结束，loading结束')
            }, this.delayTime - temp)
            console.log('开始延时, 延时时间', this.delayTime - temp)
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.global-loading {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, .8);
  .global-loading-main {
    // width: 3.57rem;
    // height: 3.57rem;
    text-align: center;
    position: absolute;
    top: 24%;
    > img {
      width: 50%;
    }
    .x-svg-icon, .svg-icon {
      width: 100% !important;
      height: 100% !important;
      animation: rotate 1s linear infinite;
      transform-origin: center center;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
