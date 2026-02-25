/**
 * @Description: 格式化工具函数
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-new-item-list/utils/formatters.js
 */

/**
 * 格式化数组值，提取数组中第一个对象的指定属性
 * @param {Array|Object} value 要格式化的值
 * @param {String} key 要提取的属性名
 * @returns {String} 格式化后的值
 */
export function formatArrayValue(value = '', key = 'name', isStringArray = false) {
  if (!value) return ''
  if (Array.isArray(value) && !isStringArray) {
    return value?.[0]?.[key] || ''
  }
  if (Array.isArray(value) && isStringArray) {
    return (
      value?.[0]
        ?.replace(/"/g, '')
        ?.replace(/\[/g, '')
        ?.replace(/\]/g, '') ||
      value
        ?.replace(/"/g, '')
        ?.replace(/\[/g, '')
        ?.replace(/\]/g, '') ||
      ''
    )
  }

  return (
    value
      ?.replace(/"/g, '')
      ?.replace(/\[/g, '')
      ?.replace(/\]/g, '') ?? ''
  )
}

/**
 * 格式化数组值，提取数组中第一个对象的指定属性
 * @param {Array|Object} value 要格式化的值
 */
export function formatValue(value) {
  let formattedValue = value
  if (Array.isArray(formattedValue)) {
    formattedValue = value?.[0] ?? ''
  }
  return (
    formattedValue
      ?.replace(/"/g, '')
      ?.replace(/\[/g, '')
      ?.replace(/\]/g, '') ?? ''
  )
}

/**
 * 格式化字典值，将字典代码转换为显示名称
 * @param {String} dictCode 字典代码
 * @param {String|Array} value 要格式化的值
 * @param {Object} dictionaryData 字典数据对象
 * @returns {String} 格式化后的值
 */
export function formatDictionaryValue(dictCode, value, dictionaryData) {
  if (!value) return ''

  let itemVal = null
  if (Array.isArray(value) && value.length > 0) {
    itemVal = value[0]
  } else {
    itemVal = value
  }

  if (
    itemVal &&
    dictionaryData[dictCode] &&
    dictionaryData[dictCode].some((s) => itemVal.includes(s.valueCode))
  ) {
    return dictionaryData[dictCode].find((s) => itemVal.includes(s.valueCode))?.valueName
  }

  return itemVal || ''
}

/**
 * 提取数组值，通常用于处理后端返回的数组字段
 * @param {Array} value 要处理的数组
 * @returns {String} 提取的值
 */
export function extractArrayValue(value) {
  if (!value) return ''
  if (Array.isArray(value) && value.length > 0) {
    return value[0]
  }
  return value
}

/**
 * 格式化排放信息
 * @param {Object} dictionaryData 字典数据
 * @param {*} value 排放值
 * @returns {String} 格式化后的排放值
 */
export function formatEmission(dictionaryData, value) {
  return formatDictionaryValue(dictionaryData, 'CRM_MD_EMISSION', value)
}
