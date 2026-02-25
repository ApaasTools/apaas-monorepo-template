/*
 * @Author: your name
 * @Date: 2020-07-23 16:20:22
 * @LastEditTime: 2021-06-24 17:30:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-h5-workspace/packages/xdap-h5/src/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import AccountRouter from '@/pages/account/account.router'
import AdminRouter from '@/pages/admin/admin.router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  AccountRouter,
  AdminRouter
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_PUBLIC_PATH,
  routes
})

export default router
