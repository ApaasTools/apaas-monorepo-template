<!--
 * @Author: your name
 * @Date: 2020-07-23 18:43:07
 * @LastEditTime: 2021-06-11 12:08:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-h5-workspace/packages/xdap-h5/src/pages/Home.vue
-->
<template>
  <div class="home">
    <keep-alive :include="include">
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Vue from 'vue'
import apis from '@/api'
import { mapMutations, mapState } from 'vuex'
import { SET_ORGS } from '@/store/auth.store.js'
import { SET_CURRENT_ORG, SET_DAPTENAT_VERSION } from '@/store/tenant.store.js'
import { ExtensionEngine } from 'x-extension'
// import { weComSdkInit } from '@/vender/third-sdk/we-com-sdk'
// import { isOnlyWeCom } from '@/lib/ui/utils/platform.util.js'
// import FooterTab from '@/components/footer-tab/index.vue'
export default {
  name: 'Home',
  components: {
    // FooterTab
  },
  provide() {
    return {
      addKeepAlive: this.addKeepAlive,
      removeKeepAlive: this.removeKeepAlive
    }
  },
  data() {
    return {
      keepAliveComps: {}
    }
  },
  computed: {
    include() {
      console.log('include', Object.keys(this.keepAliveComps))
      return Object.keys(this.keepAliveComps)
    },
    ...mapState({
      currentOrg: (state) => state.tenantModule.currentOrg
    })
  },
  watch: {
    $route(to, from) {
      if (from.name === 'FormAssiciated' && to.name === 'form') {
        this.removeKeepAlive('AssociatedFormPage')
      }
      if (to.name === 'form') {
        this.addKeepAlive('AppEngineForm')
      } else if (to.name === 'FormAssiciated') {
        this.addKeepAlive('AssociatedFormPage')
      } else if (
        from.name === 'form' &&
        to.name !== 'AssociatedList' &&
        !to.matched.find((item) => item.path.includes('/form-widget'))
      ) {
        this.removeKeepAlive('AppEngineForm')
      } else if (to.name === 'appList') {
        this.addKeepAlive('AppEngineList')
      } else if (from.name === 'appList' && to.name !== 'form') {
        this.removeKeepAlive('AppEngineList')
      } else if (to.name === 'TableItemDetail') {
        this.addKeepAlive('TableItemDetail')
      } else if (from.name === 'TableItemDetail' && to.name === 'form') {
        this.removeKeepAlive('TableItemDetail')
      } else if (to.name === 'FormTableItemAll') {
        this.addKeepAlive('FormTableItemAll')
      } else if (from.name === 'FormTableItemAll' && to.name === 'form') {
        this.removeKeepAlive('FormTableItemAll')
      }
    }
  },
  // created() {
  //   if (isOnlyWeCom()) {
  //     weComSdkInit()
  //   }
  // },
  beforeRouteEnter(to, from, next) {
    const isSingleApp = ExtensionEngine.getInstance().validateBlock('SINGLE_APP', 'SingleAppConfig')
    if (!isSingleApp) {
      const orgId = to.params.orgId
      const store = require('../store/index.js')
      const proxySetCurrentOrg = function(org) {
        const request = { ...apis.WORKBENCH.QUERY_USER_TENANT_INFO }
        request.params = {
          tenantId: org.id
        }
        return Vue.prototype
          .$request(request)
          .asyncThen(
            (resp) => {
              store.default.commit('tenantModule/SET_CURRENT_ORG', resp.data)
              store.default.commit('tenantModule/SET_DAPTENAT_VERSION', resp.data.limitId)
              return resp.data
            },
            (error) => {
              store.default.commit('tenantModule/SET_CURRENT_ORG', org)
              store.default.commit('tenantModule/SET_DAPTENAT_VERSION', '')
            }
          )
          .asyncErrorCatch((error) => {
            store.default.commit('tenantModule/SET_CURRENT_ORG', org)
            store.default.commit('tenantModule/SET_DAPTENAT_VERSION', '')
          })
      }
      if (typeof orgId !== 'undefined' && (from.name !== 'publicFormContent' && to.name !== 'form')) {
        Vue.prototype.$loading.show()
        const request = { ...apis.WORKBENCH.QUERY_USER_TENANT_INFO }
        request.params = {
          tenantId: orgId
        }
        Vue.prototype
          .$request(request)
          .asyncThen(
            (resp) => {
              Vue.prototype.$loading.hide()
              if (resp.data) {
                const orgs = [resp.data]
                const currentOrg = resp.data
                // next(vm => {
                //   vm.setOrgs(orgs)
                //   if (!vm.currentOrg || !vm.currentOrg.id) {
                //     vm.setCurrentOrg(currentOrg)
                //     vm.proxySetCurrentOrg(currentOrg)
                //     vm.$router.push({ name: 'workbench', params: { orgId: currentOrg.id } })
                //   } else {
                //     vm.$router.push({ name: 'workbench', params: { orgId: vm.currentOrg.id } })
                //   }
                // })
                // 先存session再跳转路由， 要是先跳转路由，到menu路由时，会先拿session里的组织id，导致会拿不到租户id，查应用详情的接口报错
                // home-page是先跳路由再存session，但暂时没有什么问题
                proxySetCurrentOrg(currentOrg).then((resp) => {
                  next((vm) => {
                    vm.setOrgs(orgs)
                    if (!vm.currentOrg || !vm.currentOrg.id) {
                      vm.$router.push({ name: 'workbench', params: { orgId: currentOrg.id } })
                    } else {
                      vm.$router.push({ name: 'workbench', params: { orgId: vm.currentOrg.id } })
                    }
                  })
                })
              } else {
                next((vm) => {
                  vm.setOrgs([])
                  vm.setCurrentOrg({})
                  vm.$router.push({ name: 'org-setting' })
                })
              }
            },
            (err) => {
              Vue.prototype.$loading.hide()
              next({ name: 'org-setting' })
            }
          )
          .asyncErrorCatch((err) => {
            Vue.prototype.$loading.hide()
            next({ name: 'org-setting' })
          })
      } else {
        next()
      }
    } else {
      next()
    }
  },
  methods: {
    ...mapMutations('authModule', {
      setOrgs: SET_ORGS
    }),
    ...mapMutations('tenantModule', {
      setCurrentOrg: SET_CURRENT_ORG,
      setDaptenatVersion: SET_DAPTENAT_VERSION
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
.home {
  width: 100%;
  height: 100%;
}
</style>
