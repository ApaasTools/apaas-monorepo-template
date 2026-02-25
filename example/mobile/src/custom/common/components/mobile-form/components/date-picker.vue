<template>
  <div
    class="date-picker tw-w-full tw-h-12 tw-flex tw-items-center tw-px-3 tw-leading-10 tw-overflow-hidden tw-border tw-border-solid tw-border-gray-300 tw-rounded-md"
    :class="{
      'tw-bg-gray-100': fieldConfig?.disabled,
      'tw-border-red-500': errors[fieldConfig.prop]
    }"
    @click="showDatePicker"
  >
    <div v-if="formValue" class="tw-flex-1 tw-truncate">{{ formValue }}</div>
    <div v-else class="tw-flex-1 tw-truncate tw-text-gray-400">
      {{ fieldConfig?.attrs?.placeholder }}
    </div>
    <i v-if="formValue" class="cubeic-wrong tw-text-lg" @click.stop="clearValue"></i>
    <i v-else class="cubeic-arrow tw-text-gray-400"></i>
  </div>
</template>

<script>
import { formMixin } from '../utils/form.mixin'

export default {
  name: 'MobileFormDatePicker',
  mixins: [formMixin],
  methods: {
    showDatePicker() {
      if (this.fieldConfig?.disabled) return

      const options = {
        title: this.fieldConfig.label || '选择日期',
        min: new Date(1900, 1, 1),
        max: new Date(),
        value: this.formValue ? new Date(this.modelValue) : new Date(),
        format: {
          year: 'YYYY年',
          month: 'MM月',
          date: 'DD日'
        },
        // 额外配置
        ...this.fieldConfig?.extra?.datePickerOptions
      }

      this.datePicker = this.$createDatePicker({
        ...options,
        onSelect: this.handleSelect,
        onCancel: this.handleCancel
      })

      this.datePicker.show()
    },
    handleSelect(date, selectedVal, selectedText) {
      let formattedDate = ''
      if (this.fieldConfig?.extra?.datePickerOptions?.onSelect) {
        formattedDate = this.fieldConfig.extra.datePickerOptions.onSelect(
          date,
          selectedVal,
          selectedText
        )
      } else {
        // 格式化日期为 YYYY-MM-DD 默认格式
        const year = selectedVal[0]
        const month = selectedVal[1].toString().padStart(2, '0')
        const day = selectedVal[2].toString().padStart(2, '0')
        formattedDate = `${year}-${month}-${day}`
      }
      this.formValue = formattedDate
      this.datePicker.hide()
    },
    handleCancel() {
      this.datePicker.hide()
    },
    clearValue(e) {
      e.stopPropagation()
      this.formValue = ''
    }
  }
}
</script>
