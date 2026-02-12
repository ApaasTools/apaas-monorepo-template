/*
 * @Description: junfa
 * @Author: junfa
 * @Date: 2024-01-02 09:19:36
 * @FilePath: \apaas-custom-enginecode\src\utils\type.js
 * @LastEditors: junfa
 * @LastEditTime: 2024-12-19 11:30:45
 */
const isType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}

const isString = isType('String')

const isArray = isType('Array')

const isObject = isType('Object')

const isBoolean = isType('Boolean')

const isFunction = isType('Function')

const isNumber = isType('Number')

const isPromise = isType('Promise')

const isNotEmpty = function(value) {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (typeof value === 'object') {
    return Object.keys(value).length > 0
  }

  return true // 对于数字、布尔值等其他类型，直接认为非空
}
// console.log(isNotEmpty('hello')) // true
// console.log(isNotEmpty('   ')) // false
// console.log(isNotEmpty([1, 2, 3])) // true
// console.log(isNotEmpty([])) // false
// console.log(isNotEmpty({ a: 1 })) // true
// console.log(isNotEmpty({})) // false
// console.log(isNotEmpty(null)) // false
// console.log(isNotEmpty(0)) // true
// console.log(isNotEmpty(false)) // true
export {
  isType,
  isString,
  isArray,
  isObject,
  isFunction,
  isNumber,
  isBoolean,
  isPromise,
  isNotEmpty
}

export function isUndef(v) {
  return v === undefined || v === null
}

export function isDef(v) {
  return v !== undefined && v !== null
}
