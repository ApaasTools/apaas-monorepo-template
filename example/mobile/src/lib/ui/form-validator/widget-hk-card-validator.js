// 港澳居民来往内地通行证
const WidgetHkCardValidator = (errorMsg) => {
  return (rule, value, callback) => {
    if (value) {
      // 港澳居民来往内地通行证
      // 规则： H/M + 10位或6位数字
      // 样本： H1234567890
      var reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/
      if (reg.test(value) === false) {
        return callback(new Error(errorMsg))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  }
}

export default WidgetHkCardValidator
