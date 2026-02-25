/*
 * @Description:
 * @Author: zhengfei.tan
 * @Date: 2022-12-09 13:45:44
 * @FilePath: \yctp-storage\src\utils\downloadFile.js
 * @LastEditors: zhengfei.tan
 * @LastEditTime: 2022-12-09 16:42:19
 */
export function download(blob, fileName) {
  let url = window.URL.createObjectURL(blob)
  // 打开新窗口方式进行下载
  // 以动态创建a标签进行下载
  if (window.navigator.msSaveBlob) {
    // for ie 10 and later
    try {
      window.navigator.msSaveBlob(blob, fileName)
    } catch (e) {
      this.message.showErrorMessage(e)
    }
  } else {
    // 其他浏览器
    let a = document.createElement('a')
    a.href = url
    a.download = fileName
    let evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    a.dispatchEvent(evt)
    window.URL.revokeObjectURL(url)
  }
}
