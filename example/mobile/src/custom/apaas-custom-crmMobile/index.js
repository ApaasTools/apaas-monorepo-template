import '@/icons/index'
import '@/assets/scss/common.scss'

import { customFormComponentList } from './custom-component/form-component'
import { widgetConfigList } from './custom-component/form-config'
import { beforeRouteLeave } from './guard'

import VTeleportDirective from '~/directives/v-teleport'

// import XDcloudPageMobile from '@x-apaas/x-dcloud-page-mobile'
// import { installElementUI } from './element-ui'
// import { installXUI } from './x-ui'

const loader = require.context('./custom-page/pages', true, /\.vue$/)
const pages = loader.keys().map((page) => loader(page).default)

async function mounted() {
  try {
    const XDcloudPageMobile = await import('@x-apaas/x-dcloud-page-mobile')
    console.info('mounted', XDcloudPageMobile)
    // 使用组件
  } catch (error) {
    console.error('导入失败:', error)
  }
}

const install = function(Vue, opts) {
  // ================================ 安装ElementUI ================================
  // installElementUI(Vue)
  // console.info('XDcloudPageMobile', XDcloudPageMobile)

  // ================================ 安装XUI ================================
  // installXUI(Vue)
  // Vue.use(XDcloudPageMobile)
  // mounted()

  // ================================ 开发环境调试 ================================
  if (window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_DEBUG === 'true') {
    const script = document.createElement('script')
    script.src = '//cdn.bootcdn.net/ajax/libs/eruda/2.3.3/eruda.js'
    document.body.append(script)
    script.onload = () => {
      eruda?.init()
    }
  }

  // ================================ 安装CrmMobile模块 ================================
  pages.forEach((page) => {
    Vue.component(`apaas-custom-${page.name}`, page)
  })

  // ================================ 安装表单部件 ================================
  if (customFormComponentList && Array.isArray(customFormComponentList)) {
    customFormComponentList.forEach((comp) => {
      Vue.component(comp.name, comp)
    })
  }

  // ================================ 表单引擎注册自开发组件配置 ================================
  if (
    (!opts || !opts.onlyInstallFormWidget) &&
    widgetConfigList &&
    Array.isArray(widgetConfigList)
  ) {
    widgetConfigList.forEach((widgetConfig) => {
      const compConfig = {
        widgetConfig
      }
      Vue.FormEngine && Vue.FormEngine.registerCustomComponentConfig(compConfig)
    })
  }

  // ================================ 注册全局路由守卫 ================================
  Vue.mixin({ beforeRouteLeave })

  // ================================ 注册自定义指令 ================================
  Vue.directive('teleport', VTeleportDirective)
}

const CrmMobileCustomPlugin = {
  install: install
}

export default CrmMobileCustomPlugin
