<!--
 * @Author: your name
 * @Date: 2020-07-03 16:22:46
 * @LastEditTime: 2021-01-26 16:28:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-workspace/packages/x-project-app/src/pages/blank/423/todo-manage-page.vue
-->
<template>
  <div class="error-425">
    <div class="header">
      <div class="logo">
        <img class="logo-img" :class="{'logo-img-cursor__default': _isFeishuClient }" :src="$envUrl('img/custom_img/logo.png')" alt="" srcset="" @click="linkToProduct">
      </div>
    </div>
    <div class="content">
      <div class="wrap">
        <span class="title">{{ $t("error423.noPermission") }}</span>
        <img :src="$envUrl('img/423.png')" alt="" srcset="">
        <a @click="clearStore">重新登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import FeishuClientMixin from '@/mixin/feishu-client.mixin'
import { getSsoLogoutUrl } from '@/vender/sso.config.js'
import { mapMutations } from 'vuex'
import {
  SET_CURRENT_ORG,
  CLEAR_TENANT_STORE,
  // SET_CURRENT_DEPARTMENT,
  SET_ONLINE_STATUS,
  SET_DAPTENAT_VERSION,
  SET_PLATFORM_TYPE
} from '@/store/tenant.store.js'
import Vue from 'vue'
export default {
  mixins: [FeishuClientMixin],
  methods: {
    ...mapMutations('tenantModule', {
      setOnLineStatus: SET_ONLINE_STATUS,
      setCurrentOrg: SET_CURRENT_ORG,
      // setCurrentDepartment: SET_CURRENT_DEPARTMENT,
      clearTenantStore: CLEAR_TENANT_STORE,
      setDaptenatVersion: SET_DAPTENAT_VERSION,
      setPlatformType: SET_PLATFORM_TYPE
    }),
    linkToProduct() {
      let url = `${window.location.origin}/`
      if (this._isFeishuClient) {
        // this._redirectUrlOfSelf(url)
      } else {
        window.open(url)
      }
    },
    clearStore() {
      if (Vue.GLOBAL_ENV.VUE_APP_NEED_SSO) {
        try {
          // 清空vuex数据
          this.clearAuthStore()
          this.clearAdminStore()
          // this.clearTenantStore()
          this.setOnLineStatus(false)
        } catch (error) {
          console.error(error)
        }
        window.location.replace(getSsoLogoutUrl())
      } else {
        this.$router.push({
          name: 'login'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.error-425 {
  display: flex;
  flex-flow: column;
  height: 100vh;
  .header {
    width: 100%;
    height: 64px;
    padding: 14px 88px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background-color: #FFF;
    box-shadow: 0 2px 8px 0 rgba(220, 223, 230, 1);
    position: relative;
    z-index: 10;
    .logo-img {
      height: 36px;
      width: 140px;
      cursor: pointer;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    height: calc(100% - 64px);
    position: relative;
    .wrap {
      margin: 0 auto;
      display: flex;
      flex-flow: column;
      align-items: center;
      position: absolute;
      top: calc(50% - 64px);
      transform: translateY(-50%);

      > .title {
        font-size: 32px;
        color: $--app-notice-color;
        font-weight: $--app-base-font-weight;
      }
      > img {
        margin-top: 24px;
        margin-bottom: 20px;
        width: 800px;
        height: 200px;
      }
      > a {
        color: $--app-primary-color;
        font-size: $--app-title-font-size;
        cursor: pointer;
      }
    }
  }
}
</style>
