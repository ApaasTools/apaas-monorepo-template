<!--
 * @Author: your name
 * @Date: 2020-07-25 18:02:32
 * @LastEditTime: 2020-08-11 15:37:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/lib/ui/components/x-proxy-form-item/x-proxy-form-item.vue
-->
<template>
  <div class="x-proxy-form-item" :class="{ 'disabled': disabled }">
    <label class="x-proxy-form-item-label">
      <div class="required" v-show="showRequired"></div>
      {{ label }}
      <slot name="label"></slot>
    </label>
    <div class="x-proxy-form-item-content">
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </div>
    <div v-if="validateInfo && validateInfo.validate === 'error'" class="x-proxy-form-item-validate-msg is-error">
      <span>{{ validateMsg }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XProxyFormItem',
  props: {
    showRequired: {
      type: Boolean
    },
    validatorRules: {
      type: Array
    },
    validateKey: {
      type: String
    },
    label: {
      type: String
    },
    processTitle: {
      type: Boolean
    },
    validateInfo: {
      type: Object
    },
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {
    validateMsg() {
      if (this.validateInfo) {
        if (this.validateInfo.validate === 'error') {
          this.message = this.validateInfo.msg
          return this.validateInfo.msg
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    getBuildFormItem() {
      return this.$refs.buildFormItem
    }
  }
}
</script>

<style lang="scss">
.x-proxy-form-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 4.29rem;
  padding: 1rem 1.14rem;
  padding-bottom: 0;
  box-sizing: border-box;
  border-bottom: 1PX solid $--app-form-item-border-color;
  background-color: $--app-light-color;
  position: relative;
  .x-proxy-form-item-label {
    font-weight: $--app-base-font-weight;
    z-index: 1;
    .required {
      &::before {
        position: absolute;
        left: 0;
        width: 1.07rem;
        content: "*";
        color: #FF3824;
        font-size: 1.4rem;
        text-align: center;
      }
    }
  }
  .x-proxy-form-item-content {
    margin: 9PX 0;
    flex: 1;
    min-height: 1.714rem;
    display: flex;
    align-items: center;
    .content-wrapper {
      flex: 1;
      width: 100%;
    }
  }

  .x-proxy-form-item-validate-msg {
    width: 100%;
    line-height: 1.71rem;
    padding: 0 1.14rem;
    height: 1.71rem;
    background-color: #FFECEC;
    margin-left: -1.14rem;
    z-index: 1;
    span {
      color: #F56C6C;
      font-size: 0.86rem;
    }
  }

  .cube-input::after {
    border: 0;
  }
  .cube-input {
    font-size: 0;
  }
  .cube-input-field {
    padding: 0;
    font-size: $--app-title-font-size;
    min-height: $--app-title-font-size;
  }

  &.disabled {
    background-color: #FFFFFF;
    .x-proxy-form-item-label {
      color: #B2B2B2;
    }
    .x-proxy-form-item-content {
      color: #B2B2B2;
      textarea:disabled {
        opacity: 1 !important;
      }
      input:disabled {
        opacity: 1 !important;
      }
    }
    .cube-input {
      background-color: #FFFFFF;
      color: #B2B2B2;
      .cube-input-field {
        color: #B2B2B2;
      }
    }
    .cube-textarea {
      color: #B2B2B2;
    }
  }
}
</style>
