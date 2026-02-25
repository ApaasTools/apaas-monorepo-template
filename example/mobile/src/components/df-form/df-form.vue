<template>
  <div class="df-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'DfForm',
  props: {
    model: {
      type: Object,
      default() {
        return {}
      }
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formItems: {},
      watchs: {}
    }
  },
  methods: {
    addFormItem(item) {
      this.watchs[item.prop] = this.$watch(`model.${item.prop}`, function(newVal, oldVal) {
        this.validateField(item.prop)
      })
      this.$set(this.formItems, item.prop, item)
    },
    removeFormItem(item) {
      let unwatch = this.watchs[item.prop]
      unwatch()
      delete this.formItems[item.prop]
    },
    requiredValidator(value) {
      if (value === undefined || value === null) {
        return false
      }
      if (Array.isArray(value) && !value.length) {
        return false
      }
      if (typeof value === 'string' && !value) {
        return false
      }
      if (typeof value === 'object' && JSON.stringify(value) === '{}') {
        return false
      }
      return true
    },
    validateField(prop) {
      let valids = {}
      let rules = this.rules[prop]
      let errMsg = ''
      if (rules instanceof Array) {
        for (let rule of rules) {
          if (rule.type === 'required') {
            valids[rule.type] = this.requiredValidator(this.model[prop])
          } else if (typeof rule.validator === 'function') {
            valids[rule.type] = rule.validator(rule, this.model[prop])
          }
          if (!valids[rule.type]) {
            errMsg = rule.help
            this.formItems[prop].setHelpText(errMsg)
            break
          } else {
            this.formItems[prop].setHelpText()
          }
        }
      }
      const isRight = Object.keys(valids).every(key => valids[key])
      this.$emit('validate', prop, isRight, errMsg)
      return isRight
    },
    validate(callback) {
      let valids = {}
      for (let prop in this.rules) {
        valids[prop] = this.validateField(prop)
      }
      callback && callback(Object.keys(valids).every(key => valids[key]))
    }
  }
}
</script>

<style>

</style>
