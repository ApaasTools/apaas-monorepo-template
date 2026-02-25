const reqContext = require.context('./', true, /\.js$/)

const GlobalModals = reqContext.keys().map(reqContext)

const install = function(Vue) {
  // 判断是否安装
  if (install.installed) {
    return
  }
  install.installed = true
  GlobalModals.forEach(modal => {
    Vue.use(modal.default)
  })
}

export default {
  install
}
