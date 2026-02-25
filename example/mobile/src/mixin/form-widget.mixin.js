/* eslint-disable indent */
import WidgetRequiredValidator from '@/validator/widget-required-validator'
import debounce from 'lodash-es/debounce'

const FormWidgetConfigMixin = {
  data() {
    return {
      tabindex: '0',
      componentData: null,
      widgetRules: null,
      valueChanged: false,
      validateDebounce: debounce((value) => {
        this.validate(value)
      }, 500),
      bsUnwatch: null,
      bsRefreshDebounce: debounce((newValue, oldValue) => {
        if (newValue !== oldValue) {
          // 调用触发业务事件
          console.log('调用值改变触发业务事件')
          let event
          // 在表格里
          if (this.widget.isInTable) {
            const key = this.$route.query.key
            event = {
              currentRowTableUuid: key.split('.')[0],
              currentRowIndex: parseInt(key.split('.')[1]),
              tableFormEngine: this.formEngine,
              vm: this
            }
            try {
              this.sourceFormEngine.bsEventControl.triggerEventValueChange(this.widget, event)
            } catch (error) {
              console.error(error)
            }
          } else {
            try {
              this.formEngine.bsEventControl.triggerEventValueChange(this.widget, {
                vm: this
              })
            } catch (error) {
              console.error(error)
            }
          }
        }
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

    valueValidatedStatus: {
      type: Boolean,
      default: true
    },
    sourceFormEngine: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  inject: ['renderGlobal'],
  computed: {
    formValue: {
      get() {
        // 回调函数 当需要读取当前属性值是执行，根据相关数据计算并返回当前属性的值
        this.valueChanged = false
        if (this.valueValidatedStatus) {
          return this.propKey ? this.formData[this.propKey] : undefined
        } else {
          return undefined
        }
      },
      set(value) {
        if (this.formData[this.propKey] !== value) {
          // 避免tab切换引起的校验
          this.valueChanged = true
          // this.formData[this.propKey] = value
          this.$set(this.formData, this.propKey, value)
          // this.$emit('validate:propKey', this.propKey)
          // this.formEngine.formDataControl.updateFormValue({ ...this.formData })
          // this.$emit('update:formData', { ...this.formData }, this.propKey)
          this.$formEventEmit('change', value)
          // 校验
          this.validateDebounce(value)
        }
      }
    },
    formEngine() {
      return this.renderGlobal
    },
    validatorRules() {
      let rules = []
      if (this.renderScene === 'edit') {
        if (this.showRequired) {
          if (this._validate) {
            rules.push(this._validate('required', `${this.widget && this.widget.label}是必填字段`))
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
      return this.widget && this.widget.required
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
    },
    formEngineContext() {
      return (this.formEngine && this.formEngine.engineContext) || {}
    }
  },
  created() {
    if (!this.widget.extendTempObj) {
      this.$set(this.widget, 'extendTempObj', {})
    }
  },
  mounted() {
    // mixin的beforeCreate > 父beforeCreate > mixin的created > 父created > mixin的beforeMount > 父beforeMount > 子beforeCreate > 子created > 子beforeMount > 子mounted > mixin的mounted >父mounted
    // 刷新表格
    if (this.renderScene === 'edit' || this.renderScene === 'read') {
      setTimeout(() => {
        this.addBsUnwatch()
      }, 1000)
    }
  },
  destroyed() {
    if (this.bsUnwatch) {
      this.bsUnwatch()
    }
  },

  methods: {
    addBsUnwatch() {
      this.bsUnwatch = this.$watch(
        function() {
          const assoValue = this.formValue
          let jsonObject = ''
          try {
            jsonObject = JSON.stringify(assoValue)
          } catch (error) {
            jsonObject = assoValue
          }
          return jsonObject
        },
        (newValue, oldValue) => {
          if (newValue !== oldValue) {
            this.bsRefreshDebounce(newValue, oldValue)
          }
        }
      )
    },
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
      // this.formEngine.formDataControl.updateFormValue({ ...this.formData })
      // this.$emit('update:formData', { ...this.formData }, this.key)
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
        this.$set(this.widget.extendTempObj, 'validateInfo', validateInfo)
        this.$emit('validateChanged', validateInfo)
        return
      }
      let flag = false
      for (const rule of this.validatorRules) {
        if (flag) {
          break
        }
        rule.validator(rule, value || this.formValue, (e) => {
          if (e) {
            flag = true
            const validateInfo = {
              ...this.validateInfo,
              validate: 'error',
              msg: e.message,
              uuid: this.propKey
            }
            this.$set(this.widget.extendTempObj, 'validateInfo', validateInfo)
            this.$emit('validateChanged', validateInfo)
          } else {
            const validateInfo = { ...this.validateInfo, validate: 'validate', uuid: this.propKey }
            this.$set(this.widget.extendTempObj, 'validateInfo', validateInfo)
            this.$emit('validateChanged', validateInfo)
          }
        })
      }
    },
    // 显示字段获取uuid
    getUid(code) {
      const arr = this.formItemList.filter((i) => i.modelField && i.modelField === code)
      if (arr.length === 1) {
        return arr[0].uuid
      }
    },
    // 全部(显示/隐藏)字段获取配置
    getHideConfig(code) {
      const arr = this.formEngine.formDataControl.allTileFormItemList.filter(
        (i) => i.modelField && i.modelField.includes(code)
      )
      if (arr.length === 1) {
        return arr[0]
      } else {
        let obj = arr.find((i) => i.modelField === code)
        return obj
      }
    },
    // 全部(显示/隐藏)字段获取uuid
    getHideUid(code) {
      const arr = this.formEngine.formDataControl.allTileFormItemList.filter(
        (i) => i.modelField && i.modelField.includes(code)
      )
      if (arr.length === 1) {
        return arr[0]?.uuid
      } else {
        let obj = arr.find((i) => i.modelField === code)
        return obj?.uuid
      }
    },
    // 获取表格的uuid
    getTableUuid(code) {
      const arr = this.formEngine.formDataControl.allTileFormItemList.filter(
        (item) => item.tableModelCode && item.tableModelCode === code
      )
      if (arr.length === 1) {
        return arr[0].uuid
      }
    },
    // 获取表格表头的uuid
    getTableColumnUuid(tableCode, code) {
      const arr = this.formEngine.formDataControl.allTileFormItemList.filter(
        (item) => item.tableModelCode && item.tableModelCode === tableCode
      )
      const obj = arr[0].tableColumn.find((i) => i.modelField.includes(code))
      return obj.uuid
    },
    // 通过表名加对应的字段名获取对应formData的具体数据
    getformData(code) {
      const arr = this.formEngine.formDataControl.allTileFormItemList.filter(
        (i) => i.modelField && i.modelField.includes(code)
      )
      if (arr.length === 1) {
        return this.formData[arr[0].uuid]
      }
      return null
    }
  }
}

export default FormWidgetConfigMixin
