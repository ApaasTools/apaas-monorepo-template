/**
 * @Description: API请求封装
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-engine-list/api/index.js
 */

// 抽离常用URL基础路径为常量
const IMP_EXP_DOMAIN = window.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_IMP_EXP_DOMAIN || ''
const STANDARD_DOMAIN = window.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN || ''

/**
 * 获取发动机列表数据
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {Object} params - 请求参数
 * @returns {Promise} 请求Promise
 */
export function getEngineListData(vm, params) {
  return vm.$request({
    url: IMP_EXP_DOMAIN + 'business/serviceFile/queryServiceFilePage',
    method: 'POST',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params
  }, false)
}

/**
 * 批量保存发动机列表数据
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {Array} dataList - 数据列表
 * @returns {Promise} 请求Promise
 */
export function batchSaveEngineList(vm, dataList) {
  return vm.$request(
    {
      url: IMP_EXP_DOMAIN + 'business/serviceFile/batchSaveEngineList',
      method: 'POST',
      disableErrorMsg: true,
      disableSuccessMsg: true,
      params: dataList
    },
    false
  )
}

/**
 * 删除发动机列表数据
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {String} tabDocId - 表单文档ID
 * @param {Array} ids - 要删除的ID列表
 * @returns {Promise} 请求Promise
 */
export function deleteEngineList(vm, tabDocId, ids) {
  return vm.$request({
    url: IMP_EXP_DOMAIN + 'business/serviceFile/deleteServiceFileByIds?tabDocId=' + tabDocId,
    method: 'POST',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params: ids
  }, false)
}

/**
 * 同步发动机列表数据
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {String} tabDocId - 表单文档ID
 * @param {Array} data - 要同步的数据列表
 * @returns {Promise} 请求Promise
 */
export function syncEngineList(vm, tabDocId, data) {
  return vm.$request({
    url: `${IMP_EXP_DOMAIN}business/serviceFile/syncEngineListNew?tabDocId=${tabDocId}`,
    method: 'POST',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params: data
  }, false)
}

/**
 * 导出发动机列表数据
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {String} formId - 表单ID
 * @param {String} documentId - 文档ID
 * @returns {Promise} 请求Promise
 */
export function exportEngineList(vm, formId, documentId) {
  return vm.$download(
    {
      url: `${IMP_EXP_DOMAIN}business/serviceFile/exportEngineList`,
      method: 'POST',
      disableSuccessMsg: true,
      params: {
        formId,
        documentId
      }
    },
    false
  )
}

/**
 * 下载模板
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {Boolean} isTaskFlag - 是否为任务标志
 * @returns {Promise} 请求Promise
 */
export function downloadTemplate(vm, isTaskFlag) {
  let templateUrl =
    isTaskFlag === 'TRUE'
      ? IMP_EXP_DOMAIN + 'business/serviceFile/downloadEngineListExcelTemplate'
      : IMP_EXP_DOMAIN + 'business/serviceFile/downloadEngineListExcelTemplate2'

  return vm.$download(
    {
      url: templateUrl,
      method: 'GET',
      disableSuccessMsg: true
    },
    false
  )
}

/**
 * 上传文件
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {Object} data - 上传数据
 * @returns {Promise} 请求Promise
 */
export function uploadFile(vm, data) {
  const formData = new FormData()
  // 设置接口传参
  formData.append('file', data.file)
  formData.append('documentId', data.documentId)
  formData.append('fileDocNumber', data.fileDocNumber)
  formData.append('taskFlag', data.taskFlag)

  const importUrl = IMP_EXP_DOMAIN + 'business/serviceFile/importEngineList'

  return vm.$upload({
    url: importUrl,
    method: 'POST',
    disableSuccessMsg: true,
    disableErrorMsg: true,
    params: formData
  })
}

/**
 * 获取字典数据
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {Array} dictionaryCodeList - 字典编码列表
 * @returns {Promise} 请求Promise
 */
export function getDictionaryData(vm, dictionaryCodeList) {
  return vm.$request(
    {
      url: STANDARD_DOMAIN + 'common/querySysDict',
      method: 'POST',
      params: dictionaryCodeList
    },
    false
  )
}

/**
 * 获取用户信息
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @returns {Promise} 请求Promise
 */
export function getUserInfo(vm) {
  return vm.$request(
    {
      url: `${STANDARD_DOMAIN}fnd/crmUser/getUserInfo`,
      method: 'GET',
      disableErrorMsg: true,
      disableSuccessMsg: true,
      params: {
        errorShowFlag: 'N'
      }
    },
    false
  )
}

/**
 * 获取驻外区域列表
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {Object} params - 请求参数
 * @returns {Promise} 请求Promise
 */
export function getOfficeList(vm, params) {
  return vm.$request(
    {
      url: IMP_EXP_DOMAIN + 'business/common/queryOfficeList',
      method: 'GET',
      disableErrorMsg: true,
      disableSuccessMsg: true,
      params
    },
    false
  )
}

/**
 * 获取服务站列表
 * @param {Object} vm - Vue实例，用于调用请求方法
 * @param {Object} params - 请求参数
 * @returns {Promise} 请求Promise
 */
export function getStationList(vm, params) {
  return vm.$request(
    {
      url: IMP_EXP_DOMAIN + 'business/common/queryStationList',
      method: 'GET',
      disableErrorMsg: true,
      disableSuccessMsg: true,
      params
    },
    false
  )
}
