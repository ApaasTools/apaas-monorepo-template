const baseUrl =
  window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.reportDomain ??
  'http://gateway.yctp.yuchaiqas.com/crm-report-service/'

/**
 * 获取消息提醒
 * @returns {Promise}
 */
const getMessageReminder = {
  url: baseUrl + 'homePage/queryNoReadMsg',
  method: 'get',
  disableErrorMsg: true,
  disableSuccessMsg: true
}

/**
 * 消息提醒接口
 * @param {Object} params               查询参数
 * @param {String} params.userId        用户id
 * @param {String} params.page          页码
 * @param {String} params.pageSize        页大小
 * @returns {Promise}
 */
const postMessageReminder = {
  ...getMessageReminder,
  method: 'post'
}

export { getMessageReminder, postMessageReminder }
