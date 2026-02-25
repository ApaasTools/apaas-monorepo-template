/*
 * @Author: your name
 * @Date: 2020-05-30 15:57:57
 * LastEditTime: 2020-07-30 12:20:43
 * LastEditors: Mosuzi
 * @Description: In User Settings Edit
 * @FilePath: /x-product-workspace/packages/x-project-app/src/store/auth.store.js
 */
import TypeUtil from '@/util/type.util'
import Vue from 'vue'

export const SET_USER_INFO = 'SET_USER_INFO'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_ORGS = 'SET_ORGS'
export const SET_WX_INFO = 'SET_WX_INFO'
export const CLEAR_AUTH_STORE = 'CLEAR_AUTH_STORE'

export const authStore = {
  namespaced: true,
  state: {
    userInfo: {},
    token: 'xxx',
    orgs: [],
    wxInfo: null
  },
  mutations: {
    [SET_USER_INFO](state, userInfo) {
      if (TypeUtil.isObject(userInfo)) {
        state.userInfo = userInfo
      }
    },
    [SET_TOKEN](state, token) {
      if (TypeUtil.isString(token)) {
        state.token = token
        Vue.addHeaders({
          xdaptoken: token
        })
      }
    },
    [SET_ORGS](state, orgs) {
      state.orgs = orgs
    },
    [SET_WX_INFO](state, wxInfo) {
      state.wxInfo = wxInfo
    },
    [CLEAR_AUTH_STORE](state) {
      state.userInfo = null
      state.token = null
      state.orgs = []
      state.wxInfo = null
    }
  },
  actions: {},
  getters: {}
}
