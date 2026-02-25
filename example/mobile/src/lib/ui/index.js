/*
 * @Author: your name
 * @Date: 2020-07-23 17:57:49
 * @LastEditTime: 2021-04-21 15:33:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xdap-h5\src\lib\ui\index.js
 */
import { version } from '../../../package.json'
import XSvgIcon from './components/x-svg-icon';
import XModal from './components/x-modal';
import XProxyFormItem from './components/x-proxy-form-item';
import XDateFormatPlugin from './plugins/dayjs/x-date-format';
import XLodashPlugin from './plugins/lodash/x-lodash';
import XStoragePlugin from './plugins/storage/x-storage';
import XBomeventPluign from './plugins/bomevent/x-bomevent';
import XRequestPlugin from './plugins/request/x-request';

import XStorePlugin from './plugins/x-store/x-store'

import XEventOutsideDirective from './directives/x-event-outside/index.js';

const components = [
  XSvgIcon,
  XModal,
  XProxyFormItem
]

const plugins = [
  XRequestPlugin,
  XLodashPlugin,
  XStoragePlugin,
  XBomeventPluign,
  XDateFormatPlugin,
  XStorePlugin
]

const allComps = [
  ...components,
  // ...formComponents
]

const install = (Vue) => {
  // 判断是否安装
  if (install.installed) {
    return
  }
  plugins.forEach((plugin) => {
    Vue.use(plugin)
  })

  allComps.forEach((component) => {
    Vue.use(component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version,
  install,
  XDateFormatPlugin,
  XLodashPlugin,
  XStoragePlugin,
  XBomeventPluign,
  XRequestPlugin,
  XEventOutsideDirective
}

export {
  XRequestPlugin,
  XStoragePlugin,
  XLodashPlugin,
  XEventOutsideDirective
}
