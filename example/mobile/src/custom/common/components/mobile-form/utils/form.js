import { FormFieldType } from './constants'
import FormComponent from '../index.vue'
import Vue from 'vue'

export class FormField {
  /**
   * 其他配置
   * @type {Object}
   */
  #options = {}

  /**
   * 表单字段配置
   * @type {Array}
   */
  #fieldConfigs = []

  /**
   * 表单实例
   * @type {Vue}
   */
  #vm = null

  /**
   * 表单元素
   * @type {HTMLElement}
   */
  #el = null

  /**
   * 初始化表单
   * @param {Element | string} el 表单元素或选择器
   * @param {Object} options 表单配置
   */
  constructor(el, options) {
    if (!el) throw new Error('el is required')

    if (!this._validateFieldConfig(options.fieldConfigs)) {
      throw new Error('fieldConfig is not correct')
    }

    if (typeof el === 'string') el = document.querySelector(el)

    this.#el = el
    this.#fieldConfigs = options.fieldConfigs
    this.#options = options

    this._init()
  }

  _init() {
    this.#fieldConfigs.forEach((field) => {
      this._initField(field)
    })

    if (this.#options?.initFormData) {
      this.#options.formData = {
        ...this.#options?.formData,
        ...this.#options?.initFormData?.(this.#fieldConfigs, this.#options)
      }
    }

    const vm = new Vue({
      el: this.#el,
      render: (h) =>
        h(FormComponent, {
          props: {
            ...this.#options
          }
        })
    }).$mount()

    this.#vm = vm
  }

  _validateFieldConfig(fieldConfig) {
    if (!fieldConfig) {
      throw new Error('fieldConfig is required')
    }

    if (!Array.isArray(fieldConfig)) {
      throw new Error('fieldConfig must be an array')
    }

    let isValidSuccess = true

    fieldConfig.forEach((field) => {
      if (!this._validateField(field)) {
        isValidSuccess = false
      }
    })

    if (!isValidSuccess) {
      throw new Error('fieldConfig is not correct')
    }

    return isValidSuccess
  }

  _validateField(field) {
    // 1、判断必填项是否存在
    if (['label', 'prop', 'type'].some((key) => !field[key])) {
      return false
    }

    // 2、判断 type 是否为 FormFieldType 中的一个
    if (!Object.values(FormFieldType).includes(field.type)) {
      return false
    }

    // 3、判断 select 类型是否存在 options
    if ([FormFieldType.Select, FormFieldType.SelectPopup].includes(field.type)) {
      if (!field.options) {
        return false
      }
    }

    return true
  }
}
