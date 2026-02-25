/*
 * @Author: your name
 * @Date: 2020-05-28 19:23:00
 * @LastEditTime: 2020-07-24 17:39:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/lib/ui/assets-loader.js
 */ 
export default {
  requireAllSvg: function() {
    const requireAll = (requireContext) => requireContext.keys().map(requireContext)
    const req = require.context('./assets/icon', true, /\.svg$/)
    requireAll(req)
  },

  /**
   * 支持App应用动态导入图标
   * @param { require.context('./assets/icon', true, /\.svg$/) }
   */
  requireAppSvg: function(reqContext) {
    const requireAll = (requireContext) => requireContext.keys().map(requireContext)
    const req = reqContext
    requireAll(req)
  }
}
