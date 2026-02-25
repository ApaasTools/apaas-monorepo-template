# aPaaSSDK介绍

在得帆低代码平台的开发中，我们封装了可供自开发使用的前端SDK——APaaSSDK，并将其挂载到window和lowCodeContext中，在自开发过程中可以通过使用APaaSSDK来调用系统封装好的的API。

## aPaaSSDK使用

我们在平台项目中将APaaSSDK封装到了window中，在应用项目中将APaaSSDK封装到了window和lowCodeContext中，封装在window的使用场景主要是在自开发项目中，比如：自开发页面、自开发组件等，而封装在lowCodeContext主要用于业务事件的自定义弹窗、自定义节点和列表虚拟字段自定义样式。两种封装方式的调用方式如下：

这两种调用方式结果一致，只是使用场景不同，下面的示例中只展示其中一种

**注：aPaaSSDK仅可查询，不可新增修改删除！**

```javascript
window.APaaSSDK
lowCodeContext.APaaSSDK
```

## APaaSSDK的API介绍及使用

### 基础

#### 路由

**调用方式**
```javascript
window.APaaSSDK.context.globalVueContext.$router
lowCodeContext.APaaSSDK.globalVueContext.$router
```

**功能描述**
获取到系统Vue对象的路由

**代码示例**

添加路由拦截
在路由中新增一个路由拦截，控制路由跳转

```javascript
window.APaaSSDK.context.globalVueContext.$router.beforeEach((to, from, next)=> {
    if(to.path === '/account/login'){
        console.log("路由拦截了！")
    }
    next()
})
```

路由跳转
```javascript
window.APaaSSDK.context.globalVueContext.$router.push("/342250108298985473/admin/app-store/list")
```

#### store状态管理

**调用方式**
```javascript
window.APaaSSDK.context.globalVueContext.$store
lowCodeContext.APaaSSDK.globalVueContext.$store
```

**功能描述**
用于获取系统的store状态管理

### 平台

| 字段 | 类型 | 说明 |
|------|------|------|
| appListModule | Object | 应用列表模块 |
| &nbsp;&nbsp;∟ appList | Array | 应用列表 |
| appModule | Object | 应用模块 |
| &nbsp;&nbsp;∟ configInfo | Object | 配置信息 |
| authModule | Object | 身份信息模块 |
| &nbsp;&nbsp;∟ adminAuth | Object | |
| &nbsp;&nbsp;∟ orgs | Array | 可切换的租户列表 |
| &nbsp;&nbsp;∟ platformBlock | Object | token |
| &nbsp;&nbsp;∟ tenantBlock | Object | token |
| &nbsp;&nbsp;∟ userInfo | Object | 用户信息 |
| &nbsp;&nbsp;∟ wxInfo | Object | 微信信息 |
| authorityModule | Object | 权限模块 |
| &nbsp;&nbsp;∟ appStore | Object | |
| &nbsp;&nbsp;∟ authorityInterfaceList | Boolean | 当前用户拥有的权限 |
| &nbsp;&nbsp;∟ authorityMenuList | Boolean | 当前用户拥有的菜单权限 |
| tenantModule | Object | 租户模块 |
| &nbsp;&nbsp;∟ currentOrg | Object | 当前租户的信息 |
| &nbsp;&nbsp;∟ department | Object | 部门信息 |
| &nbsp;&nbsp;∟ isOnLine | Boolean | |
| &nbsp;&nbsp;∟ isShowBusinessEvent | Boolean | 业务事件插件是否开启 |
| &nbsp;&nbsp;∟ isShowDataDevelopment | Boolean | 数据开发插件是否开启 |
| &nbsp;&nbsp;∟ isShowI18nManage | Boolean | 国际化插件是否开启 |
| &nbsp;&nbsp;∟ isShowIPaaS | Boolean | iPaaS服务集成插件是否开启 |
| &nbsp;&nbsp;∟ isShowJobSchedule | Boolean | |
| &nbsp;&nbsp;∟ isShowParamsEncrypt | Boolean | |
| &nbsp;&nbsp;∟ isShowProblemManagement | Boolean | 问题管理插件是否开启 |
| &nbsp;&nbsp;∟ isShowResourceManag | Boolean | |
| &nbsp;&nbsp;∟ orgLogoPluginStatus | Boolean | 用户logo插件是否开启 |
| &nbsp;&nbsp;∟ processStatusNameList | Object | 审批状态对象 |
| &nbsp;&nbsp;∟ xdaptenantversion | String | |
| themeModule | Object | 主题模块 |
| &nbsp;&nbsp;∟ roleList | Array | 角色列表 |
| &nbsp;&nbsp;∟ theme | Object | 主题样式 |

