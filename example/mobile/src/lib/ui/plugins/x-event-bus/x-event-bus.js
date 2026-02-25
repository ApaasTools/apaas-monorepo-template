/*
 * @Author: your name
 * @Date: 2021-03-24 19:13:25
 * @LastEditTime: 2021-03-24 19:21:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /XUI/x-dcloud-page-mobile/packages/lib/ui/plugins/x-event-bus/x-event-bus.js
 */
import mitt from 'mitt'

const install = function(Vue, opts) {
  const emitter = mitt()

  var emit = function(key, ...args) {
    emitter.emit(key, ...args)
  }

  var on = function(key, callback) {
    emitter.on(key, callback)
  }

  var off = function(key, callback) {
    emitter.off(key, callback)
  }

  Vue.prototype.$XEventBus = {
    emit,
    on,
    off
  }
}

const XEventBusPlugin = {
  install: install
}

export default XEventBusPlugin
