<template>
  <div class="join-org">
    <div class="join-org-bg"></div>
    <div ref="publicFormBodyDom" class="join-org-body" @scroll="handleScroll">
      <div class="join-org-container">
        <div class="join-org-body--header">
          <div class="header-info">
            <h4 class="header-info-title">
              加入组织
            </h4>
            <span class="header-info-desc">可通过组织管理获取组织邀请码</span>
          </div>
          <div class="header-logo">
            <x-svg-icon name="join-org"></x-svg-icon>
          </div>
        </div>
        <div class="join-org-body--content">
          <df-form ref="joinOrgForm" :model="joinOrgForm" :rules="rules" @validate="handleValidate">
            <df-form-item prop="inviteCode">
              <div class="invite-code">
                <span class="required-star"></span>组织邀请码
              </div>
              <cube-input
                v-model="joinOrgForm.inviteCode"
                autocomplete="off"
                placeholder="请输入"
                class="input-code"
              ></cube-input>
              <div class="warning" :class="{ visible: !inviteCode }">
                {{ errMsg }}
              </div>
            </df-form-item>
          </df-form>
          <div class="join-org-btn">
            <cube-button primary :loading="loadingButton" @click="handleJoinOrg">
              <div class="join-font">
                <div style="margin-left: -20px">
                  <x-svg-icon
                    v-if="loadingButton"
                    name="refresh-colorless"
                    class="loading-icon join-cube-loading"
                  ></x-svg-icon>
                  <span>加入</span>
                </div>
              </div>
            </cube-button>
          </div>
        </div>
        <div class="join-org-footer">
          <span class="join-org--origin" @click="back">返回</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBehaviorMixin from '@/mixin/scroll-behavior.mixin'
import DfForm from '@/components/df-form/df-form'
import DfFormItem from '@/components/df-form-item/df-form-item'
import apis from '@/api'
import { mapState, mapMutations } from 'vuex'
import { SET_CURRENT_ORG, SET_DAPTENAT_VERSION, SET_TEMP_TENANT } from '@/store/tenant.store.js'
import { SET_ORGS } from '@/store/auth.store.js'

