# HTTP 接口文档

> 本文档汇总项目中前端调用的所有后端 HTTP 接口，包含接口说明、请求参数和响应信息。

## 接口调用方式

项目使用 `NetworkControl.apis` + `this.$request(request).asyncThen()` 模式调用接口。接口定义对象格式：

```javascript
{
  url: '/xdap-app/xxx',
  method: 'get' | 'post',
  disableSuccessMsg: true  // 可选，禁用成功提示
}
```

## URL 前缀说明

| 前缀 | 说明 |
|------|------|
| `/xdap-app/` | 应用级接口（最常用） |
| `/xdap-admin/` | 管理级接口 |

> 部分接口 URL 缺少前导 `/`，文档中已统一补全。运行时注入的 API（URL 标记为 "运行时注入"）通过 `NetworkControl.registerGlobalApis()` 由宿主应用注入。

---

## 一、事件管理

来源：`x-dcloud-business-event/lib/es/x-business-event-flow-config.js`

### QUERY_EVENT_CONFIG

查询事件详情配置。

- **方法**：GET
- **URL**：`/xdap-app/event/query/detail`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |

---

### SAVE_EVENT_CONFIG

保存事件配置（含节点、连线等完整配置）。

- **方法**：POST
- **URL**：`/xdap-app/event/save/event`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 否 | 事件ID（编辑时传入） |
| eventName | string | 是 | 事件名称 |
| eventConfig | object | 是 | 事件配置JSON（含节点、连线） |
| enabled | boolean | 否 | 是否启用 |

---

### RENAME_EVENT_NAME / RENAME_BUSINESS_EVENT

重命名事件。

- **方法**：GET
- **URL**：`/xdap-app/event/rename`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |
| eventName | string | 是 | 新事件名称 |

---

### QUERY_BUSINESS_EVENT_LIST

查询业务事件列表。

- **方法**：GET
- **URL**：`/xdap-app/event/query/list`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 否 | 应用ID |
| formId | string | 否 | 表单ID |

---

### DELETE_BUSINESS_EVENT

删除业务事件。

- **方法**：GET
- **URL**：`/xdap-app/event/del/event`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |

---

### CREATE_BUSINESS_EVENT

创建业务事件。

- **方法**：POST
- **URL**：`/xdap-app/event/add/event`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventName | string | 是 | 事件名称 |
| appId | string | 否 | 应用ID |
| formId | string | 否 | 关联表单ID |

---

### ENABLE_BUSINESS_EVENT

启用或禁用业务事件。

- **方法**：GET
- **URL**：`/xdap-app/event/operate/status`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |
| enabled | boolean | 是 | true 启用 / false 禁用 |

---

### QUERY_BUSINESS_EVENT_FORM_FIELD

查询事件关联的表单字段（即将废弃）。

- **方法**：GET
- **URL**：`/xdap-app/event/node/query/formField`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_PROCESS_LIST_BY_APPID

根据应用ID查询流程列表。

- **方法**：GET
- **URL**：`/xdap-app/process/query/processList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### EVENT_TRIGGER_NODE

事件触发节点配置。

- **方法**：POST
- **URL**：`/xdap-app/event/front/trigger/triggerNode`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |
| nodeConfig | object | 是 | 触发节点配置 |

---

### EVENT_NORMAL_NODE

事件普通节点配置。

- **方法**：POST
- **URL**：`/xdap-app/event/front/trigger/normalNode`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |
| nodeConfig | object | 是 | 普通节点配置 |

---

### EVENT_CUSTOM_NODE_DATA_SOURCE

查询节点自定义数据源输入。

- **方法**：POST
- **URL**：`/xdap-app/event/query/node/inputDatas`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |
| nodeId | string | 是 | 节点ID |

---

### QUERY_BS_LIST_BY_FORM_ID

根据表单ID查询事件列表。

- **方法**：GET
- **URL**：`/xdap-app/event/query/list/formId`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### START_API_MOCK

API Mock 模拟触发事件。

- **方法**：GET
- **URL**：`/xdap-app/event/simulation`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |

---

### QUERY_BUSINESS_EVENT_PARAMS

查询外部触发参数配置。

- **方法**：GET
- **URL**：`/xdap-app/event/query/extTriggerParam`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |

---

### QUERY_SIMULATION_CRON_DATE

预览定时触发时间（Cron 表达式模拟）。

- **方法**：POST
- **URL**：`/xdap-app/event/query/simulationCronDate`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| cronExpression | string | 是 | Cron 表达式 |
| count | number | 否 | 模拟返回条数 |

---

## 二、业务规则

来源：`x-dcloud-business-event/lib/es/x-business-event-flow-config.js`

### SAVE_SIMPLE_RULE

保存简单规则。

- **方法**：POST
- **URL**：`/xdap-app/rule/save/simpleRule`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| ruleConfig | object | 是 | 简单规则配置 |
| ruleName | string | 是 | 规则名称 |

---

### SAVE_ADVANCED_RULE

保存高级规则。

- **方法**：POST
- **URL**：`/xdap-app/rule/save/advancedRule`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| ruleConfig | object | 是 | 高级规则配置 |
| ruleName | string | 是 | 规则名称 |

---

### QUERY_FUNC_LIST

查询规则可用函数列表。

- **方法**：GET
- **URL**：`/xdap-app/rule/query/funcList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 否 | 表单ID |

---

### SAVE_BUSINESS_RULE

保存业务规则。

- **方法**：POST
- **URL**：`/xdap-app/formConfig/save/businessRule`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| businessRule | object | 是 | 业务规则配置 |

---

### QUERY_BUSINESS_RULE_LIST

查询业务规则列表。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/businessRuleList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_BUSINESS_RULE_DETAIL

查询业务规则详情。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/businessRuleDetail`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| ruleId | string | 是 | 规则ID |

---

## 三、用户与部门

来源：`x-dcloud-page-engine/lib/es/page-service.js`、`x-dcloud-business-event`、`x-dcloud-page-web`

### QUERY_ALL_USERS

分页查询所有用户。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryAllUsers`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 当前页码 |
| pageSize | number | 是 | 每页条数 |
| keyWord | string | 否 | 搜索关键词 |

---

### QUERY_FORMAL_ALL_USERS

分页查询所有正式用户。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryAllFormalUsers`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 当前页码 |
| pageSize | number | 是 | 每页条数 |
| keyWord | string | 否 | 搜索关键词 |

---

### QUERY_ALL_USERS_FILTER

带数据过滤的用户查询（根据表单组件权限过滤）。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryAllUsersFilter`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| componentId | string | 是 | 组件ID |
| param | string | 否 | 搜索关键词 |
| formData | object | 否 | 当前表单数据 |
| currentRowTableData | object | 否 | 当前行表格数据 |

