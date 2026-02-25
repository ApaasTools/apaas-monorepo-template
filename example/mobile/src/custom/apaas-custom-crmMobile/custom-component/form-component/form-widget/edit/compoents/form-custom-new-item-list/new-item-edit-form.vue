<!--
 * @Description: 新件清单编辑表单组件
 * @Author: HongYu
 * @Date: 2025-07-08 10:00:00
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-new-item-list/new-item-edit-form.vue
-->
<template>
  <bottom-popup
    :z-index="200"
    content-class="tw-h-screen"
    v-model="visible"
    :title="title"
    :showFooter="true"
    @confirm="handleConfirm"
  >
    <template #content>
      <mobile-form
        :field-configs="computedFieldConfigs"
        :form-data="formData"
        :disabled="mode === 'view'"
        class="tw-p-4"
      >
        <template #itemName1Slot="{ field, errors }">
          <new-item-selection-input
            v-model="formData[field.prop]"
            :title="field.label"
            :disabled="field.disabled"
            :tableRowNum="formData?._XID"
            :cacheData="cacheData"
            :field-config="field"
            :dictionaryData="dictionaryData"
            :errors="errors"
            :form-data="formData"
            :mode="mode"
            @confirm="itemName1SlotConfirm"
            @clear="itemName1SlotClear"
          />
        </template>
        <template #supplierName1Slot="{ field, errors }">
          <new-item-selection-input
            v-model="formData[field.prop]"
            :title="field.label"
            :disabled="field.disabled"
            :cacheData="cacheData"
            :field-config="field"
            :dictionaryData="dictionaryData"
            :errors="errors"
            :form-data="formData"
            :mode="mode"
            @confirm="supplierName1SlotConfirm"
            @clear="supplierName1SlotClear"
          />
        </template>
      </mobile-form>
    </template>
  </bottom-popup>
</template>

<script>
import { Textarea, Select, Input } from 'cube-ui/lib'
import { getEmptyFormData } from './utils/field-configs'
import { formatArrayValue } from '@/custom/common/utils/utils'
import { FormFieldType } from '@/custom/common/components/mobile-form/utils/constants'
import { batchSaveNewItems } from './api'

