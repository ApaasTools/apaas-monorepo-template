/*
 * @Description: 工具类
 * @Author: HongYu
 * @Date: 2025-02-14 15:28:34
 */

/**
 * @description: 复制到剪贴板
 * @param {string} text 要复制的文本
 * @return {Promise}
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // 不支持 clipboard，使用 textarea 元素进行复制
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const successful = document.execCommand('copy')
    textArea.remove()
    return successful
  } catch (error) {
    console.error(error)
    return false
  }
}

export function isChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str)
}