---

### QUERY_LIMIT_USERS

限制数量查询用户。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryLimitUsers`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyWord | string | 否 | 搜索关键词 |
| limit | number | 否 | 返回数量限制 |

---

### QUERY_DEPARTMENT_INFO

查询子部门信息。

- **方法**：GET
- **URL**：`/xdap-app/user/select/queryChildDept`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deptId | string | 否 | 部门ID（为空则查顶级） |
| keyword | string | 否 | 搜索关键词 |

---

### QUERY_DEPARTMENT_USERS

根据部门查询用户列表。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryUsersByDept`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deptId | string | 是 | 部门ID |
| page | number | 是 | 当前页码 |
| pageSize | number | 是 | 每页条数 |
| includeSubdepartments | boolean | 否 | 是否包含子部门 |

---

### QUERY_CHILD_DEPT_AND_USER

查询子部门和用户（树形结构）。

- **方法**：GET
- **URL**：`/xdap-app/user/select/queryChildDeptAndUser`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| includeSubdepartments | boolean | 否 | 是否包含子部门 |
| page | number | 是 | 当前页码 |
| pageSize | number | 是 | 每页条数 |
| deptId | string | 否 | 部门ID（为空则查顶级） |

---

### QUERY_ROLE_INFO

查询角色列表。

- **方法**：GET
- **URL**：`/xdap-app/user/select/queryRoleList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 否 | 应用ID |

---

### QUERY_ROLE_USERS

根据角色查询用户。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryUsersByRole`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 当前页码 |
| pageSize | number | 是 | 每页条数 |
| roleId | string | 是 | 角色ID |

---

### QUERY_TOP_DEPARTMENT

获取顶级部门列表。

- **方法**：GET
- **URL**：`/xdap-app/department/select/queryTopDeptList`

无请求参数。

---

### QUERY_ALL_DEPARTMENT

获取所有部门列表。

- **方法**：GET
- **URL**：`/xdap-app/department/select/queryDeptList`

无请求参数。

---

### QUERY_CHILD_DEPARTMENT

获取子部门列表。

- **方法**：GET
- **URL**：`/xdap-app/department/select/querySecondaryDeptList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deptId | string | 否 | 父部门ID |

---

### QUERY_DEPARTMENT_FILTER_BY_PAGE

带过滤和分页的部门查询。

- **方法**：POST
- **URL**：`/xdap-app/department/select/queryDepartmentFilter/byPage`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| page | number | 是 | 当前页码 |
| pageSize | number | 是 | 每页条数 |

---

### QUERY_DEPARTMENT_FILTER

带过滤的部门查询（不分页）。

- **方法**：POST
- **URL**：`/xdap-app/department/select/queryDepartmentFilter`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |

---

### QUERY_CHILD_COLLECT_DEPARTMENT

查询子部门（含收藏）。

- **方法**：GET
- **URL**：`/xdap-app/department/select/queryChildCollectDept`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deptId | string | 否 | 部门ID |

---

### QUERY_ALL_EXPAND_INFO

查询所有展开信息（运行时注入，用于人员选择器的展开树数据）。

- **方法**：GET
- **URL**：运行时注入

无请求参数。

---

### QUERY_ALL_DEPT_EXPAND_INFO

查询所有部门展开信息（运行时注入，用于部门选择器的展开树数据）。

- **方法**：GET
- **URL**：运行时注入

无请求参数。

---

## 四、角色与权限

来源：`x-dcloud-business-event`、`x-dcloud-page-web`

### QUERY_APP_ROLE_LIST

查询应用角色选择列表。

- **方法**：POST
- **URL**：`/xdap-app/roles/query/rolesSelectList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 否 | 应用ID |

---

### ROLE_PARAM_INSERT_OR_UPDATE

新增或更新角色参数。

- **方法**：POST
- **URL**：`/xdap-app/roleParam/insertOrUpdate/roleParam`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 否 | 角色参数ID（更新时传入） |
| roleId | string | 是 | 角色ID |
| paramName | string | 是 | 参数名 |
| paramValue | string | 是 | 参数值 |

---

### DELETE_ROLEPARAM_AUTH

删除角色参数。

- **方法**：POST
- **URL**：`/xdap-app/roleParam/delete/roleParam`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 角色参数ID |

---

## 五、应用访问控制

来源：`x-dcloud-page-web/lib/es/index.js` (AccessAuthority)

### QUERY_APPACCESS_LIST

查询应用访问授权列表。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/query/list`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### SAVE_APPACCESS_LIST

保存应用访问授权配置。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/save`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| accessList | array | 是 | 访问授权列表 |

---

### SAVE_APP_BLACK_ACCESS_LIST

批量保存黑名单。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/batchSave/blackAppAccess`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| blackList | array | 是 | 黑名单列表 |

---

### DELETE_APP_BLACK_ACCESS_AUTH

批量删除黑名单。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/batchDelete/blackAppAccess`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| ids | array | 是 | 待删除的黑名单ID列表 |

---

### DELETE_APPACCESS_AUTH

删除应用访问授权。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/delete`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 授权记录ID |

---

## 六、表单数据权限

来源：`x-dcloud-page-web/lib/es/index.js` (FormDataPermissions)

### QUERY_DATA_PERMISSION_VERSION

查询数据权限版本样式（区分新版/旧版权限模式）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/permissionStyle`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_ENVIRONMENT_IDENTITY_VAR_NO_PAGE

查询环境身份变量（不分页，用于权限配置中的身份选项）。

- **方法**：GET
- **URL**：`/xdap-app/identityConfig/queryAllConfigNoPage`

无请求参数。

---

### QUERY_FORM_DATA_PERMISSIONS

查询表单数据权限配置（普通模式）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/formPermissionByFormId`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_FORM_DATA_ADVANCED_PERMISSIONS

查询高级表单数据权限配置。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/advancedFormPermissionByFormId`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_TODO_PERMISSION

查询待办权限配置。

- **方法**：GET
- **URL**：`/xdap-app/processIdentityConfig/queryProcessIdentityPermissionConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 否 | 表单ID |
| processId | string | 否 | 流程ID |

---

### SAVE_FORM_DATA_PERMISSIONS

保存表单数据权限（普通模式）。

- **方法**：POST
- **URL**：`/xdap-app/formConfig/update/formPermission`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| permissionConfig | object | 是 | 权限配置数据 |

---

### SAVE_TODO_PERMISSION

保存待办权限配置。

- **方法**：POST
- **URL**：`/xdap-app/processIdentityConfig/saveProcessIdentityPermissionConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| processId | string | 是 | 流程ID |
| permissionConfig | object | 是 | 待办权限配置 |

