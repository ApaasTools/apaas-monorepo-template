const WidgetEmailValidator = (errorMsg) => {
  return (rule, value, callback) => {
    if (value) {
      var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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

export default WidgetEmailValidator