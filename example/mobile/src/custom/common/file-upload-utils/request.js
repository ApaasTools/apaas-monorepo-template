/*
 * @Description:
 * @Author: zhengfei.tan
 * @Date: 2022-12-06 09:22:48
 * @FilePath: \yctp-storage\src\utils\request.js
 * @LastEditors: zhengfei.tan
 * @LastEditTime: 2023-02-14 10:54:41
 */
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'
axios.defaults.headers.put = {}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_DOMAIN, // url = base url + request url
  timeout: 600000 // request timeout
})
service.defaults.headers.put = {}

// request interceptor
service.interceptors.request.use(
  config => {
    // 拦截添加token有问题
    //  console.log(`config:${config.baseURL}:`, config.headers)
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject(response)
    }
    const res = response.data
    return res
  },
  error => {
    console.error('err:' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