---

### SAVE_FORM_ADVANCED_DATA_PERMISSIONS

保存高级表单数据权限。

- **方法**：POST
- **URL**：`/xdap-app/formConfig/update/advancedFormPermission`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| permissionConfig | object | 是 | 高级权限配置数据 |

---

### QUERY_DICTIONARY_VALUE_LIST

查询数据字典值列表。

- **方法**：POST
- **URL**：`/xdap-app/dataDictionary/query/dictionaryValueList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| dictionaryId | string | 是 | 字典ID |

---

### QUERY_IDENTITY_BUSINESS_DATA

身份业务数据选择器（根据身份查询关联业务数据）。

- **方法**：POST
- **URL**：`/xdap-app/identity/select/dataSelectorData`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| componentId | string | 否 | 组件ID |
| keyWord | string | 否 | 搜索关键词 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

---

## 七、表单配置

### QUERY_SELECT_FORM_LIST

查询当前应用下所有表单配置列表（用于表单选择器）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/currentAppListAllFormConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 否 | 应用ID（默认取当前应用） |

---

### QUERY_DETAIL_CONFIG_BY_ID

根据表单ID查询表单设计配置详情（含表单组件、数据模型字段、业务事件触发配置）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/detailPageConfigById`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_FORM_FIELD_ALL_IN_ONE

查询表单组件字段（综合接口，支持黑名单/白名单过滤，用于业务规则、数据权限等场景）。

- **方法**：POST
- **URL**：`/xdap-app/form/query/formComponent`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| systemField | boolean | 否 | 是否包含系统字段 |
| blackList | string[] | 否 | 黑名单组件UUID列表（排除的组件） |
| whiteList | string[] | 否 | 白名单组件UUID列表（仅包含的组件） |
| systemBlackList | string[] | 否 | 系统字段黑名单 |
| isCombine | boolean | 否 | 是否组合表单 |
| displayOwner | boolean | 否 | 是否显示归属信息 |
| xdapsourceformId | string | 否 | 来源表单ID（通过Header传递） |

---

### SAVE_FORM_CONFIG_DETAIL

保存表单配置详情（设计器保存操作）。

- **方法**：POST
- **URL**：`/xdap-app/formConfig/save/detailPageConfigById`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formConfig | object | 是 | 表单配置对象（含formComponents、menuId、appId等） |
| formModelSetting | object | 否 | 数据模型设置 |
| formVersionConfig | object | 否 | 表单版本配置 |

---

### QUERY_PUBLIC_FORM_CONFIG

查询公共表单配置（通过分享链接访问时使用）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/publicFormConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shareId | string | 是 | 分享ID |

---

### SAVE_PUBLIC_FORM_CONFIG

保存公共表单配置。

- **方法**：POST
- **URL**：`/xdap-app/formConfig/save/publicFormConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shareId | string | 否 | 分享ID |
| formConfig | object | 是 | 表单配置对象 |

---

### QUERY_FORM_TABS

查询表单标签页列表（列表页多视图切换）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/formTabs`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_FORM_MODEL_SETTING

查询数据模型设置（保存表单前校验数据模型是否已配置）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/formModelSetting`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| appId | string | 否 | 应用ID |
| menuId | string | 否 | 菜单ID |

---

### QUERY_SHARE_CONFIG

查询分享表单配置（只读分享查看）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/shareConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shareId | string | 是 | 分享ID |

---

### QUERY_SHARE_CONFIG_EDIT

查询分享表单配置（可编辑分享查看）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/shareConfigEdit`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shareId | string | 是 | 分享ID |
| formId | string | 否 | 表单ID |

---

### QUERY_ENABLE_PRINT_TEMPLATES

查询已启用的打印模板列表。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/enablePrintTemplates`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### CHECK_TENANT_USER

校验租户用户是否存在（分享表单访问时校验）。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/check/tenantUser`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tenantId | string | 是 | 租户ID |

---

## 八、业务数据查询

### DETAIL_PAGE_CONFIG_BY_ID

根据页面ID获取详情页配置信息，用于渲染详情页面的表单、布局、按钮等配置。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/config/queryById`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| event | object | 是 | 事件对象，包含页面上下文信息 |

---

### DETAIL_PAGE_GET_BUSINESS_DATA

获取详情页的业务数据，包括表单数据及流程相关数据。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/getBusinessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| event.documentId | string | 是 | 文档ID |
| event.formId | string | 是 | 表单ID |
| event.isTempSave | boolean | 否 | 是否暂存数据 |

---

### DETAIL_PAGE_GET_SINGLE_FORM_REAL_DATA

获取单个表单的真实数据，用于表单回显和编辑。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/getSingleFormRealData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| documentId | string | 是 | 文档ID |
| uuid | string | 是 | 数据唯一标识 |
| isInTable | boolean | 否 | 是否在表格中 |
| tableUuid | string | 否 | 所属表格UUID（表格内表单时必填） |
| tableDocumentId | string | 否 | 所属表格文档ID（表格内表单时必填） |

---

### DETAIL_PAGE_GET_TABLE_BUSINESS_DATA

获取详情页中表格组件的业务数据。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/getTableBusinessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| documentId | string | 是 | 文档ID |
| tableUuid | string | 是 | 表格组件UUID |

---

### DETAIL_PAGE_GET_TABLE_BUSINESS_DATAS

批量获取详情页中多个表格组件的业务数据（初始化表格数据）。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/initFormTableDatasAction`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| documentId | string | 是 | 文档ID |
| tableUuids | string | 是 | 表格UUID列表，多个以逗号分隔 |

---

### DETAIL_PAGE_GET_TABLE_BUSINESS_COPY_DATA

获取详情页表格的复制数据，用于表格数据复制场景。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/getTableBusinessCopyData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| documentId | string | 是 | 文档ID |
| tableUuid | string | 是 | 表格组件UUID |

---

### DETAIL_PAGE_GET_BUSINESS_COPY_DATA

获取详情页表单的复制数据，用于整单复制场景。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/requestCopyDataWithPromise`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| documentId | string | 是 | 文档ID |

---

### DETAIL_PAGE_GET_TEMPLATE_DATA

获取详情页模板数据，用于从模板创建数据。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/requestTemplateDataWithPromise`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataModuleId | string | 是 | 数据模板ID |

