/*
 * @Author: your name
 * @Date: 2020-09-18 19:56:33
 * @LastEditTime: 2020-09-21 15:05:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-workspace/packages/xdap-h5/src/components/global-modal/function-update-modal/index.js
 */
import FunctionUpdateModal from './function-update-modal.vue'
import i18n from '@/locale/index'

FunctionUpdateModal.install = (Vue) => {
  const ModalConstructor = Vue.extend(FunctionUpdateModal)
  const instance = new ModalConstructor({
    i18n
  })

  Vue.prototype.$funcUpdate = {
    openModal() {
      if (!instance.$data.visible) {
        instance.openModal()
        document.body.appendChild(instance.$mount().$el)
      }
    },
    closeModal() {
      instance.closeModal()
      document.body.removeChild(instance.$mount().$el)
    }
  }
}

export default FunctionUpdateModal