export default {
  components: {
    DfForm,
    DfFormItem
  },
  mixins: [ScrollBehaviorMixin],
  data() {
    return {
      joinOrgForm: {
        inviteCode: ''
      },
      inviteCode: false,
      loadingButton: false,
      errMsg: '',
      rules: {
        inviteCode: [
          {
            type: 'required',
            help: '请输入组织邀请码'
          },
          {
            validator: (rule, value) => {
              const reg = /^[0-9|A-Z]{8}$/
              return reg.test(value)
            },
            help: '请输入正确的组织邀请码'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      currentOrg: (state) => state.tenantModule.currentOrg
    })
  },
  methods: {
    ...mapMutations('tenantModule', {
      setCurrentOrg: SET_CURRENT_ORG,
      setDaptenatVersion: SET_DAPTENAT_VERSION,
      setTempTenant: SET_TEMP_TENANT
    }),
    ...mapMutations('authModule', {
      setOrgs: SET_ORGS
    }),
    scrollToY(y) {
      this.$refs.publicFormBodyDom.scrollTop = y
    },
    handleJoinOrg() {
      this.$refs.joinOrgForm.validate((valid) => {
        if (valid && !this.loadingButton) {
          this.loadingButton = true
          const request = {
            ...apis.ACCOUNT.JOIN_ORG,
            params: {
              ...this.joinOrgForm
            }
          }
          this.$request(request)
            .asyncThen(
              (resp) => {
                if (resp.code === 'ok') {
                  this.loadingButton = false
                  // this.refreshOrgs().then((orgs) => {
                  if (resp.data && !resp.data.needApproveFlag) {
                    this.proxySetCurrentOrg(resp.data).then(() => {
                      this.$router.push({ name: 'workbench', params: { orgId: resp.data.id } })
                    })
                  } else {
                    if (
                      this.currentOrg.id &&
                      this.stringIsNotNull(this.currentOrg.id)
                    ) {
                      this.$router.push({
                        name: 'workbench',
                        params: { orgId: this.currentOrg.id }
                      })
                    } else {
                      this.setTempTenant(resp.data)
                      this.$router.replace({ name: 'waiting-approval' })
                    }
                  }
                  // })
                } else {
                  this.loadingButton = false
                }
              },
              (err) => {
                this.loadingButton = false
              }
            )
            .asyncErrorCatch((err) => {
              this.loadingButton = false
            })
        } else {
          this.loadingButton = false
          return false
        }
      })
    },
    stringIsNotNull(str) {
      const newStr = (str + '').trim()
      return str && newStr !== 'undefined' && newStr !== 'null' && newStr !== 'NaN'
    },
    remainOrg(orgs, id) {
      if (orgs && orgs.length > 0) {
        orgs.some((item) => item.id === id)
      } else {
        this.setCurrentOrg({})
        return false
      }
    },
    back() {
      this.$router.go(-1)
    },
    refreshOrgs() {
      const request = { ...apis.WORKBENCH.QUERY_USER_TENANT_INFO }
      return new Promise((resolve) => {
        this.$request(request)
          .asyncThen(
            (resp) => {
              if (resp.code === 'ok') {
                this.setOrgs(resp.data)
                resolve(resp.data)
              }
              resolve()
            },
            (error) => {
              console.error(error)
              resolve()
            }
          )
          .asyncErrorCatch((error) => {
            console.error(error)
            resolve()
          })
      })
    },
    proxySetCurrentOrg(org) {
      const request = { ...apis.WORKBENCH.QUERY_USER_TENANT_INFO }
      request.params = {
        tenantId: org.id
      }
      return this.$request(request)
        .asyncThen(
          (resp) => {
            this.setOrgs([resp.data])
            this.setCurrentOrg(resp.data)
            this.setDaptenatVersion(resp.data.limitId)
          },
          (error) => {
            this.setCurrentOrg(org)
            this.setDaptenatVersion()
          }
        )
        .asyncErrorCatch((error) => {
          this.setCurrentOrg(org)
          this.setDaptenatVersion()
        })
    },
    handleValidate(prop, isRight, errMsg) {
      if (prop === 'inviteCode') {
        this.errMsg = errMsg
        if (!isRight) {
          this.inviteCode = true
        } else {
          this.inviteCode = false
        }
      }
    }
  }
}
</script>

<style lang="scss">
.join-org {
  position: relative;
  width: 100%;
  min-height: 100%;
  background-color: $--app-body-bgColor;
  .join-org-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 11.43rem;
    background-color: $--app-primary-color;
  }
  .join-org-body {
    position: absolute;
    top: 3.43rem;
    width: 100%;
    height: calc(100% - 3.43rem);
    //overflow-y: auto;
    .join-org-container {
      border-radius: 0.285rem;
      //background-color: $--app-box-bgColor;
      overflow: auto;
      display: flex;
      flex-direction: column;
      height: 100%;
      &.join-org-readonly {
        margin: 0 1.14rem;
      }
    }
    .join-org-body--header {
      display: flex;
      align-items: center;
      height: 10.8rem;
      padding: 1.14rem;
      padding-right: 1rem;
      box-sizing: border-box;
      border-bottom: 1px solid $--app-split-line-color;
      background-color: $--app-box-bgColor;
      .header-info {
        flex: 1;
        .header-info-title {
          font-weight: $--app-base-font-weight;
          margin-bottom: 0.57rem;
        }
        .header-info-desc {
          font-size: $--app-base-font-size;
          color: $--app-notice-font-color;
        }
      }
      .header-logo {
        flex: 0 0 0;
        width: 9.6875rem;
        height: 3.5rem;
        margin-left: 1.14rem;
        .svg-icon {
          width: 48px !important;
          height: 48px !important;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .join-org-body--content {
      background-color: $--app-box-bgColor;
      padding-top: 1rem;
      .visible {
        display: none;
      }
      .required-star {
        &::before {
          position: absolute;
          left: 0;
          width: 1.07rem;
          content: '*';
          color: #ff3824;
          font-size: 1.4rem;
          text-align: center;
          margin-right: 1rem;
        }
      }
      .invite-code {
        padding-left: 1.14rem;
        font-weight: bolder;
      }
      .warning {
        padding: 0.3rem 1rem;
        font-size: 0.86rem;
        color: #f56c6c;
        background-color: #ffecec;
      }
      .cube-input-field {
        padding: 0.6rem 1.16rem;
      }
      .input-code {
        border-bottom: 1px solid $--app-split-line-color;
      }
      .df-form-item--help {
        display: none;
        padding-left: 1.04rem;
      }
    }
    .join-org-btn {
      display: flex;
      align-items: center;
      //height: 4.29rem;
      padding: 1rem 1.14rem 1rem 1.14rem;
      .cube-btn {
        height: 2.86rem;
      }
      .loading-icon {
        animation: loading 1s infinite linear;
      }
      @keyframes loading {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .join-font {
        padding: 0.9rem;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        .join-cube-loading {
          float: left;
          margin-top: -0.3rem;
          //margin-right: 10px;
        }
      }
    }
    .join-org-footer {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      text-align: center;
      margin: 1.14rem 0;
      .join-org--origin {
        font-size: 14px;
        color: #027aff;
      }
    }
  }
}
</style>