---

### QUERY_PROCESS_HISTORY

查询流程审批历史记录，用于详情页展示审批流程。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/queryProcessHistory`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| documentId | string | 是 | 文档ID |

---

### QUERY_COMMON_WORDS

查询常用语列表，用于审批意见等场景的快捷输入。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/queryCommonWords`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskId | string | 是 | 任务ID |
| documentId | string | 是 | 文档ID |

---

### QUERY_BUSINESS_DATA

查询业务数据列表，支持关键词搜索、分页及关联组件过滤。

- **方法**：POST
- **URL**：`/xdap-app/business/query/businessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| componentId | string | 否 | 组件ID |
| keyWord | string | 否 | 搜索关键词 |
| searchComponentId | string | 否 | 搜索组件ID |
| afterFormData | object | 否 | 当前表单数据（用于联动过滤） |
| hideList | array | 否 | 需要隐藏的文档ID列表 |
| tableDataSelectQueryInfo | object | 否 | 表格数据选择查询信息 |
| pageInfo | object | 否 | 分页信息（含 page、pageSize） |

---

### QUERY_ALL_BUSINESS_DATA

查询全部业务数据，支持关键词搜索和分页（不分页时返回全部）。

- **方法**：POST
- **URL**：`/xdap-app/business/query/allBusinessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| componentId | string | 否 | 组件ID |
| keyWord | string | 否 | 搜索关键词 |
| searchComponentId | string | 否 | 搜索组件ID |
| afterFormData | object | 否 | 当前表单数据 |
| hideList | array | 否 | 需要隐藏的文档ID列表 |
| tableDataSelectQueryInfo | object | 否 | 表格数据选择查询信息 |
| pageInfo | object | 否 | 分页信息 |
| isQueryAllData | boolean | 否 | 是否查询全部数据（不分页） |

---

### QUERY_ALL_BUSINESS_DATA_BY_BOCCODE

根据业务对象编码查询全部业务数据。

- **方法**：POST
- **URL**：`/xdap-app/business/query/allBusinessDataByBocCode`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bocCode | string | 是 | 业务对象编码 |
| boCode | string | 是 | 业务对象字段编码 |

---

### QUERY_CALC_LIST_BUSINESS_DATA

批量计算列表业务数据，用于列表页统计字段计算。

- **方法**：POST
- **URL**：`/xdap-app/business/query/calcListBusinessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| documentIdList | array | 是 | 文档ID列表 |
| isCombine | boolean | 否 | 是否组合表单 |

---

### DETAIL_COMBINE_DETAIL_PAGE_CONFIG_BY_ID

根据页面ID获取组合详情页配置信息。

- **方法**：POST
- **URL**：`/xdap-app/combineDetailPage/config/queryById`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| event | object | 是 | 事件对象，包含页面上下文信息 |

---

### DETAIL_COMBINE_PAGE_GET_DETAIL_FORM_BUTTON

获取组合详情页的表单按钮配置。

- **方法**：POST
- **URL**：`/xdap-app/combineDetailPage/getDetailFormButton`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| event | object | 是 | 事件对象，包含页面上下文信息 |

---

### DETAIL_COMBINE_PAGE_GET_BUSINESS_DATA

获取组合详情页的业务数据。

- **方法**：POST
- **URL**：`/xdap-app/combineDetailPage/getBusinessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| combineFormId | string | 是 | 组合表单ID |
| event | object | 是 | 事件对象，包含 documentId 等上下文信息 |

---

### QUERY_OTHER_FORM_FILED_LINE_DETAIL

查询其他表单字段行明细数据，用于关联表单数据展示。

- **方法**：POST
- **URL**：`/xdap-app/business/query/otherFormFiledLineDetail`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| event | object | 是 | 事件对象，包含查询条件 |

---

### QUERY_STATISTICS_VALUE

查询统计值，用于表单中统计组件的数据计算。

- **方法**：POST
- **URL**：`/xdap-app/business/query/statisticsValue`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| documentId | string | 是 | 文档ID |
| uuidList | array | 是 | UUID列表 |
| data | object | 否 | 附加查询数据 |

---

## 九、数据选择器

### allSelectorData

旧版数据选择器接口，根据表单ID和组件ID查询可选数据列表。

- **方法**：GET
- **URL**：`/xdap-app/business/query/allSelectorData`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| componentId | string | 是 | 组件ID |
| keyWord | string | 否 | 搜索关键词 |
| isEncode | boolean | 否 | 是否编码 |
| permissionFlag | boolean | 否 | 是否校验数据权限 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

---

### newDataSelectorData

新版数据选择器接口，支持数据过滤规则和标签页筛选。

- **方法**：POST
- **URL**：`/xdap-app/business/query/newDataSelectorData`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| componentId | string | 是 | 组件ID |
| keyWord | string | 否 | 搜索关键词 |
| tabId | string | 否 | 标签页ID |
| dataFilterRule | object | 否 | 数据过滤规则 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

---

### dictionaryValueList

查询数据字典值列表，用于下拉选择等场景。

- **方法**：POST
- **URL**：`/xdap-app/dataDictionary/query/dictionaryValueList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| dictionaryId | string | 是 | 数据字典ID |

---

## 十、流程操作

> 以下流程操作接口的请求参数均基于 `generateProcessOpParams()` 生成，公共参数如下：
>
> | 参数名 | 类型 | 必填 | 说明 |
> |--------|------|------|------|
> | buttonCode | string | 是 | 按钮编码 |
> | buttonName | string | 是 | 按钮名称 |
> | documentId | string | 是 | 文档ID |
> | formId | string | 是 | 表单ID |
> | rowId | string | 否 | 行ID |
> | processId | string | 是 | 流程实例ID |
> | taskId | string | 是 | 任务ID |
> | comment | string | 否 | 审批意见 |
> | attachmentsOfComment | array | 否 | 意见附件列表 |
> | data | object | 否 | 表单数据 |
> | tableData | object | 否 | 表格数据 |
> | dataChange | boolean | 否 | 数据是否变更 |
> | tableDataChange | boolean | 否 | 表格数据是否变更 |
> | platformType | string | 否 | 平台类型 |
> | addFlag | boolean | 否 | 是否新增标识 |
> | tempFlag | boolean | 否 | 是否暂存标识 |
> | userId | string | 否 | 用户ID |
> | sonTableConfigMap | object | 否 | 子表配置映射 |
> | _formDataStatus | object | 否 | 表单数据状态 |

### DETAIL_PAGE_PROCESS_SUBMIT

详情页流程提交，发起流程审批。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/processSubmit`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |
| menuId | string | 否 | 菜单ID |
| draftStatusUpdateFlag | boolean | 否 | 草稿状态更新标识 |

