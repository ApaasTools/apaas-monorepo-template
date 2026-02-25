/*
 * @Author: your name
 * @Date: 2020-11-16 16:46:00
 * @LastEditTime: 2021-06-24 17:31:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/vender/plugin.js
 */
import Vue from 'vue'
import GlobalLoading from '@/components/global-loading'
import GlobalModals from '@/components/global-modal'
import VConsole from 'vconsole'
// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'

// Vue.use(Viewer)
Vue.use(GlobalLoading)
Vue.use(GlobalModals)
if (process.env.VUE_APP_V_CONSOLE === 'ENABLE') {
  Vue.prototype.$vconsole = new VConsole()
}
