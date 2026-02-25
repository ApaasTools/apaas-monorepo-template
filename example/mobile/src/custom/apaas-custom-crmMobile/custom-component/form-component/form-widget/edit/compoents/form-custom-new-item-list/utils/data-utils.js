/*
 * @Description: 新件清单数据处理工具
 * @Author: junfa
 * @Date: 2023-08-11 09:39:19
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-new-item-list/utils/data-utils.js
 */

import { getEmptyFormData } from './field-configs'

/**
 * 初始化一个新的数据项
 * @param {String} documentId 文档ID
 * @returns {Object} 新的数据项
 */
export function initNewDataItem(documentId) {
  return getEmptyFormData(documentId)
}

/**
 * 处理表单数据，将表单数据转换为API需要的格式
 * @param {Array} formDataList 表单数据列表
 * @param {String} documentId 文档ID
 * @param {String} mode 操作模式，add/edit
 * @returns {Object} 处理后的数据
 */
export function processFormData(formDataList, documentId, mode) {
  // 深拷贝数据，避免直接修改原始数据
  const dataList = JSON.parse(JSON.stringify(formDataList))
  
  // 根据模式处理数据
  if (mode === 'add') {
    // 新增模式下，确保每个项都有正确的文档ID
    dataList.forEach(item => {
      item.tabDocId = documentId
    })
  }
  
  // 返回API需要的数据结构
  return {
    documentId: documentId,
    table: dataList
  }
}

/**
 * 格式化表格数据，确保数据的一致性
 * @param {Array|Object} data 原始数据
 * @returns {Array} 格式化后的数据
 */
export function formatData(data) {
  // 如果是单个对象，转换为数组
  const dataArray = Array.isArray(data) ? data : [data]
  
  // 遍历处理每个数据项
  return dataArray.map(item => {
    // 深拷贝，避免修改原始数据
    const formattedItem = { ...item }
    
    // 确保关键字段存在，即使是空值
    const ensureFields = [
      'itemFigureNumber1', 'itemName1', 'supplierName1', 'threeDigitCode',
      'structureCode', 'singleUnitUsage', 'totalSetsNum', 'unit',
      'requestedTransfersNum', 'usedQuantity', 'unusedTransferredParts',
      'discharge', 'remarks', 'docNumber'
    ]
    
    ensureFields.forEach(field => {
      if (formattedItem[field] === undefined) {
        // 为不同类型的字段设置默认值
        if (['itemName1', 'supplierName1'].includes(field)) {
          formattedItem[field] = []
        } else if (field === 'discharge') {
          formattedItem[field] = []
        } else {
          formattedItem[field] = ''
        }
      }
      
      // 确保排放字段是数组格式
      if (field === 'discharge' && formattedItem[field] && !Array.isArray(formattedItem[field])) {
        formattedItem[field] = [formattedItem[field]]
      }
    })
    
    return formattedItem
  })
} 