---

### DETAIL_PAGE_SUBMIT_BUSINESS_DATA

提交业务数据（非流程方式提交）。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/submitBusinessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DETAIL_PAGE_TEMPSAVE_BUSINESS_DATA

暂存业务数据，保存草稿。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/tempsaveBusinessData`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DETAIL_TEMPLATE_DATA_SUBMIT

从模板提交数据，用于模板创建后直接提交。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/templateDataSubmit`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| id | string | 是 | 数据ID / dataTemplateId |
| dataTemplateId | string | 否 | 数据模板ID |
| moduleData | object | 否 | 模块数据 |
| dataModuleName | string | 否 | 数据模块名称 |
| moduleOwner | string | 否 | 模块所有者 |

---

### DO_APPROVE

流程审批——同意操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doApprove`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_REJECT

流程审批——驳回操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doReject`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_RESTART

流程审批——重新发起操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doRestart`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_NORMAL_TERMINATE

流程审批——正常终止操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doNormalTerminate`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_INITIATOR_TERMINATE

流程审批——发起人终止操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doInitiatorTerminate`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_OPERATE_STAGING

流程审批——暂存操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doOperateStaging`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_INQUIRE

流程审批——征询操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doInquire`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_REASSIGN

流程审批——转办操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doReassign`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_ADDONE

流程审批——加签操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doAddone`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_OVERRULE

流程审批——否决操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doOverrule`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_FRONTADDONE

流程审批——前加签操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doFrontaddone`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_ANDCOUNTERSIGN

流程审批——会签操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doAndcountersign`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_INFROM

流程审批——知会操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doInfrom`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_REPLY

流程审批——回复操作。

- **方法**：POST
- **URL**：`/xdap-app/process/doReply`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |

---

### DO_WITHDRAW

流程审批——撤回操作，可指定撤回到哪个节点。

- **方法**：POST
- **URL**：`/xdap-app/process/doWithdraw`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |
| selectedWithdrawalNodeId | string | 否 | 指定撤回节点ID |

---

### DO_CUSTOM_PROCESS

自定义流程操作，支持扩展按钮触发的自定义流程动作。

- **方法**：POST
- **URL**：`/xdap-app/process/doCustomProcess`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| *公共参数* | - | - | 见上方 `generateProcessOpParams` |
| buttonCode | string | 是 | 自定义按钮编码 |
| buttonName | string | 是 | 自定义按钮名称 |
| initCustomButtonType | string | 否 | 自定义按钮类型 |

---

### QUERY_WITHDRAW_NODE_LIST

查询可撤回节点列表，用于撤回时选择目标节点。

- **方法**：POST
- **URL**：`/xdap-app/process/queryWithdrawNodeList`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| processId | string | 是 | 流程实例ID |
| documentId | string | 是 | 文档ID |

---

### DO_DELETE

删除业务数据。

- **方法**：POST
- **URL**：`/xdap-app/detailPage/doDelete`（运行时注入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| event | object | 是 | 事件对象，包含 documentId 等删除条件 |

---

## 十一、服务集成与事件

### QUERY_SERVICE_INTEGRATION_ALL_EVENT

查询服务集成的所有事件列表。

- **方法**：GET
- **URL**：`/xdap-app/serviceIntegration/query/allEvent`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceId | string | 是 | 服务ID |

---

### QUERY_SERVICE_INTEGRATION_DETAILS_EVENT

查询服务集成事件的详细信息。

- **方法**：GET
- **URL**：`/xdap-app/serviceIntegration/query/detailsEvent`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceId | string | 是 | 服务ID |
| eventId | string | 是 | 事件ID |

---

### QUERY_FUNCTION_DETAILS

查询函数详情，用于事件配置中选择函数。

- **方法**：GET
- **URL**：`/xdap-app/function/query/details`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| functionId | string | 是 | 函数ID |

---

### QUERY_BUSINESS_EVENT_PARAMS

查询业务事件的参数定义。

- **方法**：GET
- **URL**：`/xdap-app/businessEvent/query/params`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |

---

### START_API_MOCK

启动 API Mock，用于事件调试。

- **方法**：POST
- **URL**：`/xdap-app/businessEvent/startApiMock`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventId | string | 是 | 事件ID |
| eventData | object | 否 | 模拟事件数据 |

---

### SAVE_BUSINESS_RULE

保存业务规则配置。

- **方法**：POST
- **URL**：`/xdap-app/businessRule/save`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ruleData | object | 是 | 规则配置数据 |

---

### QUERY_BUSINESS_RULE_LIST

查询业务规则列表。

- **方法**：GET
- **URL**：`/xdap-app/businessRule/query/list`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| keyword | string | 否 | 搜索关键词 |

---

### QUERY_BUSINESS_RULE_DETAIL

查询业务规则详情。

- **方法**：GET
- **URL**：`/xdap-app/businessRule/query/detail`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ruleId | string | 是 | 规则ID |

---

### QUERY_SIMULATION_CRON_DATE

模拟 Cron 表达式的执行时间，用于定时规则配置预览。

- **方法**：POST
- **URL**：`/xdap-app/businessRule/simulationCronDate`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| cronExpression | string | 是 | Cron 表达式 |

---

### SAVE_SIMPLE_RULE

保存简单规则配置。

- **方法**：POST
- **URL**：`/xdap-app/businessRule/saveSimpleRule`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ruleData | object | 是 | 简单规则数据 |

---

### SAVE_ADVANCED_RULE

保存高级规则配置。

- **方法**：POST
- **URL**：`/xdap-app/businessRule/saveAdvancedRule`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ruleData | object | 是 | 高级规则数据 |

---

### QUERY_FUNC_LIST

查询函数列表，用于事件和规则配置中选择函数。

- **方法**：GET
- **URL**：`/xdap-app/function/query/list`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| keyword | string | 否 | 搜索关键词 |

---

## 十二、人员与组织

人员选择、部门查询、角色查询等相关接口，用于人员选择器组件。

### QUERY_ALL_USERS

查询所有用户列表，支持分页和关键词搜索。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryAllUsers`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| keyWord | string | 否 | 搜索关键词 |

---

### QUERY_ALL_USERS_FILTER

