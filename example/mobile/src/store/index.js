/*
 * @Author: your name
 * @Date: 2020-07-24 20:08:42
 * @LastEditTime: 2020-08-05 14:33:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { authStore } from './auth.store'
import { themeStore } from './theme.store'
import { tenantStore } from './tenant.store'
import { menuStore } from './menu.store'

const keyPrefix = '__vuex__'

const vuexCookie = new VuexPersistence({
  key: `${keyPrefix}cookie`,
  restoreState: (key, storage) => {
    const data = Vue.prototype.$cookies.get(key)
    return data
  },
  saveState: (key, state, storage) => {
    Vue.prototype.$cookies.set(key, state, {
      // expires: 3
    })
  },
  modules: [], // only save user module
  filter: (mutation) => {
    return true
  }
})

const vuexLocal = new VuexPersistence({
  key: `${keyPrefix}local`,
  storage: window.localStorage,
  modules: ['authModule'],
  filter: (mutation) => {
    return true
  }
})

const vuexSession = new VuexPersistence({
  key: `${keyPrefix}session`,
  storage: window.sessionStorage,
  modules: ['authModule'],
  filter: (mutation) => {
    return true
  }
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    authModule: authStore,
    themeModule: themeStore,
    tenantModule: tenantStore,
    menuModule: menuStore
  },
  plugins: [vuexCookie.plugin, vuexLocal.plugin, vuexSession.plugin]
})
