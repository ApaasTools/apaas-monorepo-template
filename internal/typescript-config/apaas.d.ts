/**
 * 得帆 APAAS 低代码平台常用类型声明
 * 覆盖组件内 this.* 全局方法（x-request / x-eventbus / x-storage 等插件注入）
 * 以及 FormWidgetConfigMixin 注入的表单组件 API
 */
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Dayjs } from 'dayjs'
import type { TranslateResult } from 'vue-i18n'

/**
 * 请求参数（x-request 插件）。
 * 注意：只接收 params，不接收 axios 的 data 字段——POST/PUT 的请求体也放在 params 里。
 */
export interface ApaasRequestOptions {
  /** 请求地址，如 '/api/user/list' */
  url: string
  /** 请求方法（仅 $request 需要指定，$post/$get 已内置） */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
  /** 请求参数：POST/PUT 时作为 Request Payload 请求体；GET 时作为 query；$upload 必须传 FormData */
  params?: any
  /** 请求头 */
  headers?: Record<string, any>
  /** 是否显示全局提示（成功/失败消息的总开关，默认 true） */
  needShowMessage?: boolean
  /** 设为 true 时请求成功后不弹全局成功提示 */
  disableSuccessMsg?: boolean
  /** 设为 true 时请求失败后不弹全局失败提示（自行 catch 处理错误） */
  disableErrorMsg?: boolean
  /** 请求超时时间（毫秒），透传给 axios */
  timeout?: number
  /** 响应数据类型，透传给 axios（如 'blob' 下载二进制时使用） */
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  /** 跨域请求是否携带 cookie，透传给 axios */
  withCredentials?: boolean
  /** 上传进度回调 */
  onUploadProgress?: (event: any) => void
  /** 下载进度回调 */
  onDownloadProgress?: (event: any) => void
  /**
   * 自定义业务校验函数：返回 true 视为业务成功（默认判断 response.code === '200' | 'ok'）
   */
  businessValid?: (response: any) => boolean
  /** 自定义业务数据转换函数，替换默认的 data.data / data.table 归一化逻辑 */
  businessTransform?: (data: any, response: any) => any
  /**
   * 自定义错误捕获：返回 true 时阻断系统默认的错误提示
   */
  errorCatch?: (err: any, needShowMessage: boolean) => boolean | void
  [key: string]: any
}

/** x-request 扩展的 Promise 链式方法（挂在所有请求返回的 Promise 上） */
export interface ApaasPromiseEnhancement<T = any> {
  /**
   * 链式 then：写法更平铺，等价于 .then(onResolve, onReject)，仍返回 Promise 可继续链式调用
   * @example
   * this.$request({ url, params })
   *   .asyncThen((res) => { /* 成功 *\/ }, (err) => { /* 失败 *\/ })
   */
  asyncThen(onResolve?: (value: any) => any, onReject?: (reason: any) => any): Promise<T>
  /**
   * 链式错误捕获：注册的错误处理函数会替代全局默认的错误提示弹窗
   * @example
   * this.$request({ url, params })
   *   .asyncErrorCatch((err) => { /* 自定义错误处理，不再弹全局提示 *\/ })
   */
  asyncErrorCatch(catchFunction?: (reason: any) => any): Promise<T>
}

/** 事件总线模糊匹配选项 */
export interface EventBusEmitOptions {
  /** 事件名匹配方式 */
  opt: 'STARTS_WITH' | 'INCLUDES' | 'ENDS_WITH'
}

/**
 * 事件总线（x-eventbus）
 *
 * @example
 * // 发送事件
 * this.$bus.$emit('event-name', { data: 'value' })
 *
 * @example
 * // 接收 / 一次性接收 / 取消监听
 * this.$bus.$on('event-name', (data) => { console.log(data) })
 * this.$bus.$once('event-name', (data) => {})
 * this.$bus.$off('event-name')
 *
 * @example
 * // 模糊匹配发送：向所有 'prefix_' 开头的事件发送
 * this.$bus.$emit('prefix_', payload, { opt: 'STARTS_WITH' })
 */
export interface ApaasEventBus {
  /** 监听事件 */
  $on(event: string, callback: (...args: any[]) => void): void
  /** 一次性监听，触发后自动取消 */
  $once(event: string, callback: (...args: any[]) => void): void
  /** 取消监听（不传 callback 则取消该事件名下所有监听） */
  $off(event?: string, callback?: (...args: any[]) => void): void
  /**
   * 发送事件
   * @param event    事件名
   * @param payload  携带的数据
   * @param options  可选，模糊匹配方式（STARTS_WITH / INCLUDES / ENDS_WITH）
   */
  $emit(event: string, payload?: any, options?: EventBusEmitOptions): void
}

