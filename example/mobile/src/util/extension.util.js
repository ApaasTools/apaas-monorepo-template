/*
 * @Author: lizhihang
 * @Date: 2021-03-24 20:02:46
 * @LastEditors: lizhihang
 * @LastEditTime: 2021-03-24 20:19:27
 * @Description: util
 * @FilePath: \x-project-app\src\util\extension.util.js
 */
// 获取插件列表
function getXDapPluginList(xDapPlugin) {
  const xDapPluginStr = xDapPlugin.split(',')[0]
  let extensionList
  try {
    extensionList = window.atob(xDapPluginStr).split(',')
  } catch (error) {
    console.error(error)
  }
  return extensionList
}
export default {
  getXDapPluginList: getXDapPluginList,
  // 判断是否存在某个插件
  existPlugin(xDapPlugin, pluginName) {
    if (xDapPlugin) {
      const extensionList = getXDapPluginList(xDapPlugin)
      if (extensionList && extensionList.length > 0) {
        if (extensionList.includes(pluginName)) {
          return true
        }
      }
    }
    return false
  }
}