带数据过滤的用户查询，根据表单数据筛选可用用户。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryAllUsersFilter`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| componentId | string | 是 | 组件ID（uuid） |
| param | string | 否 | 搜索参数 |
| formData | object | 否 | 表单数据 |
| currentRowTableData | object | 否 | 当前子表行数据 |

---

### QUERY_ALL_FORMAL_USERS

查询所有正式用户列表（不含临时用户）。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryAllFormalUsers`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |

---

### QUERY_DEPARTMENT_INFO

查询子部门信息，支持按上级部门ID和关键词筛选。

- **方法**：GET
- **URL**：`/xdap-app/user/select/queryChildDept`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deptId | string | 否 | 上级部门ID，为空则查询顶级 |
| keyword | string | 否 | 搜索关键词 |

---

### QUERY_DEPARTMENT_USERS

根据部门ID查询部门下用户列表。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryUsersByDept`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deptId | string | 是 | 部门ID |
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| includeSubdepartments | boolean | 否 | 是否包含子部门 |

---

### QUERY_CHILD_DEPT_AND_USER

查询子部门及其下属用户，支持分页。

- **方法**：运行时注入，URL 由宿主应用注册
- **参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deptId | string | 否 | 部门ID |
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| includeSubdepartments | boolean | 否 | 是否包含子部门 |

---

### QUERY_ALL_DEPARTMENT

查询所有部门列表。

- **方法**：GET
- **URL**：`/xdap-app/department/select/queryDeptList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |

---

### QUERY_TOP_DEPARTMENT

查询顶级部门列表。

- **方法**：GET
- **URL**：`/xdap-app/department/select/queryTopDeptList`

无请求参数。

---

### QUERY_CHILD_DEPARTMENT

查询二级子部门列表。

- **方法**：GET
- **URL**：`/xdap-app/department/select/querySecondaryDeptList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| parentDeptId | string | 否 | 上级部门ID |

---

### QUERY_ROLE_INFO

查询角色列表。

- **方法**：GET
- **URL**：`/xdap-app/user/select/queryRoleList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 否 | 应用ID，指定则查询应用角色 |

---

### QUERY_ROLE_USERS

根据角色ID查询该角色下的用户列表。

- **方法**：POST
- **URL**：`/xdap-app/user/select/queryUsersByRole`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| roleId | string | 是 | 角色ID |
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |

---

### QUERY_APP_ROLE_LIST

查询应用角色选择列表，用于权限配置。

- **方法**：POST
- **URL**：`/xdap-app/roles/query/rolesSelectList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### QUERY_DEPARTMENT_FILTER_BY_PAGE

带过滤和分页的部门查询。

- **方法**：POST
- **URL**：`/xdap-app/department/select/queryDepartmentFilter/byPage`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |

---

## 十三、附件与文件

附件上传、文件操作、在线预览等相关接口。

### FORM_UPLOAD_CONFIG_API

附件上传接口，用于表单附件组件上传文件。

- **方法**：POST
- **URL**：`/xdap-app/attachments/simpleUploadFile`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 上传的文件 |
| formId | string | 否 | 表单ID |
| componentId | string | 否 | 组件ID |

---

### BATCH_COPY_FILE

批量复制文件，用于子表数据复制时同步复制附件。

- **方法**：运行时注入，URL 由宿主应用注册
- **参数**：event 对象，包含文件复制相关参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileIds | string | 是 | 待复制的文件ID列表 |
| formId | string | 否 | 目标表单ID |

---

### DO_CHECK

流程催办通知，向流程处理人发送催办消息。

- **方法**：运行时注入，URL 由宿主应用注册
- **参数**：由 `generateProcessNotifyParams()` 生成

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| processId | string | 是 | 流程实例ID |
| documentId | string | 是 | 单据ID |
| taskId | string | 否 | 任务ID |
| comment | string | 否 | 催办意见 |

---

### DO_SHARE

流程传阅通知，将流程单据传阅给指定人员。

- **方法**：运行时注入，URL 由宿主应用注册
- **参数**：传阅对象及流程相关参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| processId | string | 是 | 流程实例ID |
| documentId | string | 是 | 单据ID |
| shareUsers | array | 是 | 传阅对象用户列表 |

---

### GET_PREVIEW_ALL_CONFIG

获取文件在线预览的全局配置信息。

- **方法**：运行时注入，URL 由宿主应用注册

无请求参数。

---

## 十四、Excel 操作

子表 Excel 导入导出、模板解析等相关接口。

### EXPORT_TEMPLATE_TO_SON_TABLEEXCEL

导出子表 Excel 模板，下载子表对应的 Excel 模板文件。

- **方法**：GET
- **URL**：`/xdap-app/excel/export/excelSonTableTemplate`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| tableUuid | string | 是 | 子表组件UUID |

---

### IMPORT_SON_TABLE_EXCEL_DATA

导入子表 Excel 数据，将 Excel 文件内容解析并写入子表。

- **方法**：POST
- **URL**：`/xdap-app/excel/importExcelSonTableData`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| tableUuid | string | 是 | 子表组件UUID |
| file | File | 是 | Excel 文件 |

---

### QUERY_EXCEL_PARSE_TEMPLATE

根据表单ID查询 Excel 解析模板配置。

- **方法**：GET
- **URL**：`/xdap-app/excelTemplate/queryExcelParseTemplateByFormId`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

## 十五、应用与菜单

应用信息查询、菜单树获取、环境身份、国际化等接口。

### QUERY_APP_INFO

查询应用基本信息，用于多应用模式下初始化应用上下文。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### QUERY_PRIVATE_APP_ENV_INFO

查询私有应用环境信息，用于单应用模式下的应用初始化。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### APP_ENGINE_HOME_GET_MENU_TREE

获取应用首页菜单树，用于侧边栏菜单渲染。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### APP_ENGINE_MENU_TREE_PERMISSION

查询菜单树权限配置，获取当前用户可见的菜单及权限。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### QUERY_HELP_DOC

查询帮助文档信息，获取当前页面的帮助链接。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| menuId | string | 否 | 菜单ID |
| appId | string | 否 | 应用ID |

---

### GET_I18N_TEXT_LANG_LIST

获取国际化语言列表，用于多语言切换。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### QUERY_CURRENT_IDENTITY

查询当前环境身份信息，获取用户在当前应用下的身份标识。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### QUERY_FORM_TABS

查询表单标签页列表，用于多标签页表单视图初始化。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_WITHDRAW_NODE_LIST

查询流程可撤回节点列表，用于流程撤回时选择撤回目标节点。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| processId | string | 是 | 流程实例ID |
| documentId | string | 是 | 单据ID |

---

## 十六、地区与地址

省市区地区查询、地址编码解析等接口。

### QUERY_AREA

查询地区信息，获取省市区三级联动数据。

- **方法**：运行时注入，URL 由宿主应用注册
- **参数**：event 对象

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| parentCode | string | 否 | 上级地区编码，为空则查询省级 |
| level | number | 否 | 地区层级（1:省 2:市 3:区） |

---

### QUERY_ADDRESS_BY_CODE

根据地区编码查询地址详情，用于处理特殊地区数据（如市辖区）。

- **方法**：运行时注入，URL 由宿主应用注册
- **参数**：event 对象

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | string | 是 | 地区编码 |

---

## 十七、水印

页面水印配置查询相关接口，用于页面水印渲染。

### GET_WATER_MARK_TEXT

获取水印文字内容，根据应用和菜单配置返回水印文本（疑似已废弃，建议使用 QUERY_WATER_MARK_CONFIG）。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| menuId | string | 否 | 菜单ID |

---

### QUERY_WATER_MARK_CONFIG

查询水印配置信息（多应用模式），返回水印开关、样式及文本配置。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| menuId | string | 否 | 菜单ID |

---

### QUERY_WATER_MARK_CONFIG_WORKBENCH

查询水印配置信息（单工作台模式），用于统一工作台场景下的水印配置。

- **方法**：运行时注入，URL 由宿主应用注册

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| menuId | string | 否 | 菜单ID |

---

## 十八、权限管理

应用访问权限、角色参数、表单数据权限等相关接口。分为 **AccessAuthority**（访问权限）和 **FormDataPermissions**（表单数据权限）两组。

### QUERY_APP_ROLE_LIST

查询应用角色选择列表，用于权限配置中分配角色。

- **方法**：POST
- **URL**：`/xdap-app/roles/query/rolesSelectList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### QUERY_APPACCESS_LIST

