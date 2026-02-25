const ua = '' + window.navigator.userAgent.toLowerCase()
// 是否是微信或者企业微信
export function isWechat() {
  return ua.match(/MicroMessenger/i) == 'micromessenger'
}

// 是否只是微信
export function isOnlyWechat() {
  return ua.match(/micromessenger/i) != null && !ua.match(/wxwork/i)
}
// 是否是飞书
export function isFeishu() {
  return ua.match(/lark/i) == 'lark'
}

// 是否只是企业微信
export function isOnlyWeCom() {
  return ua.match(/micromessenger/i) != null && ua.match(/wxwork/i)
}

// 是否是ios系统
export function isIos() {
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i)
}

export function isPhone() {
  let mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return mobile !== null
}