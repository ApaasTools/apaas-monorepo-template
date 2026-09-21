import 'vue'
import type { ApaasVuePrototype, FormWidgetMixinApi } from './apaas'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// 扩展 Vue 实例：组件内 this.$post / this.$bus 等获得类型提示
declare module 'vue/types/vue' {
  interface Vue extends ApaasVuePrototype {}
}

// 同时扩展类形式（Vue 2 的 this 类型有时走 Vue 类声明）
declare module 'vue' {
  interface Vue extends ApaasVuePrototype {}
}
