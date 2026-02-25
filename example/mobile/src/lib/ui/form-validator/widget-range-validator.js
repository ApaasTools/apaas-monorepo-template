const WidgetRangeValidator = function(min, max, errorMsg) {
  return (rule, value, callback) => {
    if (value !== null && value !== undefined && value !== '') {
      if (min !== null && min !== undefined) {
        if (value < min) {
          callback(new Error(`${errorMsg}不能小于${min}`))
        } else {
          if (max !== null && max !== undefined) {
            if (value > max) {
              callback(new Error(`${errorMsg}不能大于${max}`))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      } else {
        if (max !== null && max !== undefined) {
          if (value > max) {
            callback(new Error(`${errorMsg}不能大于${max}`))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    } else {
      callback()
    }
  }
}

export default WidgetRangeValidator
