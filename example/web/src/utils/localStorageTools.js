/*
 * @Author: your name
 * @Date: 2020-10-27 13:52:29
 * @LastEditTime: 2024-01-31 17:12:32
 * @LastEditors: junfa
 * @Description: In User Settings Edit
 * @FilePath: \apaas-custom-enginecode\src\utils\localStorageTools.js
 */
const localStorage = window.localStorage
const sessionStorage = window.sessionStorage
const appId = (window.GLOBAL_ENV && window.GLOBAL_ENV.VUE_APP_APP_ID) || ''

// 设置localStorage存储数据
export const setLocal = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  localStorage.setItem(`${appId}_${name}`, content)
}

// 获取localStorage存储数据
export const getLocal = (name) => {
  if (!name) return
  let value = localStorage.getItem(`${appId}_${name}`)
  if (value !== null) {
    try {
      value = JSON.parse(value)
    } catch (error) {
      // value = value;
    }
  }
  return value
}

// 删除localStorage存储数据
export const removeLocal = (name) => {
  if (!name) return
  localStorage.removeItem(`${appId}_${name}`)
}

// 设置sessionStorage存储数据
export const setSession = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  sessionStorage.setItem(`${appId}_${name}`, content)
}

// 获取sessionStorage存储数据
export const getSession = (name) => {
  if (!name) return
  let value = sessionStorage.getItem(`${appId}_${name}`)
  if (value !== null) {
    try {
      value = JSON.parse(value)
    } catch (error) {
      // value = value;
    }
  }
  return value
}

// 删除sessionStorage存储数据
export const removeSession = (name) => {
  if (!name) return
  sessionStorage.removeItem(`${appId}_${name}`)
}
