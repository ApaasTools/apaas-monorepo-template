// 身份证校验
const WidgetIdCardValidator = (errorMsg) => {
  return (rule, value, callback) => {
    if (value) {
      // 1 "验证通过!", 0 //校验不通过
      var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
      // 号码规则校验
      if (!format.test(value)) {
        return callback(new Error(`身份证号码${errorMsg}`))
      }
      // 区位码校验
      // 出生年月日校验   前正则限制起始年份为1900
      var year = value.substr(6, 4) // 身份证年
      var month = value.substr(10, 2) // 身份证月
      var date = value.substr(12, 2) // 身份证日
      var time = Date.parse(month + '-' + date + '-' + year) // 身份证日期时间戳date
      var nowTime = Date.parse(new Date()) // 当前时间戳
      var dates = new Date(year, month, 0).getDate() // 身份证当月天数
      if (time > nowTime || date > dates) {
        return callback(new Error(`出生日期${errorMsg}`))
      }
      // 校验码判断
      var c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
      var b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
      var idArray = value.split('')
      var sum = 0
      for (var k = 0; k < 17; k++) {
        sum += parseInt(idArray[k]) * parseInt(c[k])
      }
      if (idArray[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
        return callback(new Error(`身份证校验码${errorMsg}`))
      }
      return callback()
    } else {
      return callback()
    }
  }
}

export default WidgetIdCardValidator
