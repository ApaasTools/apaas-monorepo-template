/**
 * @Description: 字段配置文件
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-engine-list/utils/field-configs.js
 */

/**
 * 详情展示字段配置
 */
export const detailFieldConfigs = [
  { label: '发动机编号', prop: 'engineNumber', defaultValue: '未填写' },
  { label: '发动机出厂编号', prop: 'factoryNumber' },
  { label: '发动机新机编号', prop: 'engineNumberNew' },
  { label: '原车数据编号', prop: 'originalDataNumber' },
  { label: '升级数据编号', prop: 'upgradeDataNumber' },
  { label: '主机厂名称', prop: 'plantDp', formatter: 'formatPlantDp' },
  { label: '主机厂代码', prop: 'plantCode' },
  { label: '发动机型号', prop: 'productModel' },
  { label: '经销商名称', prop: 'dealerName' },
  { label: '经销商联系人', prop: 'dealerContactPerson' },
  { label: '经销商联系方式', prop: 'dealerContactInfo' },
  { label: '用户姓名', prop: 'userName' },
  { label: '用户电话', prop: 'userPhoneNumber' },
  { label: '用户所在地', prop: 'userLocation' },
  { label: '首保服务站', prop: 'firstMaintainStationDp' },
  { label: '报修人姓名', prop: 'reporterName' },
  { label: '报修人电话', prop: 'reporterPhone' },
  {
    label: '所在环节',
    prop: 'linkLocated',
    formatter: 'formatStatus',
    dictionaryCode: 'taak_link'
  },
  { label: '责任驻外区域', prop: 'responsibleOfficeDp' },
  { label: '驻外区域编码', prop: 'officeCode' },
  { label: '责任服务站', prop: 'responsibilityStationDp' },
  { label: '服务站编码', prop: 'stationNumber' },
  { label: '调整任务（办事处）', prop: 'adjustTasksOfficeFlag', type: 'boolean' },
  { label: '调整任务（服务站）', prop: 'adjustTasksStationFlag', type: 'boolean' },
  { label: '补发文件', prop: 'resendFile', type: 'boolean' },
  {
    label: '执行状态',
    prop: 'executionStatus',
    formatter: 'formatStatus',
    dictionaryCode: 'Execution_status',
    valueClass: 'status-value'
  },
  {
    label: '任务状态',
    prop: 'taskStatus',
    formatter: 'formatStatus',
    dictionaryCode: 'Task_status',
    valueClass: 'status-value'
  },
  { label: '服务订单', prop: 'serviceDocNumber' },
  { label: '任务项ID', prop: 'taskItemId' },
  { label: '处理日期', prop: 'processingDate' },
  { label: '未处理原因', prop: 'untreateReasons' },
  { label: '预约日期', prop: 'appointmentTime' },
  {
    label: '跟踪效果',
    prop: 'trackingEffect',
    formatter: 'formatStatus',
    dictionaryCode: 'tracking_effect'
  },
  { label: '跟踪效果期限（天）', prop: 'trackingEffectDeadline' },
  { label: '整改效果描述', prop: 'rectificationEffect' },
  { label: '整改效果返回时间', prop: 'rectificationEffectTime' },
  { label: '附件', prop: 'attachment' },
  { label: '备注', prop: 'remarks' }
]

/**
 * 编辑表单字段配置
 */