/**
 * 表单构建引擎（x-business-form-build-engine，全局单例）
 *
 * @example
 * // 根据组件类型获取组件配置（返回深拷贝，修改不影响原配置）
 * const config = this.$formBuildEngine.getComponentConfigWithType('FORM_TEXT_INPUT')
 *
 * @example
 * // 获取完整的左侧组件布局配置（含 groupWidgetList）
 * const layoutList = this.$formBuildEngine.getWidgetLayouConfigWithComponentConfig()
 */
export interface FormBuildEngine {
  /**
   * 根据 componentType 获取组件配置（返回深拷贝，修改不影响原配置）。
   * type 为组件类型标识：内置取值如 'FORM_TEXT_INPUT'（文本）、'FORM_SELECT_INPUT'（下拉）、
   * 'FORM_DATEPICK_INPUT'（日期）、'FORM_PEOPLE_SELECT'（人员）、'FORM_WIDGET_SON_TABLE'（子表）等；
   * 自定义组件则为注册时自定义的字符串。
   */
  getComponentConfigWithType(type: string): any
  /** 获取左侧组件布局分组列表（含 groupWidgetList） */
  getWidgetLayouConfigWithComponentConfig(): any[]
  /** 根据 editorConfigType 获取编辑器配置 */
  getEditorConfigByType(type: string): any
  /**
   * 获取组件右侧属性编辑配置列表
   * @param excludeTable true 时排除表格内不支持的配置
   */
  getComponentEditorConfigByType(type: string, excludeTable?: boolean): any[]
  /** 在容器内生成带 UUID 的组件配置副本 */
  genenrateComponentConfigInContainer(config: any, type: string): any
  /** 注册组件配置对象 */
  registerComponentConfigObject(config: any): void
  /**
   * 注册组件的 widget / component / editor 各配置（用于把自定义字段组件接入表单设计器）。
   * type：自定义组件类型标识（自定字符串）；widget：左侧面板配置；
   * component：渲染的 Vue 组件；editor：右侧属性编辑面板配置。
   */
  registerComponentConfig(type: string, widget?: any, component?: any, editor?: any): void
  /** 注册左侧布局配置列表 */
  registerWidgetLayoutConfigList(list: any[]): void
  /** 注册编辑器配置列表 */
  registerEditorConfigList(list: any[]): void
  /**
   * Map 适配器（静态方法）：将数组或对象转为 [{ key, val }] 格式
   * @example this.$formBuildEngine.mapAdapter('key', propKey)
   */
  mapAdapter(...args: any[]): Array<{ key: string; val: any }>
  /** 事件映射：根据 'lc:'/'event:' 前缀解析 componentConfig.methods */
  mapEvent(...args: any[]): any
}

/**
 * 浏览器事件插件（x-bomevent）
 *
 * @example
 * // 监听原生浏览器事件（resize、scroll、keydown 等）
 * this.$bomEventPlugin.addBomEventListener('resize', this.handleResize)
 * this.$bomEventPlugin.removeBomEventListener('resize', this.handleResize)
 *
 * 注意：重复添加同名事件会触发 console.warn 警告，建议先 remove 再 add。
 */
export interface BomEventPlugin {
  /** 添加浏览器原生事件监听 */
  addBomEventListener(event: string, listener: (...args: any[]) => void): void
  /** 移除监听器；不传 listener 则移除该事件名下所有监听 */
  removeBomEventListener(event: string, listener?: (...args: any[]) => void): void
}

/**
 * 本地存储（x-storage / vue-ls）
 *
 * @example
 * this.$ls.set('key', value)
 * const val = this.$ls.get('key', defaultValue)
 * this.$ls.remove('key')
 */
export interface VueLsStorage {
  /** 读取本地存储，不存在时返回 def */
  get(key: string, def?: any): any
  /** 写入本地存储，expire 为过期时间（秒），可不传 */
  set(key: string, value: any, expire?: number): any
  /** 删除指定 key */
  remove(key: string): void
  /** 清空所有本地存储 */
  clear(): void
}

/** 表单组件配置（widget prop） */
export interface WidgetConfig {
  /** 组件唯一标识 */
  key?: string
  /** 组件类型，如 'FORM_TEXT_INPUT' */
  componentType?: string
  /** 组件标签名 */
  label?: string
  /** 组件选项配置 */
  options?: Record<string, any>
  /** 校验规则 */
  rules?: any[]
  [key: string]: any
}

/**
 * FormWidgetConfigMixin 注入到所有自开发表单组件的 API。
 * 写表单自开发组件时，让组件的接口/声明 extends 本接口即可获得提示。
 */
