/**
 * @Description: 数据处理工具
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-engine-list/utils/data-utils.js
 */
import { isEmpty, omitBy } from 'lodash-es'
import { extractArrayValue } from './formatters'

/**
 * 获取分页数据的当前页码和总页数
 * @param {Object} pagination - 分页数据
 * @returns {Object} 包含当前页和总页数的对象
 */
export function getPaginationInfo(pagination) {
  const { currentPage, pageSize, total } = pagination
  const totalPages = Math.ceil(total / pageSize)

  return {
    currentPage,
    totalPages,
    hasMore: currentPage < totalPages
  }
}

/**
 * 初始化新的数据项
 * @param {String} documentId - 文档ID
 * @returns {Object} 新的数据项对象
 */
export function initNewDataItem(documentId) {
  return {
    // 新增为空
    id: '',
    documentId: '',
    // 主表documentId
    tabDocId: documentId,
    formId: '',

    // 基本信息
    docNumber: '', // 服务文件号
    taskItemId: '', // 任务项ID
    factoryNumber: '', // 发动机出厂编号
    engineNumber: '', // 发动机编号
    originalDataNumber: '', // 原车数据编号
    upgradeDataNumber: '', // 升级数据编号
    plantCode: '', // 主机厂代码
    plantDp: '', // 主机厂名称 - JSON字符串数组
    productModel: '', // 发动机型号

    // 经销商信息
    dealerName: '', // 经销商名称
    dealerContactPerson: '', // 经销商联系人
    dealerContactInfo: '', // 经销商联系方式

    // 用户信息
    userName: '', // 用户姓名
    userPhoneNumber: '', // 用户电话
    userLocation: '', // 用户所在地

    // 服务站和责任信息
    firstMaintainStationDp: '', // 首保服务站
    reporterName: '', // 报修人姓名
    reporterPhone: '', // 报修人电话
    linkLocated: '', // 所在环节 - JSON字符串数组
    responsibleOfficeDp: '', // 责任驻外区域 - JSON字符串数组
    officeCode: '', // 驻外区域编码
    responsibilityStationDp: '', // 责任服务站 - JSON字符串数组
    stationNumber: '', // 服务站编码

    // 任务标记
    adjustTasksOfficeFlag: false, // 调整任务（办事处）
    adjustTasksStationFlag: false, // 调整任务（服务站）
    resendFile: false, // 补发文件
    taskFlag: '', // 生成任务

    // 状态信息
    executionStatus: '', // 执行状态 - JSON字符串数组
    taskStatus: '', // 任务状态 - JSON字符串数组

    // 服务单信息
    serviceDocNumber: '', // 服务订单号

    // 日期时间信息
    processingDate: '', // 处理日期
    untreateReasons: '', // 未处理原因
    appointmentTime: '', // 预约时间
    trackingEffect: '', // 跟踪效果
    trackingEffectDeadline: '', // 跟踪效果期限（天）
    rectificationEffect: '', // 整改效果描述
    rectificationEffectTime: '', // 整改效果返回时间

    // 其他信息
    attachment: '', // 附件
    remarks: '', // 备注
    engineNumberNew: '', // 发动机新机编号

    // UI状态，不提交给后端
    selected: false
  }
}

/**
 * 处理表单数据，确保符合API要求的格式
 * @param {Array} dataList - 要处理的数据数组
 * @param {String} documentId - 主表documentId
 * @param {String} modeType - 操作模式 'add'或'edit'
 * @returns {Array} 处理后的数据数组
 */
export function processFormData(dataList, documentId, modeType) {
  if (!Array.isArray(dataList) || dataList.length === 0) {
    return []
  }

  return dataList.map((item) => {
    // 创建一个新对象，避免修改原始数据
    const processedItem = { ...item }

    // 确保tabDocId设置为当前表单的documentId
    processedItem.tabDocId = documentId

    // 如果是新增，确保id和documentId为空字符串
    if (modeType === 'add') {
      processedItem.id = ''
      processedItem.documentId = ''
    }

    // 确保formId字段有值
    if (!processedItem.formId) {
      processedItem.formId = '6577b5977d3a620dc8c4a15f' // 使用默认formId
    }

    // 需要转为数组字符串
    const arrayFields = ['taskStatus', 'executionStatus', 'trackingEffect', 'linkLocated']
    arrayFields.forEach((field) => {
      // 如果有值，则设置为JSON字符串
      if (processedItem[field]) {
        processedItem[field] = `[\"${processedItem[field]}\"]`
      }
    })

    // 确保布尔值字段使用'TRUE'或'FALSE'字符串
    const booleanFields = ['adjustTasksOfficeFlag', 'adjustTasksStationFlag', 'resendFile']
    booleanFields.forEach((field) => {
      if (processedItem[field] === true) {
        processedItem[field] = 'TRUE'
      } else if (processedItem[field] === false || !processedItem[field]) {
        processedItem[field] = 'FALSE'
      }
    })

    // 处理日期字段，确保是YYYY-MM-DD HH:mm:ss格式
    const dateFields = ['processingDate', 'appointmentTime', 'rectificationEffectTime']
    dateFields.forEach((field) => {
      if (processedItem[field] && !processedItem[field].includes(':')) {
        // 如果有日期但没有时间部分，添加时间
        processedItem[field] = `${processedItem[field]} 00:00:00`
      }
    })

    // 处理数组
    const newArrayFields = ['responsibilityStationDp', 'responsibleOfficeDp']
    newArrayFields.forEach((field) => {
      if (processedItem[field]) {
        let newItem = processedItem[field]
        if (Array.isArray(newItem)) newItem = newItem?.[0]
        let name = field === 'responsibilityStationDp' ? newItem.stationName : newItem.officeName
        if (!name) name = newItem?.name
        processedItem[field] = [
          {
            id: newItem.id,
            name
          }
        ]
      }
    })

    // 移除UI状态相关字段，不发送给后端
    delete processedItem.selected

    return omitBy(processedItem, isEmpty)
  })
}

/**
 * 格式化数据
 * @param {Object|Array} data - 要处理的数据对象或数组
 * @returns {Object|Array} 处理后的数据
 */
export function formatData(data) {
  // 如果是数组，处理每个元素
  if (Array.isArray(data)) {
    return data.map((item) => formatData(item))
  }

  // 如果不是对象，直接返回
  if (!data || typeof data !== 'object') {
    return data
  }

  // 创建一个新对象，避免修改原始数据
  const formattedData = { ...data }

  // 处理字符串形式的JSON数组字段
  const jsonArrayFields = [
    'trackingEffect',
    'linkLocated',
    'executionStatus',
    'taskStatus',
    'plantDp'
  ]

  jsonArrayFields.forEach((field) => {
    if (formattedData[field]) {
      formattedData[field] = extractArrayValue(formattedData[field])
    }
  })

  return formattedData
}
