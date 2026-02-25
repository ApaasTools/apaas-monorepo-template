<template>
  <input-text
    class="input-code"
    :icon-name="iconName"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:append>
      <div class="input-code-suffix">
        <span
          v-if="!count"
          :class="{
            'input-code-btn': true,
            'is-disabled': disabled
          }"
          @click="handleClick"
        >{{ btntext }}</span>
        <span v-else class="input-code-count">{{ count + 's' }}</span>
      </div>
    </template>
  </input-text>
</template>

<script>
import InputText from '@/components/input-text/input-text'

export default {
  name: 'InputCode',
  components: {
    InputText
  },
  inheritAttrs: false,
  props: {
    iconName: {
      type: String,
      default: 'envelope'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      count: 0,
      timer: null
    }
  },
  computed: {
    btntext() {
      return this.loading ? '获取中...' : '获取验证码'
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    handleClick() {
      this.loading = true
      this.$emit('verify-success', (isNeedTimer) => {
        this.loading = false
        if (typeof isNeedTimer === 'undefined' || isNeedTimer) {
          this.initTimer()
        }
      })
    },
    initTimer() {
      this.count = 60
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.count--
        if (this.count === 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.input-code {
  .input-code-suffix {
    //width: 5rem;
    text-align: center;
    .input-code-btn {
      font-size: $--app-title-font-size;
      color: $--app-primary-color;
      cursor: pointer;
      &.is-disabled {
        color: $--app-notice-color;
        cursor: not-allowed;
      }
    }
    .input-code-count {
      font-size: $--app-title-font-size;
      color: $--app-notice-color;
    }
  }
}
</style>
