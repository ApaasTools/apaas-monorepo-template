const WidgetPhoneValidator = (errorMsg) => {
  return (rule, value, callback) => {
    if (value) {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error(errorMsg))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  }
}

export default WidgetPhoneValidator