export interface FormWidgetMixinApi {
  /**
   * 当前组件值（可读写）
   *
   * @example
   * const val = this.formValue          // 读取
   * this.formValue = newValue           // 写入，自动触发校验与 $formEventEmit
   */
  formValue: any
  /** 当前表单引擎实例，等价于 this.renderGlobal() */
  formEngine: any
  /**
   * 是否禁用。
   * read/ide 场景，或 readonly / enableRule 生效时为 true
   */
  disabled: boolean
  /** 是否显示必填标识（required 且非 readonly） */
  showRequired: boolean
  /** 普通占位符 */
  placeholder: string
  /** IDE 场景占位符 */
  idePlaceholder: string
  /** 构建好的校验规则数组 */
  validatorRules: any[]
  /** 组件配置对象（必传 prop） */
  widget: WidgetConfig
  /** 渲染场景：'ide' 设计器 / 'edit' 编辑 / 'read' 只读 / 'widget' 组件 */
  renderScene: 'ide' | 'edit' | 'read' | 'widget'
  /** 当前表单数据 */
  formData?: Record<string, any>
  /** 全局表单数据 */
  globalFormData?: Record<string, any>
  /** 子表组件配置（在子表内时存在） */
  sonTableWidget?: WidgetConfig
  /** 表格 UUID（来自 widget 或 formData） */
  tableUuid?: string
  /** 排除表格数据后的表单数据 */
  formDataWithoutTableData?: Record<string, any>
  /** 脱敏按钮是否显示（数据脱敏场景） */
  isShowButton: boolean
  /**
   * 设置表单数据指定字段并触发 emit
   *
   * @example
   * // 用 $set 语义写入，可保证新增字段响应式
   * this.updatePropValue('fieldName', newValue)
   */
  updatePropValue(key: string, value: any): void
  /**
   * 生成校验器对象
   *
   * @example
   * this._validate('required', '必填字段', 'blur', false)
   * // type: 校验类型；trigger: 'blur' | 'change'；isI18n: message 是否国际化 key
   */
  _validate(type: string, message: string, trigger?: 'blur' | 'change', isI18n?: boolean): any
  /** 运行所有 validatorRules 进行校验 */
  validate(value: any): boolean | Promise<any>
  /**
   * 发射表单事件：同时发射 eventName 和 'formEventEmit'（带 metadata）
   * metadata 包含 { formId, instanceId, tableId, uuid, widgetType }
   *
   * @example this.$formEventEmit('change', { value: 'xxx' })
   */
  $formEventEmit(eventName: string, event?: any): void
  /** 将数组或对象转为 [{ key, val }] 格式（实际调用 $formBuildEngine.mapAdapter） */
  mapAdapter(...args: any[]): Array<{ key: string; val: any }>
  /** 事件映射，根据 'lc:'/'event:' 前缀解析 componentConfig.methods */
  mapEvent(...args: any[]): any
  /** 设置 formDataChanged 标志 */
  setFormDataChanged(value: boolean): void
  /** 清除校验状态 */
  clearValidate(): void
  /** 校验表格数据 */
  tableValidate(newValue: any): void
  /** 检查表格中数据是否被脱敏 */
  isTableMaskingData(): boolean
  /** 通过 action 获取并显示未脱敏的真实值 */
  showRealValue(): void
  /** 标题描述数组转文本 */
  titleDesArrToText(formData: Record<string, any>, arr: any[], abilityCode?: string): string
  /** 监听表单数据变更，处理标题描述和校验配置 */
  watchFormData(newValue: any, oldValue: any): void
  /** 对 formValue 添加深度监听，触发业务事件 */
  addBsUnwatch(): void
}

/**
 * APAAS 平台在 Vue.prototype 上注入的全局成员。
 * 组件内直接通过 this.$xxx 调用，来源插件见各成员注释。
 * @module apaas/vue-prototype
 */
export interface ApaasVuePrototype {
  /**
   * axios 实例（x-request 插件注入），可直接发起 HTTP 请求
   *
   * @example
   * this.$axios.get('/api/user/list')
   * this.$axios.post('/api/user/create', { name: 'test' })
   */
  $axios: AxiosInstance

  /**
   * POST 请求快捷方法（x-request），自动处理业务校验和错误提示
   *
   * @example
   * this.$post({
   *   url: '/api/user/list',
   *   params: { page: 1 }        // Request Payload
   * }).then(res => { /* res.data 为业务数据 *\/ })
   */
  $post<T = any>(options: ApaasRequestOptions): Promise<AxiosResponse<T>>

  /**
   * GET 请求快捷方法（x-request）
   *
   * @example
   * this.$get({
   *   url: '/api/user/detail',
   *   params: { id: '123' }
   * }).then(res => { /* 处理返回 *\/ })
   */
  $get<T = any>(options: ApaasRequestOptions): Promise<AxiosResponse<T>>

  /**
   * 通用请求方法（x-request），可指定 method
   *
   * @example
   * this.$request({
   *   url: '/api/user/update',
   *   method: 'put',
   *   params: { id: '123', name: 'test' }
   * })
   */
  $request<T = any>(options: ApaasRequestOptions): Promise<AxiosResponse<T>>

