/*
 * @Author: your name
 * @Date: 2020-05-30 19:23:07
 * @LastEditTime: 2020-07-24 20:23:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/lib/ui/plugins/storage/x-storage.js
 */ 
import Storage from 'vue-ls'
import VueCookies from 'vue-cookies'

const install = function(Vue, opts = {}) {
  const options = {
    namespace: opts.namespace || '__vue_ls', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: opts.storage || 'local' // storage name session, local, memory
  }

  Vue.use(Storage, options)

  Vue.use(VueCookies)
}

const StoragePlugin = {
  install: install
}

export default StoragePlugin