### Web应用

| 字段 | 类型 | 说明 |
|------|------|------|
| adminModule | Object | 管理员模块 |
| &nbsp;&nbsp;∟ menuCode | String | |
| appModule | Object | 应用模块 |
| &nbsp;&nbsp;∟ configInfo | Object | 配置信息 |
| associateModule | Object | |
| &nbsp;&nbsp;∟ assocateInstanceList | Array | |
| authModule | Object | 身份信息模块 |
| &nbsp;&nbsp;∟ adminAuth | Object | |
| &nbsp;&nbsp;∟ departmentInfo | Object | 部门信息 |
| &nbsp;&nbsp;∟ identityInfo | Object | |
| &nbsp;&nbsp;∟ orgs | Array | 可切换的租户列表 |
| &nbsp;&nbsp;∟ oriToken | String | 单点token |
| &nbsp;&nbsp;∟ platformBlock | Object | 平台模块token |
| &nbsp;&nbsp;∟ tenantBlock | Object | 租户模块token |
| &nbsp;&nbsp;∟ token | String | token |
| &nbsp;&nbsp;∟ userInfo | Object | 用户信息 |
| &nbsp;&nbsp;∟ weComInfo | Object | 企微信息 |
| &nbsp;&nbsp;∟ wxInfo | Object | 微信信息 |
| fontModule | Object | 字体模块 |
| &nbsp;&nbsp;∟ fontConfig | Array | |
| printModule | Object | 打印模块 |
| &nbsp;&nbsp;∟ configParams | Object | |
| &nbsp;&nbsp;∟ formDatas | Object | |
| &nbsp;&nbsp;∟ formItemLists | Object | |
| publicFormModule | Object | |
| &nbsp;&nbsp;∟ publicConfig | Object | |
| &nbsp;&nbsp;∟ shareButton | Object | |
| &nbsp;&nbsp;∟ shareConfig | Object | |
| &nbsp;&nbsp;∟ shareFormConfig | Object | |
| &nbsp;&nbsp;∟ sharePayload | Object | |
| tenantModule | Object | 租户模块 |
| &nbsp;&nbsp;∟ currentOrg | Object | 当前租户的信息 |
| &nbsp;&nbsp;∟ department | Object | 部门信息 |
| &nbsp;&nbsp;∟ env | Object | |
| &nbsp;&nbsp;∟ isOnLine | Boolean | |
| &nbsp;&nbsp;∟ orgLogoPluginStatus | Boolean | 用户logo插件是否开启 |
| &nbsp;&nbsp;∟ processStatusNameList | Object | 审批状态对象 |
| &nbsp;&nbsp;∟ publicFormConfig | Object | |
| &nbsp;&nbsp;∟ xdapplatform | String | |
| &nbsp;&nbsp;∟ xdaptenantversion | String | |
| themeModule | Object | 主题模块 |
| &nbsp;&nbsp;∟ roleList | Array | 角色列表 |
| &nbsp;&nbsp;∟ theme | Object | 主题样式 |

### 移动端应用

