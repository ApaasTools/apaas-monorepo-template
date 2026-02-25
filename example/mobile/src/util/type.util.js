const isType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}

const isString = isType('String')

const isArray = isType('Array')

const isObject = isType('Object')

const isFunction = isType('Function')

const isNumber = isType('Number')

export default {
  isType,
  isString,
  isArray,
  isObject,
  isFunction,
  isNumber
}
