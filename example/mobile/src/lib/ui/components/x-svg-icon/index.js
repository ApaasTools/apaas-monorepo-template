/*
 * @Author: your name
 * @Date: 2020-05-26 10:09:02
 * @LastEditTime: 2020-07-24 17:39:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/lib/ui/components/x-svg-icon/index.js
 */ 
import XSvgIcon from './x-svg-icon.vue'
import AssetsLoader from '../../assets-loader'

XSvgIcon.install = (vue) => {
  AssetsLoader.requireAllSvg()
  vue.component(XSvgIcon.name, XSvgIcon)
}

export default XSvgIcon
