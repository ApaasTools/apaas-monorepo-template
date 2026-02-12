/*
 * @Description:添加token
 * @Author: zhengfei.tan
 * @Date: 2024-03-06 15:29:35
 * @FilePath: \apaas-custom-enginecode\src\utils\addToken.js
 * @LastEditors: junfa
 * @LastEditTime: 2024-12-18 11:58:41
 */

// import { removeSession } from '@/utils/localStorageTools'
// import store from '@/store'

// let xdaptoken =
//   (window.APaaSSDK &&
//     window.APaaSSDK.context &&
//     window.APaaSSDK.context.globalVueContext &&
//     window.APaaSSDK.context.globalVueContext.$store &&
//     window.APaaSSDK.context.globalVueContext.$store.state.authModule &&
//     window.APaaSSDK.context.globalVueContext.$store.state.authModule.token) ||
//   ''
// 判断是否是本地环境
// const isLocal = process.env.NODE_ENV === 'development'

// if (isLocal) {
//   xdaptoken = store.state.authModule.token
// }

// const vm =
//   (window.APaaSSDK &&
//     window.APaaSSDK.context &&
//     window.APaaSSDK.context.globalVueContext &&
//     window.APaaSSDK.context.globalVueContext.$root) ||
//   window.devVm

export const addToken = function(Vue) {
  Vue.addInterceptorsRequest('ADD_TOKEN', async (config) => {
    if (config.url.includes('/xdap-open')) {
      if (!window.newToken) {
        window.newToken = await getOpenApiToken()
      }
      config.headers['Authorization'] = `Bearer ${window.newToken}`
      return config
    } else {
      return config
    }
  })
}

export function getOpenApiToken() {
  // let that = vm || window.devVm
  // if (!that) {
  //   return Promise.resolve('')
  // }
  const root = window?.APaaSSDK?.context?.globalVueContext?.$root
  const url = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN
  const request = {
    url: url + '/common/getOpenApiToken',
    method: 'get',
    disableSuccessMsg: true
  }
  return new Promise((resolve, reject) => {
    root
      .$request(request)
      .asyncThen((resp) => {
        resolve(resp.data && resp.data.access_token)
      })
      .asyncErrorCatch(() => {
        // removeSession('Authorization')
        resolve()
      })
  })
}

// 刷新 token 的，调用即可
export async function listPageViewIdsByFormId() {
  const root = window.APaaSSDK.context.globalVueContext.$root
  const request = {
    url: '/xdap-app/form/query/listPageViewIdsByFormId',
    method: 'get',
    disableSuccessMsg: true,
    params: {
      formId: '6569775f77d2411e4cbb57e0'
    }
  }
  await root.$request(request)
}
