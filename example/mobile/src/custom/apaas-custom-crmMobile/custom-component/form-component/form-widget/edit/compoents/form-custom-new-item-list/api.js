/**
 * @Description: 新件清单API
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-new-item-list/api.js
 */

import axios from 'axios'

/**
 * 获取用户信息
 * @param {Object} context 组件上下文
 * @returns {Promise} 用户信息请求
 */
export async function getUserInfo(context) {
  const url = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN
  return context.$request({
    url: `${url}fnd/crmUser/getUserInfo`,
    method: 'GET',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params: {
      errorShowFlag: 'N'
    }
  })
}

/**
 * 获取新件清单数据
 * @param {Object} context 组件上下文
 * @param {Object} params 查询参数
 * @returns {Promise} 新件清单数据请求
 */
export async function getNewItemsListData(context, params) {
  const url = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_IMP_EXP_DOMAIN
  return context.$request({
    url: url + 'business/serviceFile/queryNewPartsListPage',
    method: 'POST',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params
  })
}

/**
 * 批量保存新件清单
 * @param {Object} context 组件上下文
 * @param {Object} data 保存的数据
 * @returns {Promise} 保存请求
 */
export async function batchSaveNewItems(context, data) {
  const url = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_IMP_EXP_DOMAIN
  return context.$request({
    url: url + 'business/serviceFile/batchSaveNewPartsList',
    method: 'POST',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params: data
  })
}

/**
 * 删除新件清单项
 * @param {Object} context 组件上下文
 * @param {String} documentId 文档ID
 * @param {Array} ids 要删除的项ID数组
 * @returns {Promise} 删除请求
 */
export async function deleteNewItems(context, documentId, ids) {
  const url = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_IMP_EXP_DOMAIN
  return context.$request({
    url: url + 'business/serviceFile/deleteNewPartsList?tabDocId=' + documentId,
    method: 'POST',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params: ids
  })
}

/**
 * 获取字典数据
 * @param {Object} context 组件上下文
 * @param {Array} codes 字典代码数组
 * @returns {Promise} 字典数据请求
 */
export async function getDictionaryData(context, codes) {
  return context.$request({
    url: window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN + 'common/querySysDict',
    method: 'POST',
    params: codes
  })
}

/**
 * 下载导入模板
 * @param {Object} context 组件上下文
 * @returns {Promise} 下载请求
 */
export async function downloadTemplate(context) {
  let templateUrl =
    window.GLOBAL_ENV['VUE_APP_CUSTOM_ENV']['VUE_APP_IMP_EXP_DOMAIN'] +
    'business/serviceFile/downloadNewPartExcelTemplate'
    
  const request = {
    url: templateUrl,
    method: 'GET',
    disableSuccessMsg: true
  }
  
  return context.$download(request)
}

/**
 * 上传文件
 * @param {Object} context 组件上下文
 * @param {Object} params 上传参数
 * @returns {Promise} 上传请求
 */
export async function uploadFile(context, params) {
  let formData = new FormData()
  // 设置接口传参
  formData.append('file', params.file)
  formData.append('documentId', params.documentId)
  formData.append('fileDocNumber', params.fileDocNumber)
  formData.append('companyCode', params.companyCode)
  
  const importUrl =
    window.GLOBAL_ENV['VUE_APP_CUSTOM_ENV']['VUE_APP_IMP_EXP_DOMAIN'] +
    'business/serviceFile/importNewPartsList'
    
  const request = {
    url: importUrl,
    method: 'POST',
    disableSuccessMsg: true,
    disableErrorMsg: true
  }
  request.params = formData
  return context.$upload(request)
} 