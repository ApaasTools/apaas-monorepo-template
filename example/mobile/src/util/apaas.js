/*
 * @Description: junfa
 * @Author: junfa
 * @Date: 2024-01-09 08:28:34
 * @FilePath: \apaas-custom-enginecode\src\utils\apaas.js
 * @LastEditors: junfa
 * @LastEditTime: 2025-06-13 18:04:44
 */
import { isUndef, isArray, isObject, isString, isNumber, isBoolean } from './type'
/**
 * 例 "[]"
 * @param {*} arrayStr 字符串数组
 * @param {*} number 获取数组的下标
 * @returns String|Array
 */
/**
 * 解析JSON字符串数组并获取指定索引的值
 * @description 该函数用于处理JSON字符串数组，可以获取数组中的指定索引值
 * @param {string|Array} arrayStr - 需要解析的JSON字符串数组或数组
 * @param {number} [number] - 要获取的数组索引值，可选参数
 * @returns {string|Array} - 返回解析后的数组或指定索引的值
 *
 * @example
 * // 示例1: 获取数组第一个元素
 * getJsonArrayStr('["a", "b", "c"]', 0) // 返回 "a"
 *
 * @example
 * // 示例2: 不传索引返回整个数组
 * getJsonArrayStr('["a", "b", "c"]') // 返回 ["a", "b", "c"]
 *
 * @example
 * // 示例3: 传入空值返回空数组
 * getJsonArrayStr(null) // 返回 []
 *
 * @example
 * // 示例4: 传入非JSON字符串返回原值
 * getJsonArrayStr("hello") // 返回 "hello"
 */
export function getJsonArrayStr(arrayStr, number) {
  // 处理空值情况
  if (!arrayStr) {
    if (isUndef(number)) {
      return [] // 如果没有传入索引且值为空，返回空数组
    }
    return '' // 如果传入了索引但值为空，返回空字符串
  }

  let temporary = ''
  try {
    // 尝试解析JSON字符串
    temporary = JSON.parse(arrayStr)
  } catch {
    // 解析失败返回原值
    return arrayStr
  }

  // 如果解析结果不是数组或未传入索引，返回解析后的值
  if (!isArray(temporary) || isUndef(number)) {
    return temporary
  }

  // 返回指定索引的值
  return temporary[number]
}

/**
 * 例 "["N"]"
 * @param {*} Str 字符串数组
 * @returns String|Array
 */
export function getJsonParse(Str) {
  try {
    if (isString(Str)) {
      return JSON.parse(Str)
    } else {
      return Str
    }
  } catch {
    return Str
  }
}
/**
 * 例 "["N"]"
 * @param {*} Str 字符串数组
 * @returns String|Array
 */
export function getJsonStringify(Str) {
  return JSON.stringify(Str)
}

/**
 * 例 ["N"] 或者 {name： "张三"}
 * @param {Array, Object}   数组和对象
 * @returns String
 */
export function getStr(param) {
  if ((isArray(param) || isObject(param)) && !isObjectEmpty(param)) {
    return JSON.stringify(param)
  }
  if (isString(param) || isNumber(param) || isBoolean(param)) {
    return param
  }
  return null
}

/**
 * 例 ["N"] 或者 {name： "张三"}
 * @param {Array, Object}   数组和对象, 判断数组或者对象是否为空
 * @returns true 和 false
 */
