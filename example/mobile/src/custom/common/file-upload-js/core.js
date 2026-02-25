/*
 * @Description:
 * @Author: zhengfei.tan
 * @Date: 2022-12-08 09:01:50
 * @FilePath: \yctp-storage\src\js\core.js
 * @LastEditors: zhengfei.tan
 * @LastEditTime: 2023-02-20 15:00:18
 */
import { parseTime } from '../file-upload-utils/date-utils'

export function uploadHandler(option) {
  // 获取连接
  option.partSizeStr = `${5 * 1024 * 1025}L`
  option.partSize = 5 * 1024 * 1025
  if (option.file) {
    option.fileName = parseTime(new Date()).substring(0, 7) + '/' + option.file.name
    option.contentType = option.file.type
    // 文件大小 单位kb
    // option.fileSize = converFileSizeToKB(option.file.size).toString()
    option.fileSize = returnFileSize(option.file.size)
    // 原生的b
    option.size = option.file.size
    option.fileType = returnFileType(option.file.type)
  }
  return option
}

/**
 * 计算切片总数
 * @param {*} fileLength 文件大小
 * @param {*} partSize 切片大小
 * @returns
 */
export function caclPartCount(fileLength, partSize) {
  return fileLength % partSize === 0
    ? Math.floor(fileLength / partSize)
    : Math.floor(fileLength / partSize) + 1
}

// 切片
export function createPart(file, partSize) {
  const chunkList = []
  let cur = 0
  while (cur < file.size) {
    // 使用slice方法切片
    chunkList.push({ file: file.slice(cur, cur + partSize) })
    cur += partSize
  }
  return chunkList
}

/**
 * 换算文件大小
 * @param {*} number
 * @returns
 */
export function returnFileSize(number) {
  if (number < 1024) {
    return number + 'bytes'
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'KB'
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + 'MB'
  }
}
/**
 * 换算文件大小 换成KB
 * @param {*} number
 * @returns
 */
export function converFileSizeToKB(number) {
  return (number / 1024).toFixed(2)
}

export function returnFileType(type) {
  if (!type) {
    return 'unknown'
  }
  let typeArray = type.split('/')
  return typeArray[0]
}

export default {
  caclPartCount,
  createPart,
  returnFileSize
}
