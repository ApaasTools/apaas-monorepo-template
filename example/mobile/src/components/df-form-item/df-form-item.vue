<template>
  <div class="df-form-item">
    <slot></slot>
    <div class="df-form-item--help">
      <span>{{ help }}</span>
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'DfFormItem',
  props: {
    prop: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      help: ''
    }
  },
  computed: {
    parentForm() {
      let parent = this.$parent
      while (parent && !['DfForm'].includes(parent.$options.componentName)) {
        parent = parent.$parent
      }
      return parent
    }
  },
  mounted() {
    this.parentForm.addFormItem(this)
    this.$once('hook:beforeDestroy', () => {
      this.parentForm.removeFormItem(this)
    })
  },
  methods: {
    setHelpText(help) {
      this.help = help
    }
  }
}
</script>

<style lang="scss">
.df-form-item {
  .df-form-item--help {
    padding-left: 2.71rem;
    height: 1.5rem;
    line-height: 1.5rem;
    color: $--app-danger-color;
    font-size: $--app-base-font-size;
  }
}
</style>
