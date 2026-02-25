<!--
 * @Description: 移动端弹出详情面板
 * @Date: 2025-07-01
 * @FilePath: src/custom/common/components/mobile-detail-popup/index.vue
-->
<template>
  <cube-popup
    v-model="popupVisible"
    position="bottom"
    :mask-closable="maskClosable"
    :zIndex="zIndex"
  >
    <div
      class="tw-bg-white tw-relative tw-min-h-[30vh] tw-max-h-screen tw-overflow-hidden tw-flex tw-flex-col"
      :class="contentClass"
    >
      <!-- 头部 -->
      <div
        class="tw-h-14 tw-shrink-0 tw-w-full tw-bg-white tw-sticky tw-top-0 tw-w-ful tw-flex tw-items-center tw-px-4 tw-border-b tw-border-solid tw-border-gray-300"
      >
        <div class="tw-w-14" @click="handleClose">
          <i v-if="showClose" class="cubeic-back tw-text-lg"></i>
        </div>
        <div class="tw-flex-1 tw-text-center tw-text-lg tw-font-bold">{{ title }}</div>
        <div class="tw-w-14">
          <slot name="headerRight"></slot>
        </div>
      </div>
      <div class="tw-overflow-auto tw-flex-1">
        <div class="custom-detail-content">
          <slot name="content"></slot>
        </div>
      </div>

      <!-- 底部按钮区域 -->
      <div
        v-if="showFooter"
        class="tw-bg-white tw-shrink-0 tw-h-20  tw-flex tw-items-center tw-justify-between tw-px-2"
      >
        <slot name="footer">
          <cube-button class="tw-h-12" :outline="true" @click="handleClose">
            取消
          </cube-button>
          <cube-button class="tw-h-12" :primary="true" @click="handleConfirm">
            确认
          </cube-button>
        </slot>
      </div>
    </div>
  </cube-popup>
</template>

<script>
import { Popup, Button } from 'cube-ui/lib'

export default {
  name: 'BottomPopup',
  components: {
    CubePopup: Popup,
    CubeButton: Button
  },
  inheritAttrs: true,
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '详情'
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 100
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    contentClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    popupVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleClose() {
      this.popupVisible = false
      this.$emit('close')
    },
    handleConfirm() {
      this.$emit('confirm')
      // this.popupVisible = false
    }
  }
}
</script>
