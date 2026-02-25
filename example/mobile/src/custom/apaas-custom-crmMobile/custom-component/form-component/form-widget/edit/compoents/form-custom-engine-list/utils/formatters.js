/**
 * @Description: 格式化工具函数
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-engine-list/utils/formatters.js
 */

/**
 * 格式化主机厂名称
 * @param {Object|String} value - 主机厂数据对象或字符串
 * @returns {String} 格式化后的主机厂名称
 */
export function formatPlantDp(value) {
  if (!value) return ''

  try {
    // 首先尝试从数组格式中提取值
    const extractedValue = extractArrayValue(value)

    // 如果是对象，获取名称属性
    if (typeof extractedValue === 'object' && extractedValue !== null) {
      return extractedValue.plantName || extractedValue.name || ''
    }

    // 如果是可能是JSON字符串的对象
    if (typeof extractedValue === 'string' && extractedValue.startsWith('{')) {
      try {
        const parsedObj = JSON.parse(extractedValue)
        return parsedObj.plantName || parsedObj.name || extractedValue
      } catch (e) {
        return extractedValue
      }
    }

    return extractedValue
  } catch (err) {
    console.error('格式化主机厂名称出错:', err)
    return value
  }
}

/**
 * 格式化状态字段
 * @param {String|Array} value - 状态值
 * @param {String} dictionaryCode - 字典代码
 * @param {Object} dictionaryData - 字典数据
 * @returns {String} 格式化后的状态文本
 */
export function formatStatus(value, dictionaryCode, dictionaryData) {
  if (!value) return ''

  try {
    // 首先使用extractArrayValue提取值
    const valueToUse = extractArrayValue(value)

    if (dictionaryData && dictionaryData[dictionaryCode]) {
      const obj = dictionaryData[dictionaryCode].find((e) => {
        if (typeof valueToUse === 'string') {
          return valueToUse.includes(e.valueCode) || e.valueCode.includes(valueToUse)
        }
        return false
      })

      if (obj) {
        return obj.valueName
      }
    }

    return valueToUse
  } catch (err) {
    console.error('格式化状态出错:', err, value, dictionaryCode)
    return value
  }
}

// 从字符串形式的JSON数组中提取值
export function extractArrayValue(value) {
  if (!value) return ''

  try {
    return (
      value
        ?.replace(/"/g, '')
        .replace(/\[/g, '')
        .replace(/\]/g, '') ?? ''
    )
  } catch (e) {
    console.error('解析数组值失败:', e)
    return value
  }
}

/**
 * 格式化函数映射
 */
export const formatters = {
  formatPlantDp,
  formatStatus,
  extractArrayValue
}
