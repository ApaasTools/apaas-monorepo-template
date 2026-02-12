/*
 * @Author: your name
 * @Date: 2020-05-30 15:57:57
 * @LastEditTime: 2025-05-29 09:04:28
 * @LastEditors: junfa
 * @Description: In User Settings Edit
 * @FilePath: \apaas-custom-enginecode\src\store\auth.store.js
 */
import { isObject, isString } from '@/utils'
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
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3NTAyOTkwNTMsImlhdCI6MTc1MDI5MTg1MywieGRhcHVzZXJpZCI6IjEwMDY2NzQyNTAzMjY3MDAxOTU4NCJ9.UM0ehi95XrLHR_nzg0OduqUmHPw16voUxZEpzqdnZyNNrbi3QqO1nX9ah5Z15dJbcjage1BMEFSPzwin3B2C1Q',
    orgs: [],
    wxInfo: null
  },
  mutations: {
    [SET_USER_INFO](state, userInfo) {
      if (isObject(userInfo)) {
        state.userInfo = userInfo
      }
    },
    [SET_TOKEN](state, token) {
      if (isString(token)) {
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