export function isObjectEmpty(obj) {
  return JSON.stringify(obj) === '{}' || JSON.stringify(obj) === '[]' // 如果对象属性为空，则返回true
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
 * 例 ["N"] 或者 {name： "张三"}
 * @param {Array, Object}   深拷贝对象或者数组
 * @returns true 和 false
 */
export function deepCopy(data) {
  if (isArray(data) || isObject(data)) {
    return JSON.parse(JSON.stringify(data)) // 返回拷贝之后的数据
  }
}

/**
 * 例 ["N"]
 * @param {Array}   获取只有一个元素的数组的元素
 * @returns true 和 false
 */
export function removeBracket(data, code) {
  if (isArray(data)) {
    if (!isObjectEmpty(data)) {
      return isObject(data[0]) ? data[0][code] : data[0]
    } else {
      return ''
    }
  }
  return data || ''
}

/**
 * 例 ["N"]
 * @param {Array}   获取只有一个元素的数组的元素
 * @returns true 和 false
 */
export function getName(data) {
  if (isArray(data) && !isObjectEmpty(data)) {
    return data[0].name || ''
  }
  if (isObject(data)) {
    return data.name || ''
  }
  return ''
}

/**
 * 例 ["N"]
 * @param {Array}   获取只有一个元素的数组的元素
 * @returns true 和 false
 */
export function getObjArrVal(arr, code) {
  if (isArray(arr) && !isObjectEmpty(arr)) {
    return arr.map((i) => i[code])
  }
  return null
}

/**
 * 例 num, num
 * @param {Number, Number}  需要改变的参数，需要保留的位数 获取js保留小数位
 * @returns true 和 false
 */
export function getDecimalPlaces(num, digit) {
  const data = num * 1
  if (isNumber(data)) {
    return parseFloat(data.toFixed(digit))
  }
  return 0
}

/**
 * 例
 * @param {}  任意数据转数据类型
 * @returns number
 */
export function getNum(num) {
  if (isNaN(num)) {
    return 0
  }
  return Number(num)
}

/**
 * 遍历树形数据
 * @param {*} array
 * @param {*} items
 */
export function findNodes(array, items) {
  array.forEach((arr) => {
    items.push(arr)
    if (arr.submenus && arr.submenus.length > 0) {
      findNodes(arr.submenus, items)
    }
  })
}

/**
 * 深入解析对象
 * @param {*} array
 * @param {*} items
 */
export function objectDeep(object) {
  let newObj = {}
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      if (isObject(object[key])) {
        newObj = { ...newObj, ...object[key] }
      } else {
        newObj[key] = object[key]
      }
    }
  }
  return newObj
}

/**
 * 转换为小驼峰
 * @param {*} String
 * @param {*} "my_field_name"
 */
export function toCamelCase(str) {
  return str.replace(/_([a-z])/g, function(g) {
    return g[1].toUpperCase()
  })
}
/**
 * 转换为大驼峰
 * @param {*} String
 * @param {*} "my_field_name"
 */
export function toPascalCase(str) {
  return str
    .replace(/_([a-z])/g, function(g) {
      return g[1].toUpperCase()
    })
    .replace(/^[a-z]/, function(g) {
      return g.toUpperCase()
    })
}
/**
 * 根据传入的key和value找到返回菜单
 * @param {*}
 */
export function getMenuByCustom(key, value) {
  let xAppLayout = document.getElementsByClassName('x-app-layout') // 实例
  let xAppLayoutVue = null // 实例参数化
  let menuTreeData = null // 菜单树
  // 判断获取菜单示例
  if (xAppLayout && xAppLayout.length > 0) {
    xAppLayoutVue = xAppLayout[0].__vue__
  }
  // 判断获取菜单
  if (xAppLayoutVue) {
    menuTreeData = xAppLayoutVue.menuConfig.menuTreeData
  }
  if (menuTreeData && menuTreeData.length > 0) {
    let menuList = []
    findNodes(menuTreeData, menuList)
    // 查找菜单
    const menuData = menuList.find((f) => f[key] === value)
    return menuData
  }
  return null
}

export const aliasObj = function(obj) {
  let myMap = new Map(Object.entries(obj))
  let countMap = new Map()
  myMap.forEach((v, key) => {
    console.log(v, key)
    let str = toCamelCase(v)
    let num = countMap.get(str) || 0
    let newStr = str
    myMap.set(key, toCamelCase(v))
    if (num > 0) {
      newStr += num
    }
    num++
    countMap.set(str, num)
    myMap.set(key, newStr)
  })
  console.log(myMap)
  let a = Object.fromEntries(myMap)
  console.log(a)
  Object.values(a)
}
