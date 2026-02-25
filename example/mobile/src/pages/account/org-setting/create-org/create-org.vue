<template>
  <div class="create-org">
    <div class="create-org-bg"></div>
    <div ref="publicFormBodyDom" class="create-org-body" @scroll="handleScroll">
      <div class="create-org-container">
        <div class="create-org-body--header">
          <div class="header-info">
            <h4 class="header-info-title">
              创建组织
            </h4>
            <span class="header-info-desc">您将默认成为该组织的管理员</span>
          </div>
          <div class="header-logo">
            <x-svg-icon name="create-org"></x-svg-icon>
          </div>
        </div>
        <div class="create-org-body--content">
          <df-form ref="createOrgForm" :model="createOrgForm" :rules="rules" @validate="handleValidate">
            <df-form-item prop="name">
              <div class="invite-code">
                <span class="required-star"></span>组织名称
              </div>
              <cube-input v-model="createOrgForm.name" autocomplete="off" placeholder="请输入" class="input-code"></cube-input>
              <div class="warning" :class="{ visible: !name } ">
                {{ nameErrMsg }}
              </div>
            </df-form-item>
            <df-form-item prop="scale" class="forn-item-scale">
              <div class="invite-code">
                <span class="required-star"></span>组织规模
              </div>
              <cube-input v-model="createOrgForm.scale" autocomplete="off" placeholder="请选择" class="input-code" readonly @focus="showScalePicker"></cube-input>
              <div class="warning" :class="{ visible: !scale } ">
                {{ scaleErrMsg }}
              </div>
              <div class="right-arrow" @click="showScalePicker">
                <x-svg-icon name="arrow-right-icon"></x-svg-icon>
              </div>
            </df-form-item>
            <df-form-item prop="location" class="forn-item-location">
              <div class="invite-code">
                <span class="required-star"></span>所在地
              </div>
              <cube-input v-model="createOrgForm.location" autocomplete="off" placeholder="请选择" class="input-code" readonly @focus="showLocationPicker"></cube-input>
              <div class="warning" :class="{ visible: !location } ">
                {{ locationErrMsg }}
              </div>
              <div class="right-arrow" @click="showLocationPicker">
                <x-svg-icon name="arrow-right-icon"></x-svg-icon>
              </div>
            </df-form-item>
            <df-form-item prop="industry" class="forn-item-industry">
              <div class="invite-code">
                <span class="required-star"></span>所属行业
              </div>
              <cube-input v-model="createOrgForm.industry" autocomplete="off" placeholder="请选择" class="input-code" readonly @focus="showIndustryPicker"></cube-input>
              <div class="warning" :class="{ visible: !industry } ">
                {{ industryErrMsg }}
              </div>
              <div class="right-arrow" @click="showIndustryPicker">
                <x-svg-icon name="arrow-right-icon"></x-svg-icon>
              </div>
            </df-form-item>
          </df-form>
          <div class="create-org-btn">
            <cube-button primary icon="" @click="handleCreateOrg">
              <div class="create-font">
                <div style="margin-left: -20px">
                  <x-svg-icon
                    v-if="loadingButton"
                    name="refresh-colorless"
                    class="loading-icon create-cube-loading"
                  ></x-svg-icon>
                  <span>创建</span>
                </div>
              </div>
            </cube-button>
          </div>
        </div>
        <div class="create-org-footer">
          <span class="create-org--origin" @click="back">返回</span>
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
import { mapMutations } from 'vuex'
import {
  SET_CURRENT_ORG,
  SET_DAPTENAT_VERSION
} from '@/store/tenant.store.js'
import {
  SET_ORGS
} from '@/store/auth.store.js'

