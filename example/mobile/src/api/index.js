/*
 * @Author: your name
 * @Date: 2020-07-23 19:58:49
 * @LastEditTime: 2021-04-14 16:16:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-h5-workspace/packages/xdap-h5/src/api/index.js
 */
import AccountApi from './account/index'

let apis = {
  querySysDict: {
    // 字典
    url: 'common/querySysDict',
    method: 'post',
    disableSuccessMsg: true
  }
}

const allApis = [{ ...AccountApi }]

const loadApis = () => {
  allApis.forEach((api) => {
    apis[api.module] = { ...api }
  })
  allApis.forEach((api) => {
    apis = { ...apis, ...api }
  })
}

export default apis

export { loadApis, apis }
