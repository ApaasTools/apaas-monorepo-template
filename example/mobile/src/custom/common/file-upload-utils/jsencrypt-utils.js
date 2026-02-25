// /*加解密
//  * @Description:
//  * @Author: zhengfei.tan
//  * @Date: 2022-12-06 10:34:22
//  * @FilePath: \yctp-storage\src\utils\jsencryptUtils.js
//  * @LastEditors: zhengfei.tan
//  * @LastEditTime: 2022-12-06 10:34:23
//  */
// // import JSEncrypt from 'jsencrypt'
// import { JSEncrypt } from 'encryptlong'
// import CryptoJS from 'crypto-js'

// /**
//  * 解密方法
//  * @param {} str 字符串
//  */
// export function decrypted(str) {
//   let decrypt = new JSEncrypt()
//   decrypt.setPrivateKey(ENVIRONMENT.PRIVATE_KEY)
//   let uncrypted = decrypt.decryptLong(str)
//   return uncrypted
// }

// /**
//  * 加密方法
//  * @param {*} str
//  */
// export function encrypted(str) {
//   let encrypt = new JSEncrypt()
//   encrypt.setPublicKey(ENVIRONMENT.PUBLIC_KEY)
//   let encrypted = encrypt.encryptLong(str)
//   return encrypted
// }

// /**
//  * 加密对象字符串
//  */
// export function encryptedObject(obj) {
//   console.log('加密前:', obj);
//   const srt = JSON.stringify(obj)
//   return encrypted(JSON.stringify(srt))
// }

// export default { decrypted, encrypted, encryptedObject }
