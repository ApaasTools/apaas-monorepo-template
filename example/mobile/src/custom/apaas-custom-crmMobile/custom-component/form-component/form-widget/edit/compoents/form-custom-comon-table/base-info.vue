<template>
  <div class="tw-w-full tw-items-center tw-px-3 te-text-sm">
    {{ value || (column.prop === 'index' ? rowIndex + 1 : '') }}-1
  </div>
</template>

<script>
export default {
  name: 'BaseInfo',
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
    }
  }
}
</script>
