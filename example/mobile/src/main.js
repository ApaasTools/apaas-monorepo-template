/*
 * @Author: your name
 * @Date: 2020-07-23 16:20:22
 * @LastEditTime: 2021-07-08 20:53:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-h5-workspace/packages/xdap-h5/src/main.js
 */
import 'cube-ui/lib/cube.min.css'
import Vue from 'vue'
import App from './App.vue'
// import '@babel/polyfill'/
import router from './router'
import './vender/cube-ui'
import './assets/scss/index.scss'
import './vender/x-lib-ui-h5'
import './vender/plugin'
import './vender/custom-plugin'
import AssetsLoader from './assets-loader'
import i18n from '@/locale/index'

import store from './store'
import { SET_TOKEN } from '@/store/auth.store.js'
import { ExtensionEngine } from 'x-extension'

// import { RuleEngine, functions, SimpleRuleEngine } from '@x-apaas/x-lib-rule-engine'
import './vender/x-dcloud-page-mobile'

import AuthLogic from './logic/auth.logic'

import pages from 'apaas-custom-mobile-pages'
import pagesJson from 'apaas-custom-mobile-pages/apaas.json'

AssetsLoader.requireAllSvg()
Vue.config.productionTip = false
Vue.prototype.$store = store

Vue.use(pages);
const r = router
if (pagesJson.router) {
  Object.keys(pagesJson.router).forEach((key) => {
    const routerConfig = pagesJson.router[key]
    store.commit('menuModule/ADD_CUSTOM_MENU_ROUTER', routerConfig)
    r.addRoute('admin', {
      name: routerConfig.name,
      path: routerConfig.path,
      component: Vue.component(key)
    })
  })
}


console.dir(Vue)

/**
 * 开发用的菜单
 */
// const requireContext = require.context('./custom/', true, /apaas.json$/)
// console.log(requireContext.keys())

// requireContext.keys().map((key) => {
//   const rc = requireContext(key)
//   if (rc && rc.entry) {
//     // 装载JS
//     const entryJs = key.replace('apaas.json', rc.entry.replace('./', '')).replace('./', '')
//     const entryModule = require('./custom/' + entryJs)
//     // loadScript

//     Vue.use(entryModule.default)

//     // 动态添加路由
//     const r = router

//     Object.keys(rc.router).forEach((key) => {
//       const routerConfig = rc.router[key]
//       store.commit('menuModule/ADD_CUSTOM_MENU_ROUTER', routerConfig)
//       r.addRoute('admin', {
//         name: routerConfig.name,
//         path: routerConfig.path,
//         component: Vue.component(key)
//       })
//     })
//   }
//   return rc
// })

// 注册规则函数列表
// RuleEngine.getInstance().registerContextMethods(functions)
// SimpleRuleEngine.getInstance().registerContextMethods(functions)

// 添加request拦截器
Vue.addInterceptorsRequest('REQUEST_PARAMS_INTERCEPTOR', (e) => {
  e.headers['xdaptimestamp'] = new Date().getTime()

  const authStore = store.state.authModule
  if (authStore.token) {
    e.headers['xdaptoken'] = authStore.token
  }

  return e
})

// 添加response拦截器
Vue.addInterceptorsResponse('RESPONSE_SUCCESS_MSG_INTERCEPTOR', (e) => {
  const token = e && e.headers && e.headers.xdaptoken
  if (token) {
    store.commit(`authModule/${SET_TOKEN}`, token)
  }
  if (e && e.status === 200 && e.data.code === 'ok' && !e.config.disableSuccessMsg) {
    if (e.data.interval) {
      Vue.prototype.$message({
        message: e.data.message,
        type: 'success',
        durationTime: e.data.interval
      })
    } else {
      Vue.prototype.$message({
        message: e.data.message,
        type: 'success'
      })
    }
  }
  return e
})

// eslint-disable-next-line no-unused-vars
const isSingleApp = () => {
  return ExtensionEngine.getInstance().validateBlock('SINGLE_APP', 'SingleAppConfig')
}

AuthLogic.getInstance(store, router, Vue.GLOBAL_ENV)

new Vue({
  i18n,
  router,
  store,
  created() {
    const MESSAGE_TYPES = {
      info: 'txt',
      success: 'correct',
      warning: 'warn',
      error: 'error'
    }
    Vue.prototype.$message = ({ message, type = 'info', mask = false, maskClosable = false }) => {
      let toast
      if (type === 'info') {
        toast = this.$createToast({
          txt: message,
          type: MESSAGE_TYPES[type],
          time: 0,
          mask: true,
          maskClosable: true
        })
      } else {
        toast = this.$createToast({
          txt: message,
          type: MESSAGE_TYPES[type],
          mask: mask,
          maskClosable: maskClosable
        })
      }

      toast.show()
    }

    Vue.prototype.$confirm = ({ message, okConfig, cancelConfig, maskClosable }) => {
      this.$createDialog({
        type: 'confirm',
        content: message,
        maskClosable: maskClosable || false,
        confirmBtn: {
          text: (okConfig && okConfig.title) || '确定',
          active: true,
          disabled: (okConfig && okConfig.disabled) || false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: (cancelConfig && cancelConfig.title) || '取消',
          active: true,
          disabled: (cancelConfig && cancelConfig.disabled) || false,
          href: 'javascript:;'
        },
        onConfirm: okConfig && okConfig.onOk,
        onCancel: cancelConfig && cancelConfig.onCancel
      }).show()
    }
  },
  render: (h) => h(App)
}).$mount('#app')
