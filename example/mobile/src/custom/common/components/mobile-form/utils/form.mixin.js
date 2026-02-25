export const formMixin = {
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object],
      default: null
    },
    fieldConfig: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    disabled() {
      const fn = this.fieldConfig?.extra?.disabled
      return fn ? fn(this.formData) : this.fieldConfig?.disabled
    },
    formValue: {
      get() {
        if (this.fieldConfig.extra?.formatter) {
          return this.fieldConfig.extra.formatter(this.formData)
        }
        return this.value
      },
      set(newVal) {
        this.$set(this.errors, this.fieldConfig.prop, '')
        this.$set(this.formData, this.fieldConfig.prop, newVal)
      }
    }
  }
}
