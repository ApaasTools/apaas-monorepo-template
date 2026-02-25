<!--
 * @Author: your name
 * @Date: 2020-12-29 15:08:38
 * @LastEditTime: 2021-06-24 17:29:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /x-product-private/xdap-h5/src/pages/error/error-page/error-page.vue
-->
<template>
  <div class="error-page">
    <div class="error-page-img">
      <div class="error-img-box">
        <div class="error-page-title">
          {{ $t('blank.errorPage.title') }}
        </div>
        <img class="error-img" :src="imgUrl" alt="" srcset="">
      </div>
    </div>
    <div v-if="!$route.query.publicFormStatus" class="error-page-login" @click="clickToLogin">
      {{ $t('blank.errorPage.loginButton') }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data() {
    return {
      imgUrl: ''
    }
  },
  created() {
    this.imgUrl = Vue.GLOBAL_ENV.VUE_APP_PUBLIC_PATH + 'img/error.png'
  },
  methods: {
    clickToLogin() {
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style lang="scss">
.error-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $--app-light-color;

  .error-page-img {
    height: 50%;
    position: relative;

    .error-img-box {
      position: absolute;
      bottom: 0;
      left: 0;

      .error-page-title {
        width: 100%;
        text-align: center;
        margin-bottom: 1.714rem;
        font-size: 1.286rem;
        color: $--app-notice-color;
        font-weight: $--app-base-font-weight;
      }

      .error-img {
        width: 100%;
      }
    }
  }

  .error-page-login {
    height: 50%;
    padding-top: 2.857rem;
    text-align: center;
    box-sizing: border-box;
    color: $--app-primary-color;
    font-size: $--app-title-font-size;
  }
}
</style>
