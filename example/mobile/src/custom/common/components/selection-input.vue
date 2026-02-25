<!--
 * @Description: junfa
 * @Author: junfa
 * @Date: 2024-07-02 16:22:46
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmCustomPage\custom-page\components\selectDictionary.vue
 * @LastEditors: junfa
 * @LastEditTime: 2025-02-11 11:44:13
-->
<template>
  <div
    class="selection-input tw-border tw-border-solid tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-bg-white"
    :class="{ 'tw-bg-gray-100': disabled }"
    @click="showPicker"
  >
    <div v-if="displayValue" class="tw-text-gray-900">{{ displayValue }}</div>
    <div v-else class="tw-text-gray-400">{{ placeholder }}</div>
    <i
      v-if="clearable && innerValue && !disabled"
      class="cubeic-wrong tw-float-right tw-text-gray-400"
      @click.stop="clearValue"
    ></i>
    <i v-else class="cubeic-arrow tw-float-right tw-text-gray-400"></i>
  </div>
</template>

<script>
import api from '@/api/index'
import { getJsonParse } from '@/util/apaas.js'

export default {
  name: 'SelectDictionary',
  components: {},
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: null, // 选择组件的值
    // 获取下拉数据的节点，created：组件一创建就开始获取，visibleChange：点击下拉开始获取
    getDataMode: {
      type: String,
      default: 'created'
    },
    // 数据字典编码
    dictionaryCode: {
      type: String,
      default: 'CRM_FND_YES_NO'
    },
    optionsType: {
      type: String,
      default: 'system'
    },
    conditionOption: {
      type: String,
      default: 'EQ'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    filterable: {
      type: Boolean,
      default: true
    },
    customParams: {
      type: Object,
      default: () => {}
    },
    valueFormat: {
      type: Object,
      default: () => ({
        label: 'valueName',
        value: 'valueCode'
      })
    },
    getDataFun: {
      type: Function
    },
    compConfig: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerOptions: [],
      picker: null
    }
  },
  computed: {
    innerValue: {
      get() {
        // console.log('getOptionsData', this.$props)
        if (!this.multiple && this.compConfig.confirmFormat && this.value) {
          return getJsonParse(this.value)[0]
        }
        return this.value
      },
      set(val) {
        // console.log('set getOptionsData', this.multiple, this.compConfig, this.value, val)
        if (this.compConfig.confirmFormat && val) {
          this.$emit('update', this.compConfig.confirmFormat(val))
        } else {
          this.$emit('update', val)
        }
      }
    },
    // 合并外部传入的options和内部获取的options
    finalOptions() {
      return this.options.length > 0 ? this.options : this.innerOptions
    },
    // 显示值
    displayValue() {
      if (!this.innerValue) return ''
      if (this.multiple && Array.isArray(this.innerValue)) {
        return this.innerValue
          .map((val) => {
            const option = this.finalOptions.find((item) => item[this.valueFormat.value] === val)
            return option ? option[this.valueFormat.label] : val
          })
          .join(', ')
      } else {
        const option = this.finalOptions.find(
          (item) => item[this.valueFormat.value] === this.innerValue
        )
        return option ? option[this.valueFormat.label] : this.innerValue
      }
    },
    // 转换为cube-ui picker需要的数据格式
    pickerData() {
      return this.finalOptions.map((item) => ({
        text: item[this.valueFormat.label],
        value: item[this.valueFormat.value]
      }))
    }
  },
  created() {
    if (this.getDataMode === 'created') {
      this.getOptionsData()
    }
  },
  methods: {
    // 显示选择器
    showPicker() {
      if (this.disabled) return

      this.getOptionsData().then(() => {
        this.createPicker()
      })
    },

    // 创建选择器
    createPicker() {
      if (this.multiple) {
        // 多选模式
        this.createMultiplePicker()
      } else {
        // 单选模式
        this.createSinglePicker()
      }
    },

    // 创建单选选择器
    createSinglePicker() {
      const data = [this.pickerData]

      if (!this.picker) {
        this.picker = this.$createPicker({
          title: this.placeholder || '请选择',
          data: data,
          selectedIndex: this.getSelectedIndex(),
          onSelect: this.handleSingleSelect,
          onCancel: this.handleCancel
        })
      } else {
        this.picker.setData(data, this.getSelectedIndex())
      }
      this.picker.show()
    },

    // 创建多选选择器
    createMultiplePicker() {
      // 对于多选，使用 ActionSheet 或自定义弹窗
      const actions = this.pickerData.map((item) => ({
        text: item.text,
        active: this.isSelected(item.value)
      }))

      this.$createActionSheet({
        title: this.placeholder || '请选择',
        data: actions,
        onSelect: this.handleMultipleSelect
      }).show()
    },

    // 获取当前选中项的索引
    getSelectedIndex() {
      if (!this.innerValue) return [0]
      const index = this.pickerData.findIndex((item) => item.value === this.innerValue)
      return [index >= 0 ? index : 0]
    },

    // 判断是否已选中
    isSelected(value) {
      if (!this.innerValue) return false
      if (Array.isArray(this.innerValue)) {
        return this.innerValue.includes(value)
      }
      return this.innerValue === value
    },

    // 单选选择处理
    handleSingleSelect(selectedVal, selectedIndex, selectedText) {
      const selectedItem = this.pickerData[selectedIndex[0]]
      this.innerValue = selectedItem.value
      this.selectChange(selectedItem.value)
    },

    // 多选选择处理
    handleMultipleSelect(item, index) {
      const value = this.pickerData[index].value
      let newValue = Array.isArray(this.innerValue) ? [...this.innerValue] : []

      if (newValue.includes(value)) {
        newValue = newValue.filter((v) => v !== value)
      } else {
        newValue.push(value)
      }

      this.innerValue = newValue
      this.selectChange(newValue)
    },

    // 取消选择
    handleCancel() {
      // 取消时不做任何操作
    },

    // 清空值
    clearValue() {
      this.innerValue = this.multiple ? [] : null
      this.$emit('change', null)
    },

    visibleChange(e) {
      if (e) {
        this.$emit('visibleChange', e)
        this.getOptionsData()
      }
    },
    // 获取下拉值
    async getOptionsData() {
      if (this.getDataFun) {
        this.innerOptions = await this.getDataFun()
        return Promise.resolve()
      }
      if (this.options.length || this.innerOptions.length) {
        return Promise.resolve()
      }
      if (this.optionsType === 'system') {
        return this.getSystemDictionary()
      } else {
        return this.getCrmCustomDictionary()
      }
    },
    // 获取后台系统的数据字典
    getSystemDictionary() {
      const params = {
        ...api.querySysDict,
        url: window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN + api.querySysDict.url,
        params: new Array(this.dictionaryCode)
      }
      return this.$request(params).asyncThen((resp) => {
        if (resp.code !== 'ok' || !resp.data) {
          this.$createToast({
            txt: resp.message || '获取数据失败',
            type: 'error'
          }).show()
          return
        }
        this.innerOptions = resp.data[this.dictionaryCode].filter((i) => i.valueStatus === 'ENABLE')
      })
    },
    // 获取crm自定义数据字典
    getCrmCustomDictionary() {
      return new Promise((resolve, reject) => {
        let selectorFilterConditionList = []
        for (const key in this.customParams) {
          if (Array.isArray(this.customParams[key])) {
            selectorFilterConditionList.push({
              uuid: key,
              componentType: 'FORM_TEXT_INPUT',
              conditionOption: 'CONTAIN',
              filterInputs: [
                {
                  filterParams: [
                    {
                      filterType: 'COMMON',
                      filterComponentUuid: '',
                      filterComponentType: '',
                      filterValue: '',
                      queryValueList: this.customParams[key],
                      filterValueType: '',
                      filterDisplayValue: {},
                      searchBoxContentType: 'MULTILINE_QUERY'
                    }
                  ],
                  order: 0
                }
              ],
              connector: 'AND'
            })
          } else {
            selectorFilterConditionList.push({
              uuid: key,
              componentType: 'FORM_TEXT_INPUT',
              conditionOption: this.conditionOption,
              filterInputs: [
                {
                  filterParams: [
                    {
                      filterType: 'COMMON',
                      filterComponentUuid: '',
                      filterComponentType: '',
                      filterValue: this.customParams[key],
                      filterValueType: '',
                      filterDisplayValue: {},
                      searchBoxContentType: 'SINGLE_QUERY',
                      queryValueList: []
                    }
                  ],
                  order: 0
                }
              ],
              connector: 'AND'
            })
          }
        }
        this.$request({
          url: `/custom/business/listPageBusinessData`,
          method: 'POST',
          disableErrorMsg: true,
          disableSuccessMsg: true,
          params: {
            tabId: '65712bdc77d2411e4cbb5b0c',
            formId: '65712bdc77d2411e4cbb5b0a',
            page: 1,
            pageSize: 9999,
            selectorFilterConditionList,
            filterConditionGroup: [],
            orders: this.orders
          }
        })
          .asyncThen((res) => {
            this.innerOptions = res.table || []
            resolve()
          })
          .asyncErrorCatch((err) => {
            reject(err)
          })
      })
    },

    selectChange(e) {
      const obj = this.finalOptions.find((i) => i[this.valueFormat.value] === e)
      this.$emit('change', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.selection-input {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background-color: #f5f5f5;
  }

  .cubeic-wrong,
  .cubeic-arrow {
    font-size: 16px;
    margin-left: 8px;
  }

  .cubeic-arrow {
    transform: rotate(90deg);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .selection-input {
    min-height: 44px;
    font-size: 16px;
  }
}
</style>
