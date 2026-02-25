<!---
 * @Description: 移动端表单组件
 * @Date: 2025-07-04
 * @Author: HongYu
 * @LastEditors: HongYu
 * @LastEditTime: 2025-07-07 16:00:00
 * @FilePath: src/custom/common/components/mobile-form/index.vue
 -->
<template>
  <div class="tw-mb-2">
    <div
      v-for="(field, index) in computedFieldConfigs"
      :key="index"
      class="tw-mb-4 tw-flex"
      :class="{ 'tw-flex-row': layout === 'horizontal', 'tw-flex-col': layout === 'vertical' }"
    >
      <div class="tw-text-sm tw-text-gray-600 tw-mb-1">
        {{ field.label }}
        <span v-if="field.required" class="tw-text-red-500">*</span>
      </div>
      <div class="tw-flex-1">
        <slot
          :name="field.slotName"
          :field="field"
          :formData="formData"
          :errors="errors"
          :prop="field.prop"
          :value="formData[field.prop]"
        >
          <component
            :is="getComponent(field.type)"
            v-model="formData[field.prop]"
            :fieldConfig="field"
            :formData="formData"
            :errors="errors"
          ></component>
        </slot>
        <div v-if="errors[field.prop]" class="tw-text-red-500 tw-text-xs tw-mt-1">
          {{ errors[field.prop] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MobileFormInput from './components/input.vue'
import MobileFormSelect from './components/select.vue'
import MobileFormTextarea from './components/textarea.vue'
import MobileFormSwitch from './components/switch.vue'
import MobileFormDatePicker from './components/date-picker.vue'

import { validateForm } from './utils/validator'
import { FormFieldType } from './utils/constants'

export default {
  name: 'MobileForm',
  components: {
    MobileFormInput,
    MobileFormSelect,
    MobileFormTextarea,
    MobileFormSwitch
  },
  props: {
    /**
     * 表单字段配置
     * @type {Array}
     * @description 表单字段配置
     * @example
     * [
     *   {
     *     label: '物料图号',
     *     prop: 'itemFigureNumber1',
     *     type: 'input',
     *     required: true,
     *     options: [],
     *     attrs: {
     *       class: 'tw-w-full tw-h-10 tw-border tw-border-gray-300 tw-rounded-md tw-p-2'
     *     },
     *     events: {
     *       change: (value) => {
     *         console.log(value)
     *       }
     *     },
     *     extra: {
     *       formatter: (value, formData) => {
     *         // 表单值格式化
     *         return value.toUpperCase()
     *       },
     *       beforeSubmitFormatter: (value, formData) => {
     *         // 提交前格式化
     *         return value.toUpperCase()
     *       }
     *     }
     *   }
     * ]
     */
    fieldConfigs: {
      type: Array,
      default: () => []
    },
    /**
     * 表单数据
     * @type {Object}
     * @description 表单数据
     */
    formData: {
      type: Object,
      default: () => ({})
    },
    /**
     * 表单排版
     * @type {String}
     * @description 表单排版
     * @example
     * 'horizontal' | 'vertical'
     */
    layout: {
      type: String,
      default: 'vertical'
    },
    /**
     * 是否禁用
     * @type {Boolean}
     * @description 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errors: {}
    }
  },
  computed: {
    computedFieldConfigs() {
      return this.fieldConfigs.map((field) => ({
        ...field,
        attrs: {
          ...field.attrs,
          disabled: field?.disabled || this.disabled,
          placeholder: field.attrs?.placeholder || `请输入${field.label}`
        }
      }))
    }
  },
  methods: {
    getComponent(type) {
      switch (type) {
        case FormFieldType.Input:
          return MobileFormInput
        case FormFieldType.Select:
          return MobileFormSelect
        case FormFieldType.Textarea:
          return MobileFormTextarea
        case FormFieldType.Switch:
          return MobileFormSwitch
        case FormFieldType.DatePicker:
          return MobileFormDatePicker
        default:
          return null
      }
    },
    /**
     * 表单验证方法
     * @returns {Promise} 返回一个Promise，成功时表单数据有效，失败时返回错误信息
     */
    validate() {
      const { valid, errors } = validateForm(this.formData, this.computedFieldConfigs)
      this.errors = errors

      return new Promise((resolve, reject) => {
        if (valid) {
          const formData = {}
          // 提交前格式化
          for (const field of this.computedFieldConfigs) {
            if (field.extra?.beforeSubmitFormatter) {
              formData[field.prop] = field.extra.beforeSubmitFormatter(this.formData[field.prop])
            } else {
              formData[field.prop] = this.formData[field.prop]
            }
          }
          resolve(formData)
        } else {
          reject(errors)
        }
      })
    },
    /**
     * 重置表单
     */
    reset() {
      for (const field of this.computedFieldConfigs) {
        if (field.prop) {
          this.$set(this.formData, field.prop, undefined)
        }
      }
      this.errors = {}
    }
  }
}
</script>
