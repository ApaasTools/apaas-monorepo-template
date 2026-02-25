/**
 * 判断url是否包含中文
 * @param {string} encodedUrl 编码后的url
 * @returns {boolean} 是否包含中文
 */
export function isChineseInEncodedUrl(encodedUrl) {
  try {
    const decoded = decodeURIComponent(encodedUrl)
    const hasChinese = /[\u4e00-\u9fa5]/.test(decoded)
    return hasChinese
  } catch (e) {
    console.error('Invalid URL encoding:', e)
    return false // 如果解码失败，返回 false
  }
}

/**
 * 判断字符串是否包含中文
 * @param {string} str 字符串
 * @returns {boolean} 是否包含中文
 */
export function isChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str)
}

/**
 * 例 ["N"] 或者 {name： "张三"}
 * @param {}   判断数据是否为空
 * @returns true 和 false
 */
export function isEmpty(obj) {
  if (obj) {
    return JSON.stringify(obj) === '{}' || JSON.stringify(obj) === '[]' // 如果对象属性为空，则返回true
  } else {
    return true
  }
}

/**
 * 格式化数组值，提取数组中第一个对象的指定属性
 * @param {Array|Object} value 要格式化的值
 */
export function formatArrayValue(value) {
  try {
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
  } catch {
    return ''
  }
}

export function localGet(key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

/**
 * 本地存储
 * @param {string} key 键
 * @param {any} value 值
 */
export function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 本地存储
 * @param {string} key 键
 */
export function localRemove(key) {
  window.localStorage.removeItem(key)
}

/**
 * 本地存储删除
 */
export function localClear() {
  window.localStorage.clear()
}
