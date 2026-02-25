import Vue from 'vue'
import GlobalLoading from '@/components/global-loading/global-loading.vue'

const LoadingConstructor = Vue.extend(GlobalLoading)

const instance = new LoadingConstructor({
  el: document.createElement('div')
})

const loading = {
  show() {
    instance.visible = true
    document.body.appendChild(instance.$el)
  },
  hide() {
    instance.visible = false
  },
  loadingStatus() {
    return instance.visible
  }
}

export default {
  install() {
    if (!Vue.prototype.$loading) {
      Vue.prototype.$loading = loading
    }
  }
}