| 字段 | 类型 | 说明 |
|------|------|------|
| adminModule | Object | 管理员模块 |
| &nbsp;&nbsp;∟ menuCode | String | |
| appModule | Object | 应用模块 |
| &nbsp;&nbsp;∟ appInfo | Object | 配置信息 |
| authModule | Object | 身份信息模块 |
| &nbsp;&nbsp;∟ accountInfo | Object | 账号信息 |
| &nbsp;&nbsp;∟ adminAuth | Object | |
| &nbsp;&nbsp;∟ commentPluginStatus | Boolean | 评论插件是否开启 |
| &nbsp;&nbsp;∟ departmentInfo | Object | 部门信息 |
| &nbsp;&nbsp;∟ identityInfo | Object | |
| &nbsp;&nbsp;∟ messageNumber | Number | 消息数 |
| &nbsp;&nbsp;∟ orgs | Array | 可切换的租户列表 |
| &nbsp;&nbsp;∟ oriToken | String | 单点token |
| &nbsp;&nbsp;∟ platformBlock | Object | 平台模块token |
| &nbsp;&nbsp;∟ shareConfig | Object | 分享配置 |
| &nbsp;&nbsp;∟ tenantBlock | Object | 租户模块token |
| &nbsp;&nbsp;∟ token | String | token |
| &nbsp;&nbsp;∟ userInfo | Object | 用户信息 |
| &nbsp;&nbsp;∟ weComInfo | Object | 企微信息 |
| &nbsp;&nbsp;∟ wxInfo | Object | 微信信息 |
| compRouterModule | Object | |
| &nbsp;&nbsp;∟ compPayload | Object | |
| departmentModule | Object | 部门模块 |
| &nbsp;&nbsp;∟ navMenu | Array | |
| &nbsp;&nbsp;∟ selectedArray | Array | |
| fontModule | Object | 字体模块 |
| &nbsp;&nbsp;∟ fontConfig | Array | |
| formModule | Object | |
| &nbsp;&nbsp;∟ formConfigMap | Object | |
| oauthModule | Object | 单点模块 |
| &nbsp;&nbsp;∟ openId | String | |
| &nbsp;&nbsp;∟ unionId | String | |
| profileModule | Object | |
| &nbsp;&nbsp;∟ currentField | Object | |
| publicFormModule | Object | |
| &nbsp;&nbsp;∟ publicConfig | Object | |
| &nbsp;&nbsp;∟ shareButton | Object | |
| &nbsp;&nbsp;∟ shareConfig | Object | |
| &nbsp;&nbsp;∟ shareFormConfig | Object | |
| &nbsp;&nbsp;∟ sharePayload | Object | |
| selectPeopleModule | Object | |
| &nbsp;&nbsp;∟ navMenu | Array | |
| &nbsp;&nbsp;∟ selectedArray | Array | |
| tenantModule | Object | 租户模块 |
| &nbsp;&nbsp;∟ currentOrg | Object | 当前租户的信息 |
| &nbsp;&nbsp;∟ department | Object | 部门信息 |
| &nbsp;&nbsp;∟ orgLogoPluginStatus | Boolean | 用户logo插件是否开启 |
| &nbsp;&nbsp;∟ tempTenant | Object | 审批状态对象 |
| &nbsp;&nbsp;∟ todoNumber | Number | 待办数 |
| &nbsp;&nbsp;∟ xdapplatform | String | |
| &nbsp;&nbsp;∟ xdaptenantversion | String | |
| themeModule | Object | 主题模块 |
| &nbsp;&nbsp;∟ roleList | Array | 角色列表 |
| &nbsp;&nbsp;∟ theme | Object | 主题样式 |

**示例**
```javascript
// 获取当前登录用户的用户信息
window.APaaSSDK.context.globalVueContext.$store.state.authModule.userInfo
```

### 环境变量

#### 系统环境变量

**调用方式**
```javascript
window.APaaSSDK.context.globalEnv
lowCodeContext.APaaSSDK.globalEnv
```

**功能描述**
用于获取环境变量

**示例**
```javascript
// 请求域名
window.APaaSSDK.context.globalEnv.VUE_APP_BASE_DOMAIN
// 单点登录url
window.APaaSSDK.context.globalEnv.VUE_APP_SSO_URL
```

更多环境变量可以通过浏览器接口查看，然后通过上面的方法再获取

### 平台环境变量

