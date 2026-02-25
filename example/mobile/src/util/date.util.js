export default {

  /**
   * 是否式日期年
   * @param {*} value 值
   */
  isYear(value) {
    const reg = new RegExp('[0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3}$')
    if (reg.test(value)) {
      return true
    } else {
      return false
    }
  },

  /**
   * 是否式日期年月
   * @param {*} value 值
   * @param {*} split1 分割符
   */
  isYearMonth(value, split1 = '\\/') {
    const reg = new RegExp('([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})' + split1 + '(0[1-9]|1[0-2])$')
    if (reg.test(value)) {
      return true
    } else {
      return false
    }
  },

  /**
   * 是否式日期年月日
   * @param {*} value 值
   * @param {*} split1 分割符1
   * @param {*} split2 分割符2
   */
  isYearMonthDay(value, split1 = '\\/', split2 = '\\/') {
    const reg = new RegExp('(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})' + split1 + '(((0[13578]|1[02])' + split2 + '(0[1-9]|[12][0-9]|3[01]))|' +
    '((0[469]|11)' + split2 + '(0[1-9]|[12][0-9]|30))|(02' + split2 + '(0[1-9]|[1][0-9]|2[0-8]))))$|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|' +
    '((0[48]|[2468][048]|[3579][26])00))' + split1 + '02' + split2 + '29)$')
    if (reg.test(value)) {
      return true
    } else {
      return false
    }
  },

  /**
   * 是否式日期年月日时间
   * @param {*} value 值
   * @param {*} split1 分割符1
   * @param {*} split2 分割符2
   * @param {*} split3 分割符3
   * @param {*} split4 分割符4
   * @param {*} split5 分割符5
   */
  isYearMonthDayTime(value, split1 = '\\/', split2 = '\\/', split3 = '\\s', split4 = '\\/', split5 = '\\/') {
    const reg = new RegExp('((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})' + split1 + '(((0[13578]|1[02])' + split2 + '(0[1-9]|[12][0-9]|3[01]))|' +
    '((0[469]|11)' + split2 + '(0[1-9]|[12][0-9]|30))|(02' + split2 + '(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|' +
    '((0[48]|[2468][048]|[3579][26])00))' + split1 + '02' + split2 + '29))' +
    split3 + '([0-1][0-9]|2[0-3])' + split4 + '([0-5][0-9])' + split5 + '([0-5][0-9])$')
    if (reg.test(value)) {
      return true
    } else {
      return false
    }
  },

  getDateValue(value, type) {
    let now = new Date(value)
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    let date = now.getDate()
    if (date < 10) {
      date = '0' + date
    }
    let hour = now.getHours()
    if (hour < 10) {
      hour = '0' + hour
    }
    let minute = now.getMinutes()
    if (minute < 10) {
      minute = '0' + minute
    }
    let second = now.getSeconds()
    if (second < 10) {
      second = '0' + second
    }
    if (type === 'DATE_TIME') {
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    } else if (type === 'YEAR_MONTH') {
      return year + '-' + month
    } else if (type === 'ONLY_YEAR') {
      return year
    } else {
      return year + '-' + month + '-' + date
    }
  }
}
