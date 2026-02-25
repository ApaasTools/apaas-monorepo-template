/*
 * @Description:
 * @Author: zhengfei.tan
 * @Date: 2022-12-08 21:10:06
 * @FilePath: \yctp-storage\src\utils\throttle.js
 * @LastEditors: zhengfei.tan
 * @LastEditTime: 2022-12-08 21:10:07
 */
export default function throttle(func, ms = 1000) {
  let canRun = true
  return function (...args) {
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      func.apply(this, args)
      canRun = true
    }, ms)
  }
}