| 环境变量 | 类型 | 说明 |
|----------|------|------|
| VUE_APP_BASE_DOMAIN | String | 请求url前缀 |
| VUE_APP_DEFAULT_LOGOUT_URL | String | 默认登出URL |
| VUE_APP_NEED_SSO | String | 是否需要单点登录，可选值"ENABLE"、"DISABLE" |
| VUE_APP_SSO_URL | String | 单点登录URL |
| VUE_APP_PLATFORM_CLIENT_ID | String | |
| VUE_APP_BACKEND_CLIENT_ID | String | |
| VUE_APP_SSO_SCOPE | String | 单点登录SCOPE |
| VUE_APP_SSO_LOGOUT_URL | String | 单点登录注销地址 |
| VUE_APP_EXTENSION_LIST_URL | String | 平台自开发资源列表接口 |
| VUE_APP_EXTENSION_CONFIG_URL | String | 平台自开发资源获取接口 |
| VUE_APP_ACCOUNT_VALIDAT_RULE | String | 账号校验规则 |
| VUE_APP_ACCOUNT_VALIDAT_MASSAGE | String | 账号校验提示文本 |
| VUE_APP_PASSWORD_VALIDAT_RULE | String | 密码校验规则 |
| VUE_APP_PASSWORD_VALIDAT_MASSAGE | String | 密码校验提示文本 |
| IE_INCOMPATIBLE_PROMPT | String | IE浏览器版本低提示文本 |
| VUE_APP_ENCRYPT_CODE | String | |
| VUE_APP_THEME_VARIABLE_PATH | String | |
| VUE_APP_COMPLETE_APPROVAL_ICON | String | |
| VUE_APP_SENTRY_STATUS | String | |
| VUE_APP_SENTRY_DSN | String | |
| VUE_APP_SENTRY_ENVIRONMENT | String | |
| VUE_APP_SENTRY_APP_NAME | String | |
| VUE_APP_SENTRY_APP_CODE | String | |
| VUE_APP_SENTRY_TRACES_SAMPLERATE | String | |
| VUE_APP_SENTRY_END_TYPE | String | |
| VUE_APP_PLATFORM_DOCUMENT_TITLE | String | 平台管理浏览器标题 |
| VUE_APP_ADMIN_DOCUMENT_TITLE | String | 后台管理浏览器标题 |
| VUE_APP_MENU_BLACK_LIST | String | |
| VUE_APP_CUSTOM_PACKAGE_SIZE | Number | 自开发包上传大小限制(单位M) |
| VUE_APP_SM2_ENCRYPT_TYPE | String | |
| VUE_APP_SM2_PUBLIC_KEY | String | |
| VUE_APP_SM2_PRIVATE_KEY | String | |
| VUE_APP_UPLOAD_MAX_SIZE | Number | 附件上传的最大限制大小(单位M) |
| VUE_DEPT_DISPLAY_MAX_SIZE | Number | |

### 应用环境变量

| 环境变量 | 类型 | 说明 |
|----------|------|------|
| VUE_APP_BASE_DOMAIN | String | 请求url前缀 |
| VUE_APP_PUBLIC_PATH | String | （Web应用） |
| VUE_APP_PUBLIC_PATH_M | String | （Web应用） |
| VUE_APP_DEFAULT_LOGOUT_URL | String | 默认登出URL |
| VUE_APP_TENANT_ID | String | 租户Id |
| VUE_APP_TENANT_CODE | String | |
| VUE_APP_APP_ID | String | appId |
| VUE_APP_APP_CODE | String | |
| VUE_APP_V_CONSOLE | String | 是否开启V-Console调试器，可选值"ENABLE"、"DISABLE" |
| VUE_APP_NEED_SSO | String | 是否需要单点登录，可选值"ENABLE"、"DISABLE" |
| VUE_APP_SSO_URL | String | 单点登录URL |
| VUE_APP_WORKBENCH_CLIENT_ID | String | |
| VUE_APP_CLIENT_ID | String | |
| VUE_APP_SSO_SCOPE | String | 单点登录SCOPE |
| VUE_APP_SSO_LOGOUT_URL | String | 单点登录注销地址 |
| VUE_APP_MOBILE_DEFAULT_LOGOUT_URL | String | （移动端） |
| VUE_APP_REDIRECT_URL | String | 单点登录重定向URL |
| VUE_APP_DOCUMENT_TITLE | String | 浏览器标题 |
| VUE_APP_CUSTOM_ENV | Object | 自定义环境变量 |
| VUE_APP_POST_MESSAGE_SUBSCRIBER | Object | Iframe消息传递 |
| &nbsp;&nbsp;∟ GET_CURRENT_PAGE_HEIGHT | Object | 获取iframe审批页面的订阅code |
| &nbsp;&nbsp;∟ GET_IFRAME_APPROVAL_PAGE_HEIGHT | Object | 获取iframe审批页面的订阅code |
| IE_INCOMPATIBLE_PROMPT | String | IE浏览器版本低提示文本（Web应用） |
| VUE_APP_ENCRYPT_CODE | String | |
| VUE_APP_COMPLETE_APPROVAL_ICON | String | |
| VUE_APP_H5_NAV_BAR_STATUS | String | （移动端） |
| VUE_WORKBENCH_H5_NAV_BAR_STATUS | String | （移动端） |
| VUE_APP_H5_APPROVE_HIST_TAB_VIEW | String | （移动端） |
| VUE_APP_IGNORE_AUTO_CALC_THEME_COLOR | String | （Web应用） |
| VUE_APP_THEME_VARIABLE_PATH | String | （Web应用） |
| VUE_APP_SENTRY_STATUS | String | |
| VUE_APP_SENTRY_DSN | String | |
| VUE_APP_SENTRY_END_TYPE | String | |
| VUE_APP_SENTRY_ENVIRONMENT | String | |
| VUE_APP_SENTRY_APP_NAME | String | |
| VUE_APP_SENTRY_APP_CODE | String | |
| VUE_APP_SENTRY_TRACES_SAMPLERATE | String | |
| VUE_APP_DOCUMENT_PREFIX_TITLE_STATUS | String | |
| VUE_APP_SM2_ENCRYPT_TYPE | String | |
| VUE_APP_SM2_PUBLIC_KEY | String | |
| VUE_APP_SM2_PRIVATE_KEY | String | |
| VUE_APP_SM2_ENCRYPTION_STATUS | String | |
| VUE_APP_MENU_BLACK_LIST | String | |
| VUE_APP_UPLOAD_MAX_SIZE | String | 附件上传的最大限制大小(单位M) |
| VUE_APP_PICTURE_PREVIEW | String | （Web应用） |
| VUE_APP_SON_TABLE_SIZE_LIMIT | String | （Web应用） |
| VUE_APP_EDIT_DRAWER_DIRECT | String | （Web应用） |
| PEOPLE_SEARCH_BOUNDARY_VALUE | String | |
| DEPARTMENT_SEARCH_BOUNDARY_VALUE | String | |
| FRONT_REQUEST_TIMEOUT | String | 请求超时时间 |
| VUE_APP_COMPATIBLE_WITH_IE11 | String | 是否能在IE11运行，可选值为"TRUE"、"FALSE"（Web应用） |
| TENANT_ORG_LOGO_URL | String | 租户自定义logoURL（Web应用） |

