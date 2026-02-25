<template>
  <div class="error-417">
    <div class="error-page-img">
      <div class="error-img-box">
        <div class="error-page-title">
          {{ $t('blank.errorPage.title') }}
        </div>
        <img class="error-img" :src="imgUrl" alt="" srcset="">
      </div>
    </div>
    <div class="error-page-login" @click="linkToWorkBench">
      {{ $t('blank.errorPage.linkToWorkBench') }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
import { CLEAR_TENANT_STORE } from '@/store/tenant.store.js'

export default {
  data() {
    return {
      imgUrl: ''
    }
  },
  computed: {
    ...mapState({
      currentOrg: (state) => state.tenantModule.currentOrg
    })
  },
  created() {
    this.imgUrl = Vue.GLOBAL_ENV.VUE_APP_PUBLIC_PATH + 'img/error.png'
  },
  methods: {
    ...mapMutations('tenantModule', {
      clearTenant: CLEAR_TENANT_STORE
    }),
    linkToWorkBench() {
      const currentOrgId = this.currentOrg && this.currentOrg.id
      this.clearTenant()
      this.$router.push({
        name: 'home-page',
        params: { orgId: currentOrgId || 'orgId' }
      })
    }
  }
}
</script>

<style lang="scss">
.error-417 {
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