  /**
   * 下载文件（x-request），自动触发浏览器下载
   *
   * @example
   * this.$download({
   *   url: '/api/export/excel',
   *   params: { ids: [1, 2, 3] }
   * })
   */
  $download(options: ApaasRequestOptions): Promise<any>

  /**
   * 上传文件（x-request），params 必须为 FormData
   *
   * @example
   * const formData = new FormData()
   * formData.append('file', file)
   * this.$upload({ url: '/api/upload', params: formData })
   *   .then(res => { /* 上传成功 *\/ })
   */
  $upload<T = any>(options: { url: string; params: FormData }): Promise<AxiosResponse<T>>

  /** 事件总线（x-eventbus），支持 $on / $once / $off / $emit 与模糊匹配发送 */
  $bus: ApaasEventBus

  /**
   * dayjs 日期处理
   *
   * @example
   * this.$dayjs().format('YYYY-MM-DD HH:mm:ss')          // 格式化当前时间
   * this.$dayjs('2024-01-01', 'YYYY-MM-DD')              // 解析日期字符串
   * this.$dayjs().diff(this.$dayjs('2024-01-01'), 'day') // 计算时间差
   * this.$dayjs().add(7, 'day').format('YYYY-MM-DD')     // 加减时间
   */
  $dayjs: (date?: string | number | Date | Dayjs, format?: string) => Dayjs

  /**
   * lodash 工具库（x-lodash）
   *
   * @example
   * this.$lodash.cloneDeep(obj)               // 深拷贝
   * this.$lodash.debounce(this.doSearch, 300) // 防抖
   * this.$lodash.uniqBy(list, 'id')           // 去重
   * this.$lodash.get(obj, 'a.b.c', 'default')
   */
  $lodash: any

  /** 表单构建引擎（x-business-form-build-engine 全局单例），见方法级注释 */
  $formBuildEngine: FormBuildEngine

  /** 浏览器原生事件监听（x-bomevent），如 resize / scroll / keydown */
  $bomEventPlugin: BomEventPlugin

  /**
   * 本地存储（x-storage / vue-ls）
   * @example this.$ls.set('key', value); this.$ls.get('key')
   */
  $ls: VueLsStorage

  /**
   * Cookie 操作（x-storage / vue-cookies）
   *
   * @example
   * this.$cookies.set('token', 'xxx')
   * this.$cookies.get('token')
   * this.$cookies.remove('token')
   */
  $cookies: {
    /** 读取 Cookie，不存在返回 undefined */
    get(key: string): string | undefined
    /** 写入 Cookie */
    set(key: string, value: string, options?: any): void
    /** 删除 Cookie */
    remove(key: string): void
  }

  /**
   * Base64 编码 / 解码
   *
   * @example
   * this.$base64.encode('hello')  // 编码
   * this.$base64.decode('aGVsbG8=') // 解码
   */
  $base64: {
    /** Base64 编码 */
    encode(input: string): string
    /** Base64 解码 */
    decode(input: string): string
  }

  /**
   * 国际化翻译（vue-i18n）
   *
   * @example
   * // 模板中：{{ $t('message.hello') }}
   * const text = this.$t('message.hello')
   */
  $t(key: string, values?: Record<string, any>): TranslateResult

  /**
   * Element UI 消息提示
   *
   * @example
   * this.$message.success('保存成功')
   * this.$message.error('保存失败')
   */
  $message: any

  /**
   * Element UI 确认弹窗
   *
   * @example
   * this.$confirm('确认删除？', '提示', { type: 'warning' })
   *   .then(() => { /* 确认 *\/ })
   *   .catch(() => { /* 取消 *\/ })
   */
  $confirm(message: string, title?: string, options?: any): Promise<any>

  /**
   * Element UI 通知
   *
   * @example
   * this.$notify({ title: '成功', message: '操作完成', type: 'success' })
   */
  $notify: any

  /**
   * Element UI 加载遮罩
   *
   * @example
   * const loading = this.$loading({ fullscreen: true })
   * // 完成后调用 loading.close()
   */
  $loading(options?: any): { close(): void }

  /** 移动端安装配置（x-dcloud-page-mobile，仅移动端组件内可用） */
  $_installMobileOptions?: any

  /**
   * FormWidgetConfigMixin 注入的 API 索引。
   * 注意：这是文档入口，实际成员由 mixin 注入，请让组件声明 extends FormWidgetMixinApi。
   */
  FormWidgetMixinApi?: FormWidgetMixinApi
}

// x-request 插件对 Promise 原型的扩展：所有请求返回的 Promise 均可链式调用 asyncThen / asyncErrorCatch
declare global {
  interface Promise<T> extends ApaasPromiseEnhancement<T> {}
}
