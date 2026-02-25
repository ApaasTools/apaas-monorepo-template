// 护照校验
const WidgetPassPortCardValidator = (errorMsg) => {
  return (rule, value, callback) => {
    if (value) {
      // 护照
      // 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
      // 样本： 141234567, G12345678, P1234567
      var reg = /^([a-zA-z]|[0-9]){5,17}$/
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

export default WidgetPassPortCardValidator