查询应用访问权限列表，获取已授权的用户/部门/角色列表。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/query/list`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### SAVE_APPACCESS_LIST

保存应用访问权限配置，批量设置应用的访问授权。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/save`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| accessList | array | 是 | 访问权限配置列表 |

---

### SAVE_APP_BLACK_ACCESS_LIST

批量保存应用黑名单访问权限，设置禁止访问的用户/部门。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/batchSave/blackAppAccess`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| blackAccessList | array | 是 | 黑名单列表 |

---

### DELETE_APP_BLACK_ACCESS_AUTH

批量删除应用黑名单访问权限。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/batchDelete/blackAppAccess`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| ids | array | 是 | 待删除的黑名单ID列表 |

---

### DELETE_APPACCESS_AUTH

删除应用访问权限授权。

- **方法**：POST
- **URL**：`/xdap-app/appAccess/delete`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |
| id | string | 是 | 权限记录ID |

---

### ROLE_PARAM_INSERT_OR_UPDATE

新增或更新角色参数配置。

- **方法**：POST
- **URL**：`/xdap-app/roleParam/insertOrUpdate/roleParam`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| roleId | string | 是 | 角色ID |
| paramName | string | 是 | 参数名 |
| paramValue | string | 是 | 参数值 |

---

### DELETE_ROLEPARAM_AUTH

删除角色参数配置。

- **方法**：POST
- **URL**：`/xdap-app/roleParam/delete/roleParam`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 角色参数ID |

---

### QUERY_DATA_PERMISSION_VERSION

查询数据权限版本信息，获取当前权限配置的版本号。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/permissionStyle`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_ENVIRONMENT_IDENTITY_VAR_NO_PAGE

查询环境身份变量列表（不分页），获取所有身份配置项。

- **方法**：GET
- **URL**：`/xdap-app/identityConfig/queryAllConfigNoPage`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 否 | 应用ID |

---

### QUERY_FORM_FIELD_ALL_IN_ONE

查询表单字段汇总信息，一次性获取表单所有组件字段定义。

- **方法**：POST
- **URL**：`/xdap-app/form/query/formComponent`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_FORM_DATA_PERMISSIONS

查询表单数据权限配置，获取基础权限规则。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/formPermissionByFormId`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_FORM_DATA_ADVANCED_PERMISSIONS

查询表单高级数据权限配置，获取高级权限规则。

- **方法**：GET
- **URL**：`/xdap-app/formConfig/query/advancedFormPermissionByFormId`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### QUERY_TODO_PERMISSION

查询待办权限配置，获取流程身份权限规则。

- **方法**：GET
- **URL**：`/xdap-app/processIdentityConfig/queryProcessIdentityPermissionConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |

---

### SAVE_FORM_DATA_PERMISSIONS

保存表单数据权限配置，更新基础权限规则。

- **方法**：POST
- **URL**：`/xdap-app/formConfig/update/formPermission`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| permissionData | object | 是 | 权限配置数据 |

---

### SAVE_TODO_PERMISSION

保存待办权限配置，更新流程身份权限规则。

- **方法**：POST
- **URL**：`/xdap-app/processIdentityConfig/saveProcessIdentityPermissionConfig`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| permissionData | object | 是 | 权限配置数据 |

---

### SAVE_FORM_ADVANCED_DATA_PERMISSIONS

保存表单高级数据权限配置，更新高级权限规则。

- **方法**：POST
- **URL**：`/xdap-app/formConfig/update/advancedFormPermission`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 是 | 表单ID |
| permissionData | object | 是 | 高级权限配置数据 |

---

### QUERY_PROCESS_LIST_BY_APPID

根据应用ID查询流程列表，用于权限配置中选择流程。

- **方法**：GET
- **URL**：`/xdap-app/process/query/processList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appId | string | 是 | 应用ID |

---

### QUERY_DICTIONARY_VALUE_LIST

查询数据字典值列表，用于权限条件配置中选择字典值。

- **方法**：POST
- **URL**：`/xdap-app/dataDictionary/query/dictionaryValueList`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dictionaryCode | string | 是 | 字典编码 |

---

### QUERY_IDENTITY_BUSINESS_DATA

查询身份业务数据，用于数据选择器获取身份相关数据。

- **方法**：POST
- **URL**：`/xdap-app/identity/select/dataSelectorData`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| formId | string | 否 | 表单ID |
| componentId | string | 否 | 组件ID |
| keyword | string | 否 | 搜索关键词 |

---

## 附录：运行时注入 API 说明

page-engine 组件库本身不包含部分 API 的 URL 定义，这些 API 通过 `NetworkControl.registerGlobalApis(apis)` 在宿主应用初始化时注入。组件库内部仅通过 `NetworkControl.apis.API_KEY` 引用 API 配置，实际 URL 由宿主应用注册。

### 注入方式