export const formFieldConfigs = [
  { label: '发动机编号', prop: 'engineNumber', type: 'input', placeholder: '请输入发动机编号' },
  {
    label: '发动机出厂编号',
    prop: 'factoryNumber',
    type: 'input',
    placeholder: '请输入发动机出厂编号'
  },
  {
    label: '发动机新机编号',
    prop: 'engineNumberNew',
    type: 'input',
    placeholder: '请输入发动机新机编号'
  },
  {
    label: '原车数据编号',
    prop: 'originalDataNumber',
    type: 'input',
    placeholder: '请输入原车数据编号'
  },
  {
    label: '升级数据编号',
    prop: 'upgradeDataNumber',
    type: 'input',
    placeholder: '请输入升级数据编号'
  },
  {
    label: '主机厂名称',
    prop: 'plantDp',
    type: 'input',
    placeholder: '请输入主机厂名称'
  },
  { label: '主机厂代码', prop: 'plantCode', type: 'input', placeholder: '请输入主机厂代码' },
  { label: '发动机型号', prop: 'productModel', type: 'input', placeholder: '请输入发动机型号' },
  { label: '经销商名称', prop: 'dealerName', type: 'input', placeholder: '请输入经销商名称' },
  {
    label: '经销商联系人',
    prop: 'dealerContactPerson',
    type: 'input',
    placeholder: '请输入经销商联系人'
  },
  {
    label: '经销商联系方式',
    prop: 'dealerContactInfo',
    type: 'input',
    placeholder: '请输入经销商联系方式'
  },
  { label: '用户姓名', prop: 'userName', type: 'input', placeholder: '请输入用户姓名' },
  { label: '用户电话', prop: 'userPhoneNumber', type: 'input', placeholder: '请输入用户电话' },
  { label: '用户所在地', prop: 'userLocation', type: 'input', placeholder: '请输入用户所在地' },
  {
    label: '首保服务站',
    prop: 'firstMaintainStationDp',
    type: 'input',
    placeholder: '请输入首保服务站'
  },
  { label: '报修人姓名', prop: 'reporterName', type: 'input', placeholder: '请输入报修人姓名' },
  { label: '报修人电话', prop: 'reporterPhone', type: 'input', placeholder: '请输入报修人电话' },
  {
    label: '所在环节',
    prop: 'linkLocated',
    type: 'select',
    placeholder: '请选择所在环节',
    dictionaryCode: 'taak_link'
  },
  {
    label: '责任驻外区域',
    prop: 'responsibleOfficeDp',
    type: 'search-select',
    placeholder: '请输入搜索责任驻外区域',
    tabId: '63e5d821dfb962656c548cf0',
    formId: '63e5d821dfb962656c548cee'
  },
  { label: '驻外区域编码', prop: 'officeCode', type: 'display' },
  {
    label: '责任服务站',
    prop: 'responsibilityStationDp',
    type: 'search-select',
    placeholder: '请输入搜索责任服务站',
    tabId: '65728979a8f706277f1f24a7',
    formId: '65728979a8f706277f1f24a5'
  },
  { label: '服务站编码', prop: 'stationNumber', type: 'display' },
  { label: '调整任务（办事处）', prop: 'adjustTasksOfficeFlag', type: 'switch' },
  { label: '调整任务（服务站）', prop: 'adjustTasksStationFlag', type: 'switch' },
  { label: '补发文件', prop: 'resendFile', type: 'switch' },
  {
    label: '执行状态',
    prop: 'executionStatus',
    type: 'select',
    placeholder: '请选择执行状态',
    dictionaryCode: 'Execution_status'
  },
  {
    label: '任务状态',
    prop: 'taskStatus',
    type: 'select',
    placeholder: '请选择任务状态',
    dictionaryCode: 'Task_status'
  },
  {
    label: '跟踪效果',
    prop: 'trackingEffect',
    type: 'select',
    placeholder: '请选择跟踪效果',
    dictionaryCode: 'tracking_effect'
  },
  { label: '服务订单', prop: 'serviceDocNumber', type: 'input', placeholder: '请输入服务订单' },
  { label: '任务项ID', prop: 'taskItemId', type: 'input', placeholder: '请输入任务项ID' },
  { label: '处理日期', prop: 'processingDate', type: 'date', placeholder: '请选择处理日期' },
  { label: '未处理原因', prop: 'untreateReasons', type: 'input', placeholder: '请输入未处理原因' },
  { label: '预约日期', prop: 'appointmentTime', type: 'date', placeholder: '请选择预约日期' },
  {
    label: '跟踪效果期限（天）',
    prop: 'trackingEffectDeadline',
    type: 'input',
    placeholder: '请输入跟踪效果期限'
  },
  {
    label: '整改效果描述',
    prop: 'rectificationEffect',
    type: 'input',
    placeholder: '请输入整改效果描述'
  },
  {
    label: '整改效果返回时间',
    prop: 'rectificationEffectTime',
    type: 'date',
    placeholder: '请选择整改效果返回时间'
  },
  { label: '附件', prop: 'attachment', type: 'input', placeholder: '请输入附件' },
  { label: '备注', prop: 'remarks', type: 'input', placeholder: '请输入备注' }
]

/**
 * 列表项展示字段配置
 */
export const listItemFields = [
  { label: '发动机编号', prop: 'engineNumber' },
  { label: '发动机出厂编号', prop: 'factoryNumber' },
  { label: '主机厂名称', prop: 'plantDp', formatter: 'formatPlantDp' },
  { label: '发动机型号', prop: 'productModel' },
  {
    label: '执行状态',
    prop: 'executionStatus',
    formatter: 'formatStatus',
    dictionaryCode: 'Execution_status'
  },
  {
    label: '任务状态',
    prop: 'taskStatus',
    formatter: 'formatStatus',
    dictionaryCode: 'Task_status'
  }
]

/**
 * 格式化函数映射
 */
export const formatters = {
  formatPlantDp: (value, formatFunc) => formatFunc(value),
  formatStatus: (value, code, dictionaryData, formatFunc) => formatFunc(value, code, dictionaryData)
}
