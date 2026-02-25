<!--
 * @Author: your name
 * @Date: 2020-07-23 16:20:22
 * @LastEditTime: 2021-04-15 16:18:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xdap-h5\src\App.vue
-->
<template>
  <div id="app">
    <keep-alive :include="include">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { SET_USER_INFO } from '@/store/auth.store'

export default {
  components: {
  },
  data() {
    return {
      keepAliveComps: {}
    }
  },
  provide() {
    return {
      addKeepAlive: this.addKeepAlive,
      removeKeepAlive: this.removeKeepAlive
    }
  },
  computed: {
    include() {
      console.log('include', Object.keys(this.keepAliveComps))
      return Object.keys(this.keepAliveComps)
    }
  },
  created() {
    this.setUserInfo({
      'loginName': 'admin',
      'id': '1',
      'phone': '17729389320',
      'email': '17728389320@163.com',
      'enableStatus': 'ENABLED',
      'headPortrait': null,
      'userName': '赵站洋',
      'credentialNo': '110101199003076675',
      'gender': 'male'
    })
  },
  mounted() {
    this.$nextTick(() => {
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      // 如果是IOS设备
      if (isiOS) {
        let flag = false
        let pageBackNormFunc
        // 聚焦后，键盘弹起
        document.body.addEventListener('focusin', () => {
          flag = true
          pageBackNormFunc && clearTimeout(pageBackNormFunc)
        })
        // 失焦后，键盘关闭
        document.body.addEventListener('focusout', () => {
          if (flag) {
            // 页面滚动回原来的位置
            pageBackNormFunc = setTimeout(() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }, 200)
          }
          flag = false
        })
      }
    })
  },
  methods: {
    ...mapMutations('authModule', {
      setUserInfo: SET_USER_INFO
    }),
    addKeepAlive(compName) {
      this.$set(this.keepAliveComps, compName, true)
    },
    removeKeepAlive(compName) {
      this.$delete(this.keepAliveComps, compName)
    }
  }
}
</script>

<style lang="scss">
</style>
