<template>
  <div
    class=" tw-py-2 tw-px-3 tw-rounded"
    :class="{ 'tw-border tw-border-solid tw-border-gray-200': isEdit }"
  >
    <div v-if="isEdit">
      <input
        v-model.trim="value"
        placeholder="请输入内容"
        :disabled="column.disabled || tableDisabled"
        class="focus-visible:tw-border-none tw-w-full tw-border-none tw-outline-none"
        type="number"
        @blur="inputChange"
      />
    </div>
    <div v-else class="tw-truncate">{{ row[column.prop] }}</div>
  </div>
</template>

<script>
import { Input } from 'cube-ui/lib'

export default {
  name: 'BaseInputNumber',
  components: {
    CubeInput: Input
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    column: {
      type: Object,
      default: () => {}
    },
    tableDisabled: {
      type: Boolean,
      default: false
    },
    uuidObj: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isEdit() {
      return this.row[this.uuidObj.fill] !== 'N' && !this.column.readOnly
    }
  },
  methods: {
    inputChange(event) {
      let value = Number(event.target.value)
      const min = Number(this.row[this.uuidObj.min_scoring])
      const max = Number(this.row[this.uuidObj.max_scoring])

      if (isNaN(value)) return
      if (value < min) value = min
      if (value > max) value = max

      this.$emit('input', value)
      this.$listeners?.inputChange(value, this.row, this.column)
      this.$emit('change', value)
    }
  }
}
</script>
