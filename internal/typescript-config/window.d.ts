/**
 * 得帆 APAAS 平台运行时注册在 window 上的常用值 / 方法声明。
 * 以下成员均从 packages 源码中确认存在，供自开发代码直接通过 window.xxx 调用。
 */
declare global {
  interface Window {
    /**
     * 平台全局环境变量对象（page-engine 挂载），由后端/部署环境注入。
     * 常用字段见下方声明，完整字段以运行时为准。
     *
     * @example
     * window.GLOBAL_ENV?.VUE_APP_APP_ID
     * window.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.LIST_TABLE_OPERATION_ASYNC
     */
    GLOBAL_ENV?: {
      /** 当前应用 ID，如 'workbench' */
      VUE_APP_APP_ID?: string
      /** 自定义环境配置对象（平台大量业务开关都放在这里），常用字段见下方声明 */
      VUE_APP_CUSTOM_ENV?: {
        /** 是否抑制表格列虚拟滚动 */
        VUE_APP_SUPPRESS_TABLE_COLUMN_VIRTUAL?: boolean
        /** 查询消息的时间间隔/边界配置 */
        VUE_APP_QUERY_MESSAGE_TIME?: number
        /** 摄像头服务地址（拍照/扫描类组件使用） */
        VUE_APP_CAMERA_SERVICE?: string
        /** 列表表格操作是否异步化 */
        LIST_TABLE_OPERATION_ASYNC?: boolean
        [key: string]: any
      }
      /** 部门展示层级 */
      VUE_APP_DEPARTMENT_DISPLAY_LEVEL?: number
      /** 人员搜索边界值（超过则不精确搜索） */
      PEOPLE_SEARCH_BOUNDARY_VALUE?: number
      /** 部门搜索边界值 */
      DEPARTMENT_SEARCH_BOUNDARY_VALUE?: number
      /** 审批完成图标配置 */
      VUE_APP_COMPLETE_APPROVAL_ICON?: any
      /** 上传文件大小上限 */
      VUE_APP_UPLOAD_MAX_SIZE?: number
      /** 是否开启图片预览 */
      VUE_APP_PICTURE_PREVIEW?: boolean
      /** 主题版本 */
      VUE_APP_THEME_VERSION?: string
      /** 触发限制开关 */
      VUE_APP_TRIGGER_LIMIT_FLAG?: boolean
      /** 编辑抽屉直出开关 */
      VUE_APP_EDIT_DRAWER_DIRECT?: boolean
      [key: string]: any
    }

    /**
     * XSS 过滤函数（xss 库），清洗用户输入 / 富文本
     * @example const safe = window.filterXSS?.(dirtyHtml)
     */
    filterXSS?: (input: string) => string

    /** CSS 过滤函数，清洗样式内容 */
    filterCSS?: (input: string) => string

    /**
     * 高精度数字库 BigNumber（规则引擎内置），金额 / 精度计算用
     * @example const sum = new window.BigNumber(0.1).plus(0.2).toString()
     */
    BigNumber?: any

    /**
     * 扩展缓存数据库（x-extension），extensionCacheDB 为缓存读写入口
     * @example window.$extensionDB?.extensionCacheDB
     */
    $extensionDB?: { extensionCacheDB?: any; [key: string]: any }

    /** 省份地区缓存数据（地区选择组件加载后存在） */
    $getAllProvinceCache?: any

    /**
     * APAAS SDK：在非 Vue 上下文（如原生 JS、微前端子应用）获取全局状态
     * @example window.APaaSSDK?.context.globalVueContext.$store
     */
    APaaSSDK?: {
      context: {
        globalVueContext: {
          $store: any
          $root: Record<string, any>
          $router: any
        }
        globalVueI18n: any
        [key: string]: any
      }
    }
  }
}

export {}
