/*
 * @Author: your name
 * @Date: 2020-07-23 22:24:06
 * @LastEditTime: 2020-07-23 22:29:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-h5-workspace/packages/xdap-h5/src/locale/index.js
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enLocaleApp from '@/locale/lang/en'
import zhLocaleApp from '@/locale/lang/zh-CN'

Vue.use(VueI18n)

const messages = {
  'en': {
    ...enLocaleApp
  },
  'zh-CN': {
    ...zhLocaleApp
  }
}

const i18n = new VueI18n({
  locale: 'zh-CN', // set locale
  messages // set locale messages
})

export default i18n
