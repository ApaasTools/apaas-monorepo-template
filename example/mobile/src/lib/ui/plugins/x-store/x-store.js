/*
 * @Author: your name
 * @Date: 2021-03-24 13:56:03
 * @LastEditTime: 2021-03-24 16:14:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /XUI/x-dcloud-page-mobile/packages/lib/ui/plugins/store/x-store.js
 */
const install = function(Vue, opts) {
  const state = {}

  var setState = function(key, value) {
    state[key] = value
  }

  var getState = function(key) {
    return state[key]
  }

  var deleteState = function(key) {
    delete state[key]
  }

  Vue.prototype.$XStore = {
    setState: setState,
    getState: getState,
    deleteState: deleteState
  }
}

const XStorePlugin = {
  install: install
}

export default XStorePlugin