```javascript
// 宿主应用初始化时注册 API
FormEngine.registerGlobalRequest({
  request,   // 请求方法
  upload,    // 上传方法
  download,  // 下载方法
  apis,      // API 配置对象（包含 URL、method 等）
  cancelToken // 取消请求令牌
});
```

### 运行时注入的 API 列表

以下 API 的 URL 在本文档中标注为"运行时注入"，其 URL 由宿主应用在初始化时注册：

| API Key | 说明 | 参考参数 |
|---------|------|----------|
| QUERY_CHILD_DEPT_AND_USER | 查询子部门及用户 | deptId, page, pageSize, includeSubdepartments |
| BATCH_COPY_FILE | 批量复制文件 | fileIds, formId |
| DO_CHECK | 流程催办通知 | processId, documentId, taskId, comment |
| DO_SHARE | 流程传阅通知 | processId, documentId, shareUsers |
| GET_PREVIEW_ALL_CONFIG | 获取预览配置 | 无 |
| QUERY_APP_INFO | 查询应用信息 | appId |
| QUERY_PRIVATE_APP_ENV_INFO | 查询私有应用环境 | appId |
| APP_ENGINE_HOME_GET_MENU_TREE | 获取菜单树 | appId |
| APP_ENGINE_MENU_TREE_PERMISSION | 查询菜单权限 | appId |
| QUERY_HELP_DOC | 查询帮助文档 | menuId, appId |
| GET_I18N_TEXT_LANG_LIST | 获取国际化语言列表 | appId |
| QUERY_CURRENT_IDENTITY | 查询当前身份 | appId |
| QUERY_FORM_TABS | 查询表单标签页 | formId |
| QUERY_WITHDRAW_NODE_LIST | 查询可撤回节点 | processId, documentId |
| QUERY_AREA | 查询地区信息 | parentCode, level |
| QUERY_ADDRESS_BY_CODE | 根据编码查地址 | code |
| GET_WATER_MARK_TEXT | 获取水印文字 | appId, menuId |
| QUERY_WATER_MARK_CONFIG | 查询水印配置 | appId, menuId |
| QUERY_WATER_MARK_CONFIG_WORKBENCH | 查询工作台水印配置 | appId, menuId |

### 已知 URL 定义的 API

以下 API 的 URL 已在组件库中明确定义，可直接参考：

| API Key | URL | 方法 |
|---------|-----|------|
| QUERY_ALL_USERS | `/xdap-app/user/select/queryAllUsers` | POST |
| QUERY_ALL_USERS_FILTER | `/xdap-app/user/select/queryAllUsersFilter` | POST |
| QUERY_ALL_FORMAL_USERS | `/xdap-app/user/select/queryAllFormalUsers` | POST |
| QUERY_DEPARTMENT_INFO | `/xdap-app/user/select/queryChildDept` | GET |
| QUERY_DEPARTMENT_USERS | `/xdap-app/user/select/queryUsersByDept` | POST |
| QUERY_ROLE_INFO | `/xdap-app/user/select/queryRoleList` | GET |
| QUERY_ROLE_USERS | `/xdap-app/user/select/queryUsersByRole` | POST |
| QUERY_ALL_DEPARTMENT | `/xdap-app/department/select/queryDeptList` | GET |
| QUERY_TOP_DEPARTMENT | `/xdap-app/department/select/queryTopDeptList` | GET |
| QUERY_CHILD_DEPARTMENT | `/xdap-app/department/select/querySecondaryDeptList` | GET |
| QUERY_APP_ROLE_LIST | `/xdap-app/roles/query/rolesSelectList` | POST |
| FORM_UPLOAD_CONFIG_API | `/xdap-app/attachments/simpleUploadFile` | POST |
| EXPORT_TEMPLATE_TO_SON_TABLEEXCEL | `/xdap-app/excel/export/excelSonTableTemplate` | GET |
| IMPORT_SON_TABLE_EXCEL_DATA | `/xdap-app/excel/importExcelSonTableData` | POST |
| QUERY_EXCEL_PARSE_TEMPLATE | `/xdap-app/excelTemplate/queryExcelParseTemplateByFormId` | GET |
| QUERY_APPACCESS_LIST | `/xdap-app/appAccess/query/list` | POST |
| SAVE_APPACCESS_LIST | `/xdap-app/appAccess/save` | POST |
| SAVE_APP_BLACK_ACCESS_LIST | `/xdap-app/appAccess/batchSave/blackAppAccess` | POST |
| DELETE_APP_BLACK_ACCESS_AUTH | `/xdap-app/appAccess/batchDelete/blackAppAccess` | POST |
| DELETE_APPACCESS_AUTH | `/xdap-app/appAccess/delete` | POST |
| ROLE_PARAM_INSERT_OR_UPDATE | `/xdap-app/roleParam/insertOrUpdate/roleParam` | POST |
| DELETE_ROLEPARAM_AUTH | `/xdap-app/roleParam/delete/roleParam` | POST |
| QUERY_DATA_PERMISSION_VERSION | `/xdap-app/formConfig/query/permissionStyle` | GET |
| QUERY_ENVIRONMENT_IDENTITY_VAR_NO_PAGE | `/xdap-app/identityConfig/queryAllConfigNoPage` | GET |
| QUERY_FORM_FIELD_ALL_IN_ONE | `/xdap-app/form/query/formComponent` | POST |
| QUERY_FORM_DATA_PERMISSIONS | `/xdap-app/formConfig/query/formPermissionByFormId` | GET |
| QUERY_FORM_DATA_ADVANCED_PERMISSIONS | `/xdap-app/formConfig/query/advancedFormPermissionByFormId` | GET |
| QUERY_TODO_PERMISSION | `/xdap-app/processIdentityConfig/queryProcessIdentityPermissionConfig` | GET |
| SAVE_FORM_DATA_PERMISSIONS | `/xdap-app/formConfig/update/formPermission` | POST |
| SAVE_TODO_PERMISSION | `/xdap-app/processIdentityConfig/saveProcessIdentityPermissionConfig` | POST |
| SAVE_FORM_ADVANCED_DATA_PERMISSIONS | `/xdap-app/formConfig/update/advancedFormPermission` | POST |
| QUERY_PROCESS_LIST_BY_APPID | `/xdap-app/process/query/processList` | GET |
| QUERY_DICTIONARY_VALUE_LIST | `/xdap-app/dataDictionary/query/dictionaryValueList` | POST |
| QUERY_IDENTITY_BUSINESS_DATA | `/xdap-app/identity/select/dataSelectorData` | POST |
