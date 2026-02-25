<!--
 * @Author: your name
 * @Date: 2020-07-24 20:08:42
 * @LastEditTime: 2021-06-24 17:26:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/pages/account/login/login.vue
-->
<template>
  <div class="login">
    <div class="login-logo">
      <img :src="$envUrl('img/custom_img/logo.png')" alt="">
    </div>
    <div class="login-content">
      <component
        :is="loginComponent"
        @toggle="handleToggle"
        @login="handleLogin"
        @success="handleSuccess"
      ></component>
    </div>
  </div>
</template>

<script>
import PlainLogin from './plain-login/plain-login'
import PhoneLogin from './phone-login/phone-login'

const LOGIN_COMPONENTS = {
  PlainLogin,
  PhoneLogin
}
export default {
  components: {
    ...LOGIN_COMPONENTS
  },
  inject: ['getBlankRouter'],
  data() {
    return {
      loginComponent: 'PlainLogin',
      alreayGetLogo: false,
      orgLogoUrl: ''
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    handleToggle(componentName) {
      if (componentName in LOGIN_COMPONENTS) {
        this.loginComponent = componentName
      }
    },
    // ! deprecated
    handleSuccess(data) {
    },
    handleLogin({ type, data, callback }) {
    }
  }
}
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background-color: $--app-box-bgColor;
  .login-logo {
    width: 14.29rem;
    height: 3.71rem;
    margin-bottom: 9rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-content {
    width: 100%;
    padding: 1rem 2rem;
    box-sizing: border-box;
  }
}
</style>
