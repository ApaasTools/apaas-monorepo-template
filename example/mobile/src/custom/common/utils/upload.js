/**
 * 创建下载链接并下载
 * @param {String} url 文件链接
 * @param {String} fileName 文件名称
 * @returns {void}
 */
export const createDownloadLink = (url, fileName) => {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
    if (window.URL.revokeObjectURL) window.URL.revokeObjectURL(url)
  }, 100)
}

/**
 * 下载文件
 * @param {Object} file 文件对象, 包含 fileId 和 uploadUser
 * @param {string} file.fileId 文件id
 * @param {string} file.uploadUser 上传用户
 * @param {string} file.fileName 文件名称
 * ...其他参数
 * @returns {void}
 */
export const downloadFile = async (file) => {
  try {
    const url = `/xdap-app/yctp-file/getDownloadUrl/${file.fileId}?userId=${file?.uploadUser}`
    const resp = await fetch(url).then((res) => res.json())
    if (resp.code !== 'ok') return false
    const bolb = await fetch(resp.data).then((res) => res.blob())
    const blobUrl = window.URL.createObjectURL(bolb)
    createDownloadLink(blobUrl, file?.fileName)
    return true
  } catch (error) {
    console.error('下载文件失败', error)
    return false
  }
}
