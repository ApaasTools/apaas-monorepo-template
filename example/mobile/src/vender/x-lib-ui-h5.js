/*
 * @Author: your name
 * @Date: 2020-08-08 18:50:07
 * @LastEditTime: 2021-06-24 17:31:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/vender/x-lib-ui-h5.js
 */
import Vue from 'vue'
import XLibUiH5, { XRequestPlugin, XStoragePlugin, XLodashPlugin, XEventOutsideDirective } from '@/lib/ui'

Vue.use(XLodashPlugin, {
  name: 'lodash'
})

Vue.use(XStoragePlugin, {
  namespace: '__xdap__'
})

Vue.use(XEventOutsideDirective)

// Vue.use(FormBuildEngine)

console.log(Vue.GLOBAL_ENV)
Vue.use(XRequestPlugin, {
  baseURL: process.env.VUE_APP_BASE_DOMAIN,
  headers: {
    'Accept-Language': 'zh-CN',
    xdapversion: process.env.VUE_APP_XDAP_VERSION
  },
  needShowMessage: true,
  businessErrorCatch: function(failRes, response, needShowMessage) {
    // 通用业务错误处理
    // console.log(failRes, response, needShowMessage)
    if (failRes.code === 'error' && needShowMessage) {
      Vue.prototype.$message({
        message: failRes.message,
        type: 'error'
      })
    }
  },
  errorCatch: function(err, needShowMessage) {
    console.error(err)
  }
})

Vue.use(XLibUiH5)
