export default {
  formatPhone(value) {
    if (/^1[3456789]\d{9}$/.test(value)) {
      return value.substring(0, 3) + ' ' + value.substring(3, 7) + ' ' + value.substring(7, 11)
    } else {
      return value
    }
  },

  isPhone(value) {
    const tel = value.replace(/ /g, '')
    if (!/^\d*$/.test(tel) || tel.length > 11) {
      return false
    } else {
      return tel
    }
  }
}
