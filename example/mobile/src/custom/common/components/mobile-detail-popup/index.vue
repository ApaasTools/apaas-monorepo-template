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
    class="custom-detail-popup"
    :class="customClass"
  >
    <div class="custom-detail-header">
      <div class="back-icon" @click="handleClose">
        <i class="cubeic-back"></i>
      </div>
      <div class="custom-detail-title">
        {{ title }}
      </div>
      <div v-if="$slots.headerRight" class="header-right">
        <slot name="headerRight"></slot>
      </div>
    </div>

    <div class="custom-detail-content">
      <div v-if="loading" class="custom-detail-loading">
        <cube-loading></cube-loading>
        <p class="custom-loading-text">
          {{ loadingText }}
        </p>
      </div>
      <slot v-else></slot>
    </div>

    <!-- 底部按钮区域 -->
    <div v-if="showFooter" class="custom-detail-footer">
      <cube-button :outline="true" class="cancel-btn" @click="handleClose">
        取消
      </cube-button>
      <cube-button :primary="true" class="confirm-btn" @click="handleConfirm">
        {{ okBtnText }}
      </cube-button>
    </div>
  </cube-popup>
</template>

<script>
import { Popup, Loading, Button } from 'cube-ui/lib'

export default {
  name: 'MobileDetailPopup',
  components: {
    CubePopup: Popup,
    CubeLoading: Loading,
    CubeButton: Button
  },
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
      default: false
    },
    zIndex: {
      type: Number,
      default: 100
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    customClass: {
      type: String,
      default: ''
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    okBtnText: {
      type: String,
      default: '确认'
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
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-detail-popup {
  background: #fff !important;
  height: 100%;
  overflow: hidden !important;
  border-radius: 0 !important;

  ::v-deep(.cube-popup-mask) {
    background-color: transparent !important;
  }

  .custom-detail-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
    position: relative;
    background-color: #fff;

    .back-icon {
      position: absolute;
      left: 15px;
      color: #666;
    }

    .header-right {
      position: absolute;
      right: 15px;
    }

    .custom-detail-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      text-align: center;
    }
  }

  .custom-detail-content {
    height: calc(100vh - 60px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    padding-bottom: 20px;
    // margin-bottom: 70px; /* 为底部按钮区域留出空间 */

    .custom-detail-loading {
      padding: 40px 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .custom-loading-text {
        margin-top: 10px;
        color: #999;
      }
    }
  }

  .custom-detail-footer {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 10;

    .cancel-btn,
    .confirm-btn {
      width: 48%;
      height: 40px;
      border-radius: 20px;
    }
  }
}
</style>
