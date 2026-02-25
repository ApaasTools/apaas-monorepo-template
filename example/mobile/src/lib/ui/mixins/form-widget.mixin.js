import WidgetRequiredValidator from '../form-validator/widget-required-validator'
import debounce from 'lodash-es/debounce'
/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */

function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(function(key) {
      return { key: key, val: key }
    })
    : Object.keys(map).map(function(key) {
      return { key: key, val: map[key] }
    })
}
const FormWidgetConfigMixin = {
  data() {
    return {
      tabindex: '1',
      componentData: null,
      widgetRules: null,
      valueChanged: false,
      validateDebounce: debounce((value) => {
        this.validate(value)
      }, 500)
    }
  },
  props: {
    widget: {
      required: true
    },
    renderScene: {
      type: String,
      required: true,
      validator: function(value) {
        const values = ['ide', 'edit', 'read']
        // 这个值必须匹配下列字符串中的一个
        return values.includes(value)
      }
    },

    propKey: {
      type: String,
      default: ''
    },

    validateKey: {
      type: String,
      default: ''
    },
    validateInfo: {
      type: Object
    },
    formData: {
      type: Object
    },
    globalFormData: {
      type: Object
    },
    globalData: {
      type: Object
    },
    formItemList: {
      type: Array,
      default: function() {
        return []
      }
    },
    formConfigList: {
      type: Array
    },
    valueValidatedStatus: {
      type: Boolean
    },
    formRuleConfig: {
      type: Object
    },
    valueValidatedStatus: {
      type: Boolean,
      default: true
    }
  },
  inject: ['renderGlobal'],
  computed: {
    formValue: {
      get() {
        // 回调函数 当需要读取当前属性值是执行，根据相关数据计算并返回当前属性的值
        if (this.valueValidatedStatus) {
          return this.propKey ? this.formData[this.propKey] : ''
        } else {
          return undefined
        }
      },
      set(value) {
        this.formData[this.propKey] = value
        this.$set(this.formData, this.propKey, value)
        this.$emit('update:formData', { ...this.formData }, this.propKey)
        this.$formEventEmit('change', value)
        this.validateDebounce(value)
      }
    },
    formEngine() {
      return this.renderGlobal.formEngine
    },
    validatorRules() {
      let rules = []
      if (this.renderScene === 'edit') {
        if (this.showRequired) {
          if (this._validate) {
            rules.push(this._validate('required', `${this.widget.label} 是必填字段`))
          }
        }

        if (this.widgetRules) {
          rules = [...rules, ...this.widgetRules]
        }
      }
      return rules
    },
    showRequired() {
      // return this.widget.required && !this.widget.readOnly && !this.widget.hidden
      // debugger
      return this.widget.required
    },
    disabled() {
      return (
        this.renderScene === 'read' ||
        (this.widget && (this.widget.enableRule || this.widget.readOnly))
      )
    },
    placeholder() {
      return this.widget.enableRule
        ? '自动生成'
        : this.widget.readOnly
          ? ''
          : this.widget.placeholder
    }
  },

  watch: {
    formValue: {
      handler: function (newVal, oldVal) {
        /**
         * @author Dreamfish
         * @desc formData(浅拷贝) -> formValue(重新取formData的propKey)为引用值 -> 不会比较引用 （defineProtery无法捕获） -> newVal和oldVal完全相同
         */
        if (newVal !== oldVal && !this.widget.readOnly) {
          this.validate(newVal)
        }
      }
    }
  },

  methods: {
    _validate(type, message, trigger = ['blur', 'change'], isI18n = false) {
      // 生成验证器
      const validator = {
        trigger: trigger
      }
      if (typeof type === 'string') {
        validator.type = type
        if (type === 'required') {
          validator.validator = WidgetRequiredValidator(isI18n ? this.$t(message) : message)
        }
        validator.message = isI18n ? this.$t(message) : message
      } else if (typeof type === 'function') {
        validator.validator = type
      }

      return validator
    },
    updatePropValue(key, value) {
      this.formData[key] = value
      this.$set(this.formData, key, value)
      this.$emit('update:formData', { ...this.formData }, this.key)
    },
    mapAdapter(...args) {
      return this.$formBuildEngine.mapAdapter(args)
    },
    mapEvent(...args) {
      return this.$formBuildEngine.mapEvent(args)
    },
    $formEventEmit(eventName, event) {
      this.$emit(eventName, event)
      this.$emit('formEventEmit', {
        eventName: eventName,
        propKey: this.propKey,
        event: event,
        widget: this.widget
      })
    },
    validate(value) {
      if (!this.validatorRules || this.validatorRules.length === 0) {
        const validateInfo = { ...this.validateInfo, validate: 'validate' }
        this.$emit('validate-changed', validateInfo)
        return;
      }
      let flag = false
      for (const rule of this.validatorRules) {
        if (flag) {
          break
        }
        rule.validator(rule, value || this.formValue, (e) => {
          if (e) {
            flag = true
            const validateInfo = { ...this.validateInfo, validate: 'error', msg: e.message }
            this.$emit('validate-changed', validateInfo)
          } else {
            const validateInfo = { ...this.validateInfo, validate: 'validate' }
            this.$emit('validate-changed', validateInfo)
          }
        })
      }
    }
  }
}

export default FormWidgetConfigMixin
