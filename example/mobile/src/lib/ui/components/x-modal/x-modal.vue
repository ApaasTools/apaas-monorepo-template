<template>
  <div :class="['x-modal', wrapperClass, {'fade-enter': visible}]" v-show="visible">
    <div class="x-modal-mask" @click="handleClickMask"></div>
    <div class="x-modal-main">
      <div class="x-modal-content">
        <template v-if="$slots.header">
          <slot></slot>
        </template>
        <div v-else class="x-modal-header">
          <span class="x-modal-header--title">{{ title }}</span>
        </div>
        <div class="x-modal-body">
          <slot></slot>
        </div>
        <div class="x-modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
      <div class="x-modal--close">
        <x-svg-icon name="x-lib-circle-close" @click.native="handleClose"></x-svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XModal',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    wrapperClass: {
      type: String,
      default: ''
    }
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
  },
  destroyed() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  methods: {
    handleClickMask() {
      if (this.maskClosable) {
        this.handleClose()
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.x-modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  &.fade-enter {
    animation: fadein .4s;
    .x-modal-main {
      animation: zoom .4s;
    }
  }
  .x-modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $--app-base-font-color;
    opacity: 0.3;
    z-index: -1;
  }
  .x-modal-main {
    flex: 1;
    margin: 0 1.14rem;
    .x-modal-content {
      padding: 0 1.14rem 1.14rem;
      background-color: $--app-box-bgColor;
      border-radius: $--app-base-border-radius;
      max-height: calc(100vh - 5rem);
      overflow-y: auto;
      overflow-x: hidden;
      .x-modal-header {
        padding: 1.14rem 0;
        .x-modal-header--title {
          font-size: $--app-title-font-size;
          font-weight: $--app-base-font-weight;
        } 
      }
    }
    .x-modal--close {
      margin-top: 1rem;
      text-align: center;
    }
  }
}
</style>