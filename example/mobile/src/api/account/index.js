/*
 * @Author: your name
 * @Date: 2020-07-23 19:57:47
 * @LastEditTime: 2021-01-12 12:05:40
 * @LastEditors: lizhihang
 * @Description: In User Settings Edit
 * @FilePath: \xdap-h5\src\api\account\index.js
 */
export default {
  module: 'ACCOUNT',
  'USER_LOGIN': { // 用户登录
    url: '/xdap-admin/user/login',
    method: 'post'
  },
  USER_APP_LOGIN: {
    url: '/xdap-app/app/login',
    method: 'post',
    disableSuccessMsg: true
  },
  'SEND_PHONE_CODE': { // 发送手机验证码
    url: '/xdap-admin/user/send/smsCode',
    method: 'post'
  },
  'BIND_WX_OFFICE': { // 绑定微信
    url: '/xdap-admin/user/binding/wxOffice',
    method: 'get',
    disableSuccessMsg: true
  },
  QUERY_ACCOUNT_INFO: {
    url: '/xdap-admin/user/query/accountInfo',
    method: 'get',
    disableSuccessMsg: true
  },
  USER_LOGOUT: {
    url: '/xdap-admin/user/signOut',
    method: 'get'
  },
  'GET_OPENID_BY_CODE': {
    url: '/xdap-admin/user/getOpenIdByCode',
    method: 'get',
    disableSuccessMsg: true
  },
  'LOGIN_BY_CODE': {
    url: '/xdap-admin/user/loginByCode',
    method: 'get',
    disableSuccessMsg: true
  },
  'UNTIE_WX': {
    url: '/xdap-admin/user/untie/wxOffice',
    method: 'get'
  },
  'GET_WX_USER_INFO': {
    url: '/xdap-admin/user/wx/userInfo',
    method: 'get',
    disableSuccessMsg: true
  },
  // 查询用户绑定第三方账号信息
  QUERY_ACCOUNT_BIND: {
    url: '/xdap-admin/user/query/userBind',
    method: 'get',
    disableSuccessMsg: true
  },
  // 解绑第三方账号
  UNBIND_THIRD_PLATFORM: {
    url: '/xdap-admin/user/unbind/userThirdPlatform',
    method: 'post'
  },
  'WX_SIGN': {
    url: '/xdap-admin/user/wx/signatureInfo',
    method: 'post',
    disableSuccessMsg: true
  },
  USER_REGISTER: {
    url: '/xdap-admin/user/register',
    method: 'post',
    disableSuccessMsg: true
  },
  // 加入组织
  'JOIN_ORG': {
    url: '/xdap-admin/tenant/join/tenant',
    method: 'get'
  },
  // 创建组织
  'CREATE_ORG': {
    url: '/xdap-admin/tenant/add/newTenant',
    method: 'post'
  },
  // 获取所在行业值列表
  'GET_INDUSTRY_LIST': {
    url: '/xdap-admin/dataDictionary/query/dictionaryValueList',
    method: 'post',
    disableSuccessMsg: true
  },
  'WECOM_SIGN': {
    url: '/xdap-app/workWechat/get/signatureInfo',
    method: 'post',
    disableSuccessMsg: true
  },
  'GET_TENANT_LOGO': {
    url: 'xdap-app/app/get/tenantLogo',
    method: 'get',
    disableSuccessMsg: true,
    disableErrorMsg: true
  }
}