export default {
  components: {
    DfForm,
    DfFormItem
  },
  mixins: [ScrollBehaviorMixin],
  data() {
    return {
      createOrgForm: {
        name: '',
        scale: '',
        location: '',
        industry: ''
      },
      requestForm: {
        name: '',
        scale: '',
        location: '',
        industry: ''
      },
      name: false,
      scale: false,
      location: false,
      industry: false,
      nameErrMsg: '',
      scaleErrMsg: '',
      locationErrMsg: '',
      industryErrMsg: '',
      industryList: [],
      locationList: [],
      loadingButton: false,
      rules: {
        name: [
          {
            type: 'required',
            help: '请输入组织名称'
          },
          {
            validator: (rule, value) => {
              return value.length < 32
            },
            help: '组织名称长度最多32个字符'
          }
        ],
        scale: [
          {
            type: 'required',
            help: '请选择组织规模'
          }
        ],
        location: [
          {
            type: 'required',
            help: '请选择所在地'
          }
        ],
        industry: [
          {
            type: 'required',
            help: '请选择所属行业'
          }
        ]
      },
      orgScaleOptions: [
        {
          text: '1~50人',
          value: 'MIN'
        },
        {
          text: '50~200人',
          value: 'TWO_HUNDRED'
        },
        {
          text: '200~500人',
          value: 'FIVE_HUNDRED'
        },
        {
          text: '500人以上',
          value: 'MAX'
        }
      ]
    }
  },
  created() {
    // 获取所在行业值列表
    this.queryDictData('10259241417054093312').then((list) => {
      this.industryList = list.map((item) => {
        return {
          text: item.value,
          value: item.id
        }
      })
    })
    // 获取所在地值列表
    this.queryDictData('10289657821016883200').then((list) => {
      this.locationList = list.map((item) => {
        return {
          text: item.value,
          value: item.id
        }
      })
    })
  },
  methods: {
    ...mapMutations('tenantModule', {
      setCurrentOrg: SET_CURRENT_ORG,
      setDaptenatVersion: SET_DAPTENAT_VERSION
    }),
    ...mapMutations('authModule', {
      setOrgs: SET_ORGS
    }),
    queryDictData(typeId) {
      const request = { ...apis.ACCOUNT.GET_INDUSTRY_LIST }
      request.params = {
        typeId: typeId
      }
      return new Promise((resolve, reject) => {
        this.$request(request)
          .asyncThen(
            (resp) => {
              resolve(resp.data || [])
            },
            () => {}
          )
          .asyncErrorCatch(() => {})
      })
    },
    scrollToY(y) {
      this.$refs.publicFormBodyDom.scrollTop = y
    },
    handleCreateOrg() {
      this.requestForm.name = this.createOrgForm.name
      this.$refs.createOrgForm.validate((valid) => {
        if (valid && !this.loadingButton) {
          this.loadingButton = true
          const request = {
            ...apis.ACCOUNT.CREATE_ORG,
            params: {
              ...this.requestForm
            }
          }
          this.$request(request)
            .asyncThen(
              (resp) => {
                if (resp.code === 'ok') {
                  this.loadingButton = false
                  // this.refreshOrgs()
                  this.proxySetCurrentOrg(resp.data).then(() => {
                    this.$router.replace({ name: 'workbench', params: { orgId: resp.data.id } })
                  })
                }
              },
              () => {
                this.loadingButton = false
              }
            )
            .asyncErrorCatch(() => {
              this.loadingButton = false
            })
        }
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
    refreshOrgs() {
      const request = { ...apis.WORKBENCH.QUERY_USER_TENANT_INFO }
      this.$request(request)
        .asyncThen(
          (resp) => {
            if (resp.code === 'ok') {
              this.setOrgs(resp.data)
            }
          },
          (error) => {
            console.error(error)
          }
        )
        .asyncErrorCatch((error) => {
          console.error(error)
        })
    },
    showScalePicker() {
      if (!this.scalePicker) {
        this.scalePicker = this.$createPicker({
          title: '组织规模',
          data: [this.orgScaleOptions],
          onSelect: this.selectScaleHandle
        })
      }
      this.scalePicker.show()
    },
    showLocationPicker() {
      if (!this.locationPicker) {
        this.locationPicker = this.$createPicker({
          title: '所在地',
          data: [this.locationList],
          onSelect: this.selectLocationHandle
        })
      }
      this.locationPicker.show()
    },
    showIndustryPicker() {
      if (!this.industryPicker) {
        this.industryPicker = this.$createPicker({
          title: '所在行业',
          data: [this.industryList],
          onSelect: this.selectIndustryHandle
        })
      }
      this.industryPicker.show()
    },
    selectScaleHandle(selectedVal, selectedIndex, selectedText) {
      this.createOrgForm.scale = selectedText[0]
      this.requestForm.scale = selectedVal[0]
    },
    selectLocationHandle(selectedVal, selectedIndex, selectedText) {
      this.createOrgForm.location = selectedText[0]
      this.requestForm.location = selectedVal[0]
    },
    selectIndustryHandle(selectedVal, selectedIndex, selectedText) {
      this.createOrgForm.industry = selectedText[0]
      this.requestForm.industry = selectedVal[0]
    },
    back() {
      this.$router.go(-1)
    },
    handleValidate(prop, isRight, errMsg) {
      if (prop === 'name') {
        this.nameErrMsg = errMsg
        if (!isRight) {
          this.name = true
        } else {
          this.name = false
        }
      } else if (prop === 'scale') {
        this.scaleErrMsg = errMsg
        if (!isRight) {
          this.scale = true
        } else {
          this.scale = false
        }
      } else if (prop === 'location') {
        this.locationErrMsg = errMsg
        if (!isRight) {
          this.location = true
        } else {
          this.location = false
        }
      } else if (prop === 'industry') {
        this.industryErrMsg = errMsg
        if (!isRight) {
          this.industry = true
        } else {
          this.industry = false
        }
      }
    }
  }
}
</script>

<style lang="scss">
.create-org {
  position: relative;
  width: 100%;
  min-height: 100%;
  background-color: $--app-body-bgColor;
  .create-org-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 11.43rem;
    background-color: $--app-primary-color;
  }
  .create-org-body {
    position: absolute;
    top: 3.43rem;
    width: 100%;
    height: calc(100% - 3.43rem);
    //overflow-y: auto;
    .create-org-container {
      border-radius: 0.285rem;
      //background-color: $--app-box-bgColor;
      overflow: auto;
      display: flex;
      flex-direction: column;
      height: 100%;
      &.create-org-readonly {
        margin: 0 1.14rem;
      }
    }
    .create-org-body--header {
      display: flex;
      align-items: center;
      height: 16.8rem;
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
        height: 2.5rem;
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
    .create-org-body--content {
      background-color: $--app-box-bgColor;
      //padding-top: 1rem;
      .visible {
        display: none;
      }
      .df-form-item {
        padding: 1rem 0 0;
      }
      .forn-item-scale {
        position: relative;
        .right-arrow {
          position: absolute;
          top: 20px;
          right: 0.7rem;
          color: #b7b7b7;
        }
      }
      .forn-item-location {
        position: relative;
        .right-arrow {
          position: absolute;
          top: 20px;
          right: 0.7rem;
          color: #b7b7b7;
        }
      }
      .forn-item-industry {
        position: relative;
        .right-arrow {
          position: absolute;
          top: 20px;
          right: 0.7rem;
          color: #b7b7b7;
        }
      }
      .required-star {
        &::before {
          position: absolute;
          left: 0;
          width: 1.07rem;
          content: "*";
          color: #FF3824;
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
        font-size: .86rem;
        color: #f56c6c;
        background-color: #ffecec
      }
      .cube-input-field {
        padding: 0.6rem 1.14rem;
      }
      .input-code {
        border-bottom: 1px solid $--app-split-line-color;
      }
      .df-form-item--help {
        display: none;
        padding-left: 1.04rem;
      }
    }
    .create-org-btn {
      display: flex;
      position: relative;
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
      .create-font {
        padding: 0.9rem;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        .create-cube-loading {
          float: left;
          margin-top: -0.3rem;
          //margin-right: 10px;
        }
      }
    }
    .create-org-footer {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      text-align: center;
      margin: 1.14rem 0;
      .create-org--origin {
        font-size: 14px;
        color: #027aff;
      }
    }
  }
}
</style>
