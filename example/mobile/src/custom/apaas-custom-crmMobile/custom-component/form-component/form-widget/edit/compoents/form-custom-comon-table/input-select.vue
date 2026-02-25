<template>
  <div class="tw-w-full">
    <div
      v-if="selectShow && row[uuidObj.project] !== '总分' && !column.readOnly"
      class="tw-py-2 tw-px-3 tw-min-h-[30px] tw-rounded tw-bg-white"
      :class="{ 'tw-border tw-border-solid tw-border-gray-200': isEdit }"
      @click="isEdit && createPicker()"
    >
      <span v-if="![null, undefined, ''].includes(value)">{{ value }}</span>
      <span v-else class="tw-text-gray-400">请打分</span>
    </div>
    <div v-else class="tw-py-2 tw-px-3">{{ row[column.prop] }}</div>
  </div>
</template>

<script>
export default {
  name: 'InputSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    column: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    },
    renderScene: {
      type: String,
      default: 'read'
    },
    uuidObj: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    },
    tableDisabled: {
      type: Boolean,
      default: false
    },
    selectShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      picker: null
    }
  },
  computed: {
    isEdit() {
      return this.selectShow && this.row[this.uuidObj.project] !== '总分' && !this.column.readOnly
    }
  },
  methods: {
    createPicker() {
      const column = this.options.map((v) => ({ text: v, value: v }))
      if (!this.picker) {
        this.picker = this.$createPicker({
          title: this.column.label ?? '请选择',
          data: [column],
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        })
      }
      this.picker.show()
    },
    selectHandle(selectData) {
      this.$emit('input', selectData[0])
      // this.$emit('select-change', selectData[0], this.row, this.column)
      this.$listeners?.selectChange(selectData[0], this.row, this.column)
      this.$emit('change', selectData[0])
    },
    cancelHandle() {}
  }
}
</script>
