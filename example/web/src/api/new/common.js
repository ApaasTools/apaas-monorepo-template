const baseUrl =
  window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN ??
  'http://gateway.yctp.yuchaiqas.com/crm-standard-service/'

/**
 * 获取标准字典
 * @param {Object} params               查询参数
 * @param {String} params.stationNumber 服务站编号
 * @param {String} params.type          类型  "in" :授权主机厂 ,"out":非授权主机厂 , 空默认全部
 * @param {Number} params.page          页码
 * @param {Number} params.pageSize      页大小
 * @returns {Promise}
 */
const staStationAuthorizes = {
  url: baseUrl + 'apaas-data-dictionary/queryDataDictionary',
  method: 'post',
  disableErrorMsg: true,
  disableSuccessMsg: true
}

export { staStationAuthorizes }
