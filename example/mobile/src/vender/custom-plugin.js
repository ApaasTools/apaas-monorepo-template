import Vue from 'vue'

const initEnvUrl = () => {
  Vue.prototype.$envUrl = function(url) {
    return `${process.env.VUE_APP_PUBLIC_PATH}${url}`
  }
}

initEnvUrl()
