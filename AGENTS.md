# AGENTS.md

本仓库是基于得帆 APAAS 低代码平台的前端自开发模板（Vue 2 + Element UI + pnpm monorepo + turbo），平台包以微前端模块形式接入。本文件说明项目结构、平台注入的可用 API 与组件，供 AI 开发时参考，不要凭空猜测 API。

## 项目结构与模块开发

```
apps/                              # 微前端模块，每个模块独立打包部署到平台
├── apaas-custom-components/       # 自开发组件（表单内嵌组件，注册到 customWidgetList）
├── apaas-custom-pages/            # 自开发页面（含路由）
├── apaas-custom-list/             # 自定义列表/搜索视图
├── apaas-custom-layout/           # 自定义布局
├── apaas-custom-mobile-components/ # 移动端自开发组件
└── apaas-custom-mobile-pages/     # 移动端自开发页面
```

每个模块根目录有 **apaas.json**（平台模块清单，核心配置）：

- `entry`：模块入口（如 `src/index.ts`）
- `outputName`：构建输出名
- `customWidgetList`：自开发组件注册表，`code` 必须与组件注册名一致，平台按 code 挂载组件
- 页面类模块还有 `router` 配置，路由名必须与组件名匹配

模块内结构约定：`src/index.ts` 入口、`src/components/`（或 `src/pages/`）业务组件、`src/i18n/` 国际化、`src/utils/` 工具。

新增自开发组件的标准流程：在 `src/components/` 下创建组件 → 在该模块 `apaas.json` 的 `customWidgetList` 中注册（code/text）→ 在 `src/index.ts` 导出组件。

## 常用命令

```bash
pnpm dev:comp / dev:page / dev:list / dev:layout   # 对应模块开发调试
pnpm dev:web / dev:h5                              # web / 移动端整体调试
pnpm build:comp / build:page / build:list / build:layout  # 模块打包（产物用于上传平台）
pnpm lint / pnpm format                            # biome 检查与格式化
```

## 组件内可用 API（this.\*，平台通过 Vue 插件注入 Vue.prototype）

### 网络请求

```js
this.$request({ url, method, params })   // 通用请求
this.$axios                              // axios 实例
this.$post({ url, params })              // POST，自动处理业务校验与错误提示
this.$get({ url, params })               // GET
this.$download({ url, params })          // 文件下载，自动触发浏览器下载
this.$upload({ url, params: formData })  // 文件上传，params 必须是 FormData
```

### 事件总线

```js
this.$bus.$emit('event-name', payload)
this.$bus.$on('event-name', fn)   // 还有 $once / $off
this.$bus.$emit('prefix_', payload, { opt: 'STARTS_WITH' })  // 模糊匹配：STARTS_WITH / INCLUDES / ENDS_WITH
```

### Element UI 弹窗与提示（Vue2 自动可用）

```js
// ⚠️ 消息提示：快捷方法只有 error 可用！success/warning/info 必须用对象写法
this.$message.error('操作失败')                        // ✅ 唯一可用的快捷方法
this.$message({ type: 'success', message: '成功' })    // ✅ 对象写法
this.$message.success('成功')                          // ❌ 项目中不可用，勿用

this.$confirm('确定删除吗?', '提示', { type: 'warning' }).then(() => {}).catch(() => {})
this.$alert('内容', '标题', { confirmButtonText: '确定' })
this.$notify({ title: '成功', message: '操作完成', type: 'success' })

const loading = this.$loading({ text: '加载中...' })
loading.close()
```

### 日期与工具库

```js
this.$dayjs     // dayjs 实例：this.$dayjs().format('YYYY-MM-DD HH:mm:ss')、diff、add 等
this.$lodash    // lodash：cloneDeep、debounce、uniqBy、get、merge、pick、omit 等
```

### 表单构建引擎（单例）

```js
this.$formBuildEngine.getComponentConfigWithType('FORM_TEXT_INPUT')        // 组件类型 → 组件配置（返回深拷贝）
this.$formBuildEngine.getWidgetLayouConfigWithComponentConfig()            // 左侧组件布局配置
this.$formBuildEngine.getEditorConfigByType(type)                          // 编辑器配置
this.$formBuildEngine.getComponentEditorConfigByType(type, excludeTable)   // 组件右侧属性编辑配置
this.$formBuildEngine.genenrateComponentConfigInContainer(config, type)    // 生成带 UUID 的组件配置副本
```

### 存储

