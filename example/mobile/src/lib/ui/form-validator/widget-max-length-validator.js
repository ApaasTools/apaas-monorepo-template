/*
 * @Author: your name
 * @Date: 2020-06-09 21:29:44
 * @LastEditTime: 2020-06-09 21:55:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-project-app/src/validator/maxLength.validator.js
 */
const WidgetMaxLengthValidator = function(length = 16, errorMsg) {
  return (rule, value, callback) => {
    if (value && value.toString().length > length) {
      callback(new Error(errorMsg))
    } else {
      callback()
    }
  }
}

export default WidgetMaxLengthValidator
