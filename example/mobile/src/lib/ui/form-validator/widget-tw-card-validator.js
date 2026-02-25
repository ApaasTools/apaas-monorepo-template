// 台湾居民来往大陆通行证
const WidgetTwCardValidator = (errorMsg) => {
  return (rule, value, callback) => {
    if (value) {
      // 台湾居民来往大陆通行证
      // 规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
      // 样本： 12345678 或 1234567890B
      var reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
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

export default WidgetTwCardValidator
