/**
 * 表单验证工具函数
 */

/**
 * 验证表单字段
 * @param {Object} formData 表单数据
 * @param {Array} fieldConfigs 表单字段配置
 * @returns {Object} 验证结果
 */
export function validateForm(formData, fieldConfigs) {
  const errors = {}

  for (const field of fieldConfigs) {
    const { prop, label, required, extra = {} } = field
    const { validator = null, errorMessage = '' } = extra
    const value = formData[prop]

    // 必填项验证
    if (required && !value) {
      errors[prop] = `${label}不能为空`
      continue
    }

    // 自定义验证规则
    if (validator && typeof validator === 'function') {
      const isValid = validator(value)
      if (!isValid) {
        errors[prop] = errorMessage || `${label}格式不正确`
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 常用验证规则
 */
export const rules = {
  // 手机号验证
  mobile: (value) => {
    return /^1[3-9]\d{9}$/.test(value)
  },

  // 邮箱验证
  email: (value) => {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
  },

  // 身份证验证
  idCard: (value) => {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
  },

  // 正整数验证
  integer: (value) => {
    return /^[1-9]\d*$/.test(value)
  },

  // 数字验证
  number: (value) => {
    return !isNaN(value)
  }
}
