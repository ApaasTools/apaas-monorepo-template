<template>
  <div
    class="tw-border-b tw-border-solid tw-border-gray-200 tw-py-2 tw-px-3"
    @click="showDatePicker"
  >
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'BaseDate',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    column: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      datePicker: null
    }
  },
  methods: {
    showDatePicker() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: this.column.label ?? '请选择日期',
          min: new Date(1990, 1, 1),
          value: new Date(),
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        })
      }

      this.datePicker.show()
    },
    selectHandle(date, selectedVal, selectedText) {
      const { formatStr = 'YY-MM-DD:HH:mm:ss' } = this.column
      const val = this.$dayjs(date).format(formatStr)
      this.$emit('input', val)
      this.$emit('change', val)
    },
    cancelHandle() {}
  }
}
</script>
