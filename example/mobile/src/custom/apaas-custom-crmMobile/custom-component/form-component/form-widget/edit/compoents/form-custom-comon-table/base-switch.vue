<template>
  <div class="tw-w-full tw-items-center tw-px-3 te-text-sm">
    <el-switch
      v-model="row[column.prop]"
      active-value="TRUE"
      inactive-value="FALSE"
      :disabled="tableDisabled || column.disabled"
      @change="onChange"
    ></el-switch>
  </div>
</template>

<script>
export default {
  name: 'BaseSwitch',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    column: {
      type: Object,
      default: () => {}
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    tableDisabled: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    onChange(value, oldValue) {
      this.$emit('switchChange', value, oldValue)
      this.$emit('change', value)
    }
  }
}
</script>