import NewItemSelectionInput from './new-item-selection-input.vue'
import BottomPopup from '@/custom/common/components/bottom-popup.vue'
import MobileForm from '@/custom/common/components/mobile-form/index.vue'
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup/index.vue'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'NewItemEditForm',
  components: {
    MobileDetailPopup,
    NewItemSelectionInput,
    CubeTextarea: Textarea,
    CubeSelect: Select,
    CubeInput: Input,
    BottomPopup,
    MobileForm
  },
  // model: {
  //   prop: 'value',
  //   event: 'update'
  // },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'add' // add, edit, view
    },
    documentId: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    },
    dictionaryData: {
      type: Object,
      default: () => ({})
    },
    cacheData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: this.value,
      formData: {},
      // 保存选中的值
      selectedValues: {}
    }
  },
  computed: {
    title() {
      if (this.mode === 'add') {
        return '新增物料'
      } else if (this.mode === 'edit') {
        return '编辑物料'
      } else {
        return '物料详情'
      }
    },
    computedFieldConfigs() {
      return [
        {
          label: '物料图号',
          prop: 'itemFigureNumber1',
          type: FormFieldType.Input,
          disabled: true
        },
        {
          label: '物料名称',
          prop: 'itemName1',
          type: '',
          slotName: 'itemName1Slot',
          attrs: {
            placeholder: '请选择物料'
          },
          extra: {
            params: {
              page: 1,
              pageSize: 10,
              formId: '6577b5977d3a620dc8c4a15f',
              componentId: 'itemName1',
              hideList: ['626796721678057728'],
              afterFormData: {},
              keyWord: '',
              data: {},
              tableDataSelectQueryInfo: {
                tableComponentId: 'filNewPartsList'
              }
            },
            formatter: ({ itemName1, itemName }) => {
              return itemName1?.[0]?.name ?? itemName
            }
          }
        },
        {
          label: '供应商名称',
          prop: 'supplierName1',
          type: '',
          slotName: 'supplierName1Slot',
          attrs: {
            placeholder: '请选择供应商'
          },
          extra: {
            params: {
              page: 1,
              pageSize: 10,
              formId: '6577b5977d3a620dc8c4a15f',
              componentId: 'supplierName1',
              hideList: ['626796721678057728'],
              afterFormData: {},
              keyWord: '',
              data: {},
              tableDataSelectQueryInfo: {
                tableComponentId: 'filNewPartsList'
              }
            },
            formatter: ({ supplierName1, supplierName }) => {
              return supplierName1?.[0]?.name ?? supplierName
            },
            confirmFormatter: ({ supplierName, ...rest }) => {
              // console.info('confirmFormatter', supplierName, rest)
              // return supplierName
            }
          }
        },
        {
          label: '三位码',
          prop: 'threeDigitCode',
          type: FormFieldType.Input,
          placeholder: '请输入三位码'
        },
        {
          label: '结构码',
          prop: 'structureCode',
          type: FormFieldType.Input,
          placeholder: '请输入结构码'
        },
        {
          label: '单台用量',
          prop: 'singleUnitUsage',
          type: FormFieldType.Input,
          attrs: {
            type: 'number',
            min: 0
          }
        },
        {
          label: '配件总量',
          prop: 'totalSetsNum',
          type: FormFieldType.Input
        },
        {
          label: '单位',
          prop: 'unit',
          type: FormFieldType.Input,
          disabled: true
        },
        {
          label: '已申请调件数量',
          prop: 'requestedTransfersNum',
          type: FormFieldType.Input
        },
        {
          label: '已使用数量',
          prop: 'usedQuantity',
          type: FormFieldType.Input
        },
        {
          label: '调件未使用数量',
          prop: 'unusedTransferredParts',
          type: FormFieldType.Input
        },
        {
          label: '排放',
          prop: 'discharge',
          type: FormFieldType.Select,
          attrs: {
            placeholder: '请选择排放'
          },
          options: this.getOptionsForField('CRM_MD_EMISSION'),
          extra: {
            formatter: (formData) => {
              return formatArrayValue(formData?.discharge)
            }
          }
        },
        {
          label: '备注',
          prop: 'remarks',
          type: FormFieldType.Textarea
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      if (!val) {
        this.value = false
        this.$emit('close')
      }
    },
    dataList: {
      handler(val) {
        if (val && val.length > 0) {
          this.formData = this.initFormData(cloneDeep(val[0]))
        } else if (this.mode === 'add') {
          this.formData = getEmptyFormData(this.documentId)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化表单数据
    initFormData(data) {
      if (!data) return getEmptyFormData(this.documentId)
      this.computedFieldConfigs.forEach((field) => {
        if (field.extra?.formatter) {
          data[field.prop] = field.extra.formatter(data)
        }
      })
      return { ...data }
    },
    // 获取字段的选项列表
    getOptionsForField(dictionaryCode) {
      if (dictionaryCode && this.dictionaryData[dictionaryCode]) {
        return this.dictionaryData[dictionaryCode].map((item) => ({
          value: item.valueCode,
          text: item.valueName
        }))
      }
      return []
    },

    // 物料名称选择确认
    itemName1SlotConfirm(data) {
      let newData = {
        id: data.id,
        name: data.itemName
      }
      if (this.mode === 'add') {
        newData.unit = data.basicUnit
        newData.structureCode = data.structureCode
        newData.itemFigureNumber = data.itemFigureNumber
      }
      // 物料名称
      this.formData.itemName1 = [newData]
      // 物料图号
      this.formData.itemFigureNumber1 = data.itemFigureNumber
      // 结构码
      this.formData.structureCode = data.structureCode
      // 单位
      this.formData.unit = data.basicUnit?.[0]

      // this.$emit('tableUpdate', this.formData)
    },

    // 供应商名称选择确认
    supplierName1SlotConfirm(data) {
      let newData = {
        id: data.id,
        name: data.itemName
      }
      if (this.mode === 'add') {
        newData.unit = data.basicUnit
      }
      // 供应商名称
      this.formData.supplierName1 = [newData]
      // 三位码
      this.formData.threeDigitCode = data.threeDigitCode
    },

    itemName1SlotClear() {
      this.formData.itemName1 = []
      this.formData.itemFigureNumber1 = ''
      this.formData.structureCode = ''
      this.formData.unit = ''
      this.formData.itemName = ''
    },

    supplierName1SlotClear() {
      this.formData.supplierName1 = []
      this.formData.threeDigitCode = ''
      this.formData.supplierName = ''
    },

    async handleConfirm() {
      // console.info('this.formData', this.formData)
      const data = {
        ...this.formData,
        formId: this.formId,
        discharge: `[\"${this.formData?.discharge}"\]`
      }
      if (this.mode === 'add') {
        data._status = 'modified'
      } else {
        data.itemName1 = this.dataList[0].itemName1
        data.supplierName1 = this.dataList[0].supplierName1
      }

      const res = await batchSaveNewItems(this, [data])
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
.cube-input-border {
  border: 1px solid #dbd8d8f8;
  border-radius: 4px;
}

.form-footer-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;

  .cancel-btn,
  .confirm-btn {
    width: 48%;
    height: 44px;
    border-radius: 22px;
    font-size: 16px;
  }
}
</style>

<style>
.cube-picker {
  z-index: 1000 !important;
}
</style>
