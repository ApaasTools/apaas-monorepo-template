/*
 * @Author: your name
 * @Date: 2020-05-30 16:05:14
 * @LastEditTime: 2025-05-13 14:32:50
 * @LastEditors: junfa
 * @Description: In User Settings Edit
 * @FilePath: \apaas-custom-enginecode\src\api\common.js
 */
export default {
  SEND_PHONE_CODE: {
    // 发送手机验证码
    url: '/xdap-admin/user/send/smsCode',
    method: 'post'
  },
  SEND_EMAIL_CODE: {
    // 发送邮箱验证码
    url: '/xdap-admin/user/send/emailCode',
    method: 'post'
  },
  // 切换租户保存租户信息
  SAVE_ORG_ID_BY_CHANGE: {
    url: '/xdap-admin/tenant/switch/tenant',
    method: 'post',
    disableSuccessMsg: true
  },
  // 获取token
  getOpenApiToken: {
    url: '/custom/token/getOpenApiToken',
    method: 'get',
    disableSuccessMsg: true
  },
  detailBusinessData: {
    // 详情
    url: '/xdap-open/open/business/v1/query/detailBusinessData',
    method: 'get',
    disableSuccessMsg: true
  },
  querySysDict: {
    // 字典
    url: 'common/querySysDict',
    method: 'post',
    disableSuccessMsg: true
  },
  newDataSelectorData: {
    // 数据选择
    url: 'custom/business/newDataSelectorData',
    method: 'post',
    disableSuccessMsg: true
  },
  businessDataSave: {
    // 暂存接口
    url: '/custom/business/tempSave',
    method: 'post',
    disableSuccessMsg: true
  },
  staging: {
    // 保存
    url: '/custom/business/process/staging',
    method: 'post',
    disableSuccessMsg: true
  },
  submit: {
    // 提交
    url: '/xdap-open/open/process/v1/submit',
    method: 'post',
    disableSuccessMsg: true
  },
  approve: {
    // 审批
    url: '/xdap-open/open/process/v1/approve',
    method: 'post',
    disableSuccessMsg: true
  },
  reject: {
    // 拒绝或者白色的回退
    url: '/xdap-open/open/process/v1/reject',
    method: 'post',
    disableSuccessMsg: true
  },
  singleTerminate: {
    // 单人终止
    url: '/xdap-open/open/process/v1/singleTerminate',
    method: 'post',
    disableSuccessMsg: true
  },
  withdraw: {
    // 撤回
    url: '/xdap-open/open/process/v1/withdraw',
    method: 'post',
    disableSuccessMsg: true
  },
  overrule: {
    // 选择节点，退回
    url: '/xdap-open/open/process/v1/overrule',
    method: 'post',
    disableSuccessMsg: true
  },
  detailFormButton: {
    // 详情按钮
    url: '/xdap-app/form/query/detailFormButton',
    method: 'get',
    disableSuccessMsg: true
  },
  formButton: {
    url: '/xdap-app/form/query/formButton',
    method: 'get',
    disableSuccessMsg: true
  },
  listButton: {
    url: '/xdap-app/form/query/listButton',
    method: 'post',
    disableSuccessMsg: true
  },
  restart: {
    // 重新发起
    url: '/xdap-open/open/process/v1/restart',
    method: 'post',
    disableSuccessMsg: true
  },
  terminate: {
    // 作废
    url: '/custom/business/process/terminate',
    method: 'post',
    disableSuccessMsg: true
  },
  customFlow: {
    // 自定义审批
    url: '/xdap-open/open/process/v1/customFlow',
    method: 'post',
    disableSuccessMsg: true
  },
  selection: {
    // 获取撤回节点信息
    url: '/xdap-open/open/process/v1/withdraw/selection',
    method: 'get',
    disableSuccessMsg: true
  },
  dataLogs: {
    url: '/xdap-app/dataLog/query/dataLogs',
    method: 'post',
    disableSuccessMsg: true
  },
  processHistory: {
    url: '/xdap-open/open/process/v1/query/processHistory',
    method: 'post',
    disableSuccessMsg: true
  }
}