#### 应用环境变量

**调用方式**
仅在应用中可用，平台中不可用
```javascript
window.APaaSSDK.context.appSettingEnv
lowCodeContext.APaaSSDK.appSettingEnv
```

**功能描述**
用于获取应用环境变量，要先在后台管理-应用管理-高级设置-环境变量配置后才能获取到

**示例**
```javascript
// 获取浏览器标题名称
window.APaaSSDK.context.appSettingEnv.VUE_APP_DOCUMENT_TITLE
```

### 国际化

**调用方式**
```javascript
// 获取国际化对象
window.APaaSSDK.context.globalVueI18n.getVueI18N()
lowCodeContext.APaaSSDK.globalVueI18n.getVueI18N()
// 增加新的国际化字段或覆盖已有的国际化字段
window.APaaSSDK.context.globalVueI18n.mergeLocaleMessage(locale, messages)
lowCodeContext.APaaSSDK.globalVueI18n.mergeLocaleMessage(locale, messages)
```

**功能描述**
可以获取到系统的国际化对象，增加新的国际化字段或覆盖已有的国际化字段

**mergeLocaleMessage方法参数**

| 字段 | 类型 | 说明 |
|------|------|------|
| locale | String | 国际化语言类型 |
| Messages | Object | 所要新增或替换的国际化字段 |

**示例**
```javascript
const locale = ['zh-CN', 'en-US']
const messages = {
  'zh-CN': {
    testCustom: {
      noData: '暂无数据',
      reqDataError: '数据请求错误'
    }
  },
  'en-US': {
    testCustom: {
      noData: 'No data yet',
      reqDataError: 'Data request error'
    }
  }
}
locale.forEach((item) => {
  window.APaaSSDK.context.globalVueI18n &&
    window.APaaSSDK.context.globalVueI18n.mergeLocaleMessage(item, messages[item])
})
```

### 时区时间

**调用方式**
仅在应用中可用，平台中不可用
```javascript
window.APaaSSDK.context.globalTimezone.getTimezoneDate()
lowCodeContext.APaaSSDK.globalTimezone.getTimezoneDate()
```

**功能描述**
用于获取当前时区的时间

**示例**
```javascript
window.APaaSSDK.context.globalTimezone.getTimezoneDate()
```

## 目录结构

- 得帆云aPaaS开放平台介绍
- 开发前必读
- 准备开发
- 业务事件
- 前端SDK
  - 随着嵌入内容高度变化，实时获取iframe页面高度
- 服务端SDK
- API 调用指南
- 组织用户同步
- 单点登录
- API 数据模型
- 自定义消息提醒
- 工作台支持版本发布审批流程
- WebHook
- 插件开发文档

---

**文档来源**: 得帆社区服务平台
**访问地址**: https://edu.definesys.cn/community/document-center/?id=520252052773797888&typeId=481474084123705344&version=V1_0
**获取时间**: 2025年12月16日
