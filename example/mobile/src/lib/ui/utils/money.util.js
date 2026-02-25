export default {
  formatThousandth(num, cent, isThousand) {
    const reg = /\d{1,3}(?=(\d{3})+$)/g
    let result
    if (num || parseFloat(num) === 0) {
      num = num.toString().replace(/$|,/g, '')
      const dotIndex = num.indexOf('.')
      if (dotIndex > -1) {
        let dotLeft = num.substring(0, dotIndex)
        if (isThousand) {
          dotLeft = (dotLeft + '').replace(reg, '$&,')
        }
        let dotRight = num.substring(dotIndex + 1, dotIndex + cent + 1)
        if (dotRight.length < cent) {
          while (dotRight.length < cent) {
            dotRight += '0'
          }
        }
        result = `${dotLeft}.${dotRight}`
      } else {
        if (isThousand) {
          result = (num + '').replace(reg, '$&,')
        } else {
          result = num
        }
        if (cent > 0) {
          result += '.'
          for (let i = 0; i < cent; i++) {
            result += '0'
          }
        }
      }
    }
    return result
  },

  formatDX(value) {
    if (value === null || value === undefined || value === '') {
      return ''
    }

    var n = parseFloat(value)
    if (n === 0) {
      return '零'
    }
    if (!/^(\+|-)?(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
      return '数据非法'
    }
    var unit = '仟佰拾万仟佰拾亿仟佰拾万仟佰拾元角分'
    var str = ''
    n += '00'
    var a = parseFloat(n)
    if (a < 0) {
      n = n.substr(1)
    }
    var p = n.indexOf('.')
    if (p >= 0) {
      n = n.substring(0, p) + n.substr(p + 1, 2)
    }

    unit = unit.substr(unit.length - n.length)

    for (var i = 0; i < n.length; i++) {
      str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
    }
    if (a > 0) {
      return str
        .replace(/零(仟|佰|拾|角)/g, '零')
        .replace(/(零)+/g, '零')
        .replace(/零(万|亿|元)/g, '$1')
        .replace(/(亿)万|壹(拾)/g, '$1$2')
        .replace(/^元零?|零分/g, '')
        .replace(/元$/g, '元整')
    } else {
      return (
        '负' +
        str
          .replace(/零(仟|佰|拾|角)/g, '零')
          .replace(/(零)+/g, '零')
          .replace(/零(万|亿|元)/g, '$1')
          .replace(/(亿)万|壹(拾)/g, '$1$2')
          .replace(/^元零?|零分/g, '')
          .replace(/元$/g, '元整')
      )
    }
  },
   /**
   * 判断一个变量是否是一个数字
   * 例如：字符串'-123.000'是一个数字，数字类型123是一个数字，数字类型NaN不是一个数字等
   */
  isAnNumber(value) {
    if (value !== null && value !== undefined) {
      if (Object.prototype.toString.call(value) === `[object String]`) {
        if (value) {
          const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
          if (reg.test(value)) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else if (Object.prototype.toString.call(value) === `[object Number]`) {
        if (!isNaN(value)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }
}
