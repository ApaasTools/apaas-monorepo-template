// enum FormFieldType {
//   /** 输入框 */
//   INPUT = 'input',
//   /** 选择框 */
//   SELECT = 'select',
//   /** 单选框 */
//   RADIO = 'radio',
//   /** 多选框 */
//   CHECKBOX = 'checkbox',
//   /** 文本域 */
//   TEXTAREA = 'textarea',
//   /** 日期选择器 */
//   DATE_PICKER = 'datePicker',
//   /** 日期范围选择器 */
//   DATE_RANGE_PICKER = 'dateRangePicker',
//   /** 弹出选择器 */
//   SELECT_POPUP = 'selectPopup'
// }

// interface ExtraField {
//   /** 验证规则 */
//   validator?: (value: any) => boolean
//   /** 格式化函数 */
//   formatter?: (value: any) => any
//   /** 其他配置 */
//   [key: string]: any
// }

// interface BaseFormField {
//   /** 字段名称 */
//   label: string
//   /** 字段属性名 */
//   prop: string
//   /** 是否必填 */
//   required?: boolean
//   /** 字段配置 */
//   attrs?: HTMLElement['attributes']
//   /** 字段事件 */
//   events?: HTMLElementEventMap
//   /** 额外配置 */
//   extra?: ExtraField
//   /** 字段配置 */
// }

// interface OtherFormField extends BaseFormField {
//   /** 字段显示类型 */
//   type: Omit<FormFieldType, FormFieldType.SELECT | FormFieldType.SELECT_POPUP>
// }

// interface SelectFormField<T = any> extends BaseFormField {
//   /** 字段显示类型 */
//   type: FormFieldType.SELECT | FormFieldType.SELECT_POPUP
//   /** 选项 */
//   options: Array<{ label: string; value: T }>
// }

// type FormField = SelectFormField | OtherFormField
