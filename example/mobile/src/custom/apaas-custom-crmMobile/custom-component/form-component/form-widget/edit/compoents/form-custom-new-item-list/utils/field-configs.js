/**
 * @Description: 新件清单字段配置文件
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-new-item-list/utils/field-configs.js
 */
import { formatArrayValue } from './formatters'

/**
 * 详情展示字段配置
 */
export const detailFieldConfigs = [
  { label: '物料图号', prop: 'itemFigureNumber1', defaultValue: '未填写' },
  { label: '物料名称', prop: 'itemName1', formatter: 'formatArrayValue' },
  { label: '供应商名称', prop: 'supplierName1', formatter: 'formatArrayValue' },
  { label: '三位码', prop: 'threeDigitCode' },
  { label: '结构码', prop: 'structureCode' },
  { label: '单台用量', prop: 'singleUnitUsage', type: 'number' },
  { label: '配件总量', prop: 'totalSetsNum', type: 'number' },
  { label: '单位', prop: 'unit' },
  { label: '已申请调件数量', prop: 'requestedTransfersNum', type: 'number' },
  { label: '已使用数量', prop: 'usedQuantity', type: 'number' },
  { label: '调件未使用数量', prop: 'unusedTransferredParts', type: 'number' },
  {
    label: '排放',
    prop: 'discharge',
    formatter: 'formatDictionaryValue',
    dictionaryCode: 'CRM_MD_EMISSION'
  },
  { label: '备注', prop: 'remarks' },
  { label: '文件ID', prop: 'docNumber' }
]

/**
 * 编辑表单字段配置
 */
export const formFieldConfigs = [
  {
    label: '物料图号',
    prop: 'itemFigureNumber1',
    type: 'input',
    placeholder: '请输入物料图号',
    disabled: true
  },
  {
    label: '物料名称',
    prop: 'itemName1',
    type: 'selectPopup',
    placeholder: '请选择物料名称',
    valueField: 'id',
    textField: 'name',
    isArrayObj: true,
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
    formatter: ({ itemName }) => {
      return itemName
    }
  },
  {
    label: '供应商名称',
    prop: 'supplierName1',
    type: 'selectPopup',
    placeholder: '请选择供应商名称',
    valueField: 'id',
    textField: 'name',
    isArrayObj: true,
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
    formatter: ({ supplierName }) => {
      return supplierName
    }
  },
  {
    label: '三位码',
    prop: 'threeDigitCode',
    type: 'input',
    placeholder: '请输入三位码'
  },
  {
    label: '结构码',
    prop: 'structureCode',
    type: 'input',
    placeholder: '请输入结构码'
  },
  {
    label: '单台用量',
    prop: 'singleUnitUsage',
    type: 'number',
    placeholder: '请输入单台用量',
    min: 0
  },
  {
    label: '配件总量',
    prop: 'totalSetsNum',
    type: 'number',
    placeholder: '请输入配件总量',
    min: 0
  },
  {
    label: '单位',
    prop: 'unit',
    type: 'input',
    placeholder: '请输入单位',
    disabled: true
  },
  {
    label: '已申请调件数量',
    prop: 'requestedTransfersNum',
    type: 'number',
    placeholder: '请输入已申请调件数量',
    min: 0
  },
  {
    label: '已使用数量',
    prop: 'usedQuantity',
    type: 'number',
    placeholder: '请输入已使用数量',
    min: 0
  },
  {
    label: '调件未使用数量',
    prop: 'unusedTransferredParts',
    type: 'number',
    placeholder: '请输入调件未使用数量',
    min: 0
  },
  {
    label: '排放',
    prop: 'discharge',
    type: 'select',
    placeholder: '请选择排放',
    dictionaryCode: 'CRM_MD_EMISSION',
    formatter: ({ discharge }) => {
      return formatArrayValue(discharge, 'discharge', true)
    }
  },
  {
    label: '备注',
    prop: 'remarks',
    type: 'textarea',
    placeholder: '请输入备注',
    maxlength: 200
  }
]

/**
 * 列表项展示字段配置 - 用于卡片显示
 */
export const listItemFields = [
  { label: '物料图号', prop: 'itemFigureNumber1' },
  { label: '物料名称', prop: 'itemName1', formatter: 'formatArrayValue', formatParams: ['name'] },
  {
    label: '供应商名称',
    prop: 'supplierName1',
    formatter: 'formatArrayValue',
    formatParams: ['name']
  },
  { label: '三位码', prop: 'threeDigitCode' },
  { label: '结构码', prop: 'structureCode' },
  { label: '单台用量', prop: 'singleUnitUsage' },
  { label: '配件总量', prop: 'totalSetsNum' },
  { label: '单位', prop: 'unit' },
  {
    label: '排放',
    prop: 'discharge',
    formatter: 'formatDictionaryValue',
    dictionaryCode: 'CRM_MD_EMISSION'
  }
]

/**
 * 获取空的表单数据对象
 * @param {string} documentId 文档ID
 * @returns {Object} 空表单数据对象
 */
export function getEmptyFormData(documentId) {
  const id = Date.now().toString()
  return {
    rowID: id,
    _XID: id,
    tabDocId: documentId,
    itemFigureNumber1: '',
    itemName1: [],
    supplierName1: [],
    threeDigitCode: '',
    structureCode: '',
    singleUnitUsage: '',
    totalSetsNum: '',
    unit: '',
    requestedTransfersNum: '',
    usedQuantity: '',
    unusedTransferredParts: '',
    discharge: [],
    remarks: '',
    docNumber: ''
  }
}