```js
this.$ls.set('key', value)                                   // vue-ls，默认 localStorage
this.$ls.get('key', defaultValue) / remove('key') / clear()
this.$ls.on('key', callback) / off('key', callback)          // 监听 key 变化
this.$cookies.set('key', 'value') / get('key') / remove('key') / isKey('key') / keys()   // cookie 读写
```

### 浏览器原生事件监听

```js
this.$bomEventPlugin.addBomEventListener('resize', handler)     // 监听原生事件
this.$bomEventPlugin.removeBomEventListener('resize', handler)  // 重复添加同名事件会 warn，先 remove 再 add
```

### Base64 编码

```js
this.$base64.encode(obj)   // 将对象（常为请求参数）编码为 base64 字符串
```

### 移动端专属

```js
this.$_installMobileOptions   // 移动端安装配置
```

### this.\$root（访问挂载在 Vue 上的静态属性）

```js
this.$root.lodash / this.$root.axios
this.$root.post / get / request / download / upload        // 与 this.$post 等同源
this.$root.ls.set('key', value) / this.$root.$cookies.get('key')
this.$root._formBuildEngine / this.$root._bus
```

### 国际化

```js
this.$t('common.save')     // 翻译
this.$i18n.locale          // 当前语言
```

## 自开发表单组件（FormWidgetConfigMixin 注入）

所有自开发表单组件通过 mixin 自动注入以下能力：

- **inject**：`renderGlobal`（渲染上下文）
- **关键 computed**：
  - `formValue`：读写当前组件值，自动触发校验与 `$formEventEmit`
  - `formEngine`：当前表单引擎实例
  - `disabled`：是否禁用（read/ide 场景或 readonly/enableRule）
  - `showRequired`：是否显示必填标识
  - `placeholder` / `idePlaceholder`
- **关键 props**：
  - `widget`：组件配置对象（必填）
  - `renderScene`：渲染场景，`'ide'` / `'edit'` / `'read'` / `'widget'`（必填）
  - `formData` / `globalFormData`：表单数据 / 全局表单数据
  - `sonTableWidget`：子表组件配置
  - `validateInfo` / `validateKey`：校验信息

## 平台可用组件

- **表单设计**：`XFormDesign` / `XFormDesignCombine` / `XPublicFormSetting` / `XPublicFormView`
- **表单查看/编辑**：`XFormReadDrawer` / `XFormCombineReadDrawer` / `XFormEditModal` / `XFormEditDebugDrawer`
- **字段类**：`XProxyFormItem` / `XLovInput` / `XSelectPersonInput` / `XSelectPersonDropdown` / `XI18nInput` / `XI18nPopover` / `XHelpTooltip` / `XBadge` / `XInputMoney` / `XInputPhone`
- **流程**：`XProcessStatus` / `XProcessStatusCard`
- **数据展示**：`XHttpBlockTable` / `XTableStatisticalCell` / `XSonTableLogsModal` / `XDateFormatModal`
- **文件**：`FormUploadModal` / `UploadFileTable`
- **UI 库**：`x-dcloud-ui`（PC，Element UI 二次封装）、`x-dcloud-mui`（移动端）、`x-lib-ui`（基础）、`x-guard`（监控仪表盘）

引擎与控制器：`FormEngine` / `ListEngine` / `LayoutEngine` / `BiEngine`；控制器 `ButtonControl` / `NetworkControl` / `WidgetControl` / `RenderLogicControl` / `ExtendControl`。

## 使用规则

1. **优先使用平台的 UI 组件**（上文"平台可用组件"及 Element UI），禁止自己手写实现已有等价能力的 UI。写代码前先确认平台是否已有现成组件：弹窗用 `XFormEditModal`、只读展示用 `XFormReadDrawer`、用户选择用 `XSelectPersonInput`、国际化输入用 `XI18nInput`、文件上传用 `FormUploadModal` 等，不要用原生 div/input 拼装这些功能。
2. 消息与确认交互统一用 Element UI：提示用 `this.$message`（success/warning/info 必须对象写法）、确认用 `this.$confirm`，不要引入其他弹窗库或手写 toast。
3. 技术栈为 Vue 2 + Element UI，勿使用 Vue 3 / Composition API 语法。
4. 平台 API 以本文件为准；如有出入，查 node\_modules 内 `@x-apaas` / `@x-ui` 包源码确认。
5. 不确定某 API 是否存在时，先在本项目或 node\_modules 中 grep 验证再使用。
6. 提交信息用中文 conventional commit（feat/fix/chore/refactor 带中文描述）。
7. 组件注册名与 apaas.json 中的 code 必须完全一致，否则平台挂载不到组件；这是最常见的新组件不显示问题。

