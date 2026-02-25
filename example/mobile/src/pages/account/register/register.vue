<template>
  <div class="register">
    <div class="blue-header"></div>
    <div class="form">
      <div class="header">
        <div>
          <p class="register--title">
            注册
          </p>
          <p class="welcome-use">
            欢迎注册使用得帆云
          </p>
        </div>
        <div class="register-logo">
          <img :src="$envUrl('img/custom_img/logo.png')" alt="logo">
        </div>
      </div>
      <div class="register-form">
        <df-form ref="registerForm" :model="registerForm" :rules="rules" @validate="handleValidate" @invalid="showWarning(e)">
          <df-form-item prop="phone">
            <div class="input-item-title">
              <span class="required-star"></span>手机号
            </div>
            <cube-input v-model="registerForm.phone" autocomplete="off" placeholder="请输入手机号"></cube-input>
            <div class="warning" :class="{ visible: !phone } ">
              {{ phoneErrMsg }}
            </div>
          </df-form-item>
          <df-form-item prop="code">
            <div class="input-item-title" :class="{ 'grey': !canInputCode }">
              <span class="required-star"></span>验证码
            </div>
            <input-code v-model="registerForm.code" class="code-input" :disabled="!canInputCode" placeholder="请输入验证码" iconName="" @verify-success="handleVerifySuccess"></input-code>
            <div class="warning" :class="{ visible: !code } ">
              {{ codeErrMsg }}
            </div>
          </df-form-item>
          <df-form-item prop="password">
            <div class="input-item-title">
              <span class="required-star"></span>密码
            </div>
            <cube-input v-model="registerForm.password" placeholder="请输入8~32位字母及数字组合" autocomplete="new-password" type="password"></cube-input>
            <div class="warning" :class="{ visible: !password } ">
              {{ passwordErrMsg }}
            </div>
          </df-form-item>
          <df-form-item prop="username">
            <div class="input-item-title">
              <span class="required-star"></span>姓名
            </div>
            <cube-input v-model="registerForm.username" autocomplete="off" placeholder="请输入姓名"></cube-input>
            <div class="warning" :class="{ visible: !username } ">
              {{ usernameErrMsg }}
            </div>
          </df-form-item>
          <df-form-item prop="email">
            <div class="input-item-title">
              <!-- <span class="required-star"></span>邮箱 -->
              邮箱
            </div>
            <cube-input v-model="registerForm.email" autocomplete="off" placeholder="请输入邮箱"></cube-input>
            <div class="warning" :class="{ visible: !email } ">
              {{ emailErrMsg }}
            </div>
          </df-form-item>
          <div class="use-term"></div>
        </df-form>
        <div class="term">
          <p>注册即视为同意得帆云《<span href="" @click="pushService">使用条款</span>》</p>
        </div>
        <div class="phone-register-btn">
          <cube-button primary @click="handleRegister">
            注册
          </cube-button>
        </div>
      </div>
      <div v-if="footerVisible" class="login">
        <p>已有账号? <span @click="pushLogin">直接登录</span></p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
// import InputText from '@/components/input-text/input-text'
import DfForm from '@/components/df-form/df-form'
import DfFormItem from '@/components/df-form-item/df-form-item'
import InputCode from '@/components/input-code/input-code'
import { mapState, mapMutations } from 'vuex'
import {
  SET_USER_INFO,
  SET_TOKEN
} from '@/store/auth.store.js'
import apis from '@/api'
// import { SET_OPEN_ID,SET_UNION_ID } from '@/store/oauth.store'
export default {
  components: {
    // InputText,
    DfForm,
    DfFormItem,
    InputCode
  },
  inject: ['getBlankRouter'],
  data() {
    return {
      canInputCode: false,
      loading: false,
      phone: false,
      password: false,
      code: false,
      username: false,
      email: false,
      phoneErrMsg: '',
      passwordErrMsg: '',
      codeErrMsg: '',
      usernameErrMsg: '',
      emailErrMsg: '',
      registerForm: {
        phone: '',
        code: '',
        password: '',
        username: '',
        email: ''
      },
      footerVisible: true,
      rules: {
        phone: [
          {
            type: 'required',
            help: '请输入手机号'
          },
          {
            validator: (rule, value) => {
              const reg = /^1[3456789]\d{9}$/
              return reg.test(value)
            },
            help: '请输入正确的手机号'
          }
        ],
        code: [
          {
            type: 'required',
            help: '请输入验证码'
          },
          {
            validator: (rule, value) => {
              return value.length === 6
            },
            help: '请输入正确的验证码'
          }
        ],
        password: [
          {
            type: 'required',
            help: '请输入密码'
          },
          {
            validator: (rule, value) => {
              const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z]+$).{8,}$/
              return reg.test(value)
            },
            help: '请输入8-32位字母及数字组合'
          },
          {
            validator: (rule, value) => {
              return value.length >= 8 && value.length <= 32
            },
            help: '请输入8-32位字母及数字组合'
          }
        ],
        username: [
          {
            type: 'required',
            help: '请输入姓名'
          },
          {
            validator: (rule, value) => {
              return value.length < 32
            },
            help: '姓名长度最多32个字符'
          }
        ],
        email: [
          // {
          //   type: 'required',
          //   help: '请输入邮箱'
          // },
          {
            validator: (rule, value) => {
              if (!value) {
                return true
              }
              const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
              return reg.test(value)
            },
            help: '请输入正确的邮箱'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      wxOpenId: (state) => state.oauthModule.openId,
      wxUnionId: (state) => state.oauthModule.unionId
    })
  },
  methods: {
    ...mapMutations('authModule', {
      setUserInfo: SET_USER_INFO,
      setToken: SET_TOKEN
    }),
    handleVerifySuccess (callback) {
      if (this.registerForm.phone) {
        const request = {
          ...apis.ACCOUNT.SEND_PHONE_CODE,
          params: {
            type: 'register',
            phone: this.registerForm.phone
          }
        }
        this.$request(request).asyncThen(resp => {
          if (resp.code === 'ok') {
            callback()
          }
        }, () => {
          callback(false)
        }).asyncErrorCatch(() => {
          callback(false)
        })
      }
    },
    handleValidate (prop, isRight, errMsg) {
      if (prop === 'phone') {
        this.canInputCode = isRight
        this.phoneErrMsg = errMsg
        this.phone = !isRight
      } else if (prop === 'password') {
        this.passwordErrMsg = errMsg
        this.password = !isRight
      } else if (prop === 'code') {
        this.codeErrMsg = errMsg
        this.code = !isRight
      } else if (prop === 'username') {
        this.usernameErrMsg = errMsg
        this.username = !isRight
      } else if (prop === 'email') {
        this.emailErrMsg = errMsg
        this.email = !isRight
      }
    },
    handleRegister () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          const wxParams = {}
          if (this.wxOpenId && this.wxUnionId) {
            wxParams.wxOpenId = this.wxOpenId
            wxParams.wxUnionId = this.wxUnionId
          }
          const request = {
            ...apis.ACCOUNT.USER_REGISTER,
            params: {
              ...this.registerForm,
              ...wxParams
            }
          }
          this.loading = true
          this.$request(request, false).asyncThen(resp => {
            if (resp.code === 'ok') {
              if (resp.data.hasBindOpenWechat === false) {
                this.$message({
                  message: '该微信号已经被绑定',
                  type: 'warning'
                })
              } else {
                this.$message({
                  message: '注册成功',
                  type: 'success'
                })
              }
              this.loading = false
              this.setToken(resp.data.token)
              this.setUserInfo(resp.data.user)
              const blankRouter = this.getBlankRouter()
              if (blankRouter) {
                blankRouter.query.tenantId = resp.data.tenantId
                this.$router.push(blankRouter)
              } else {
                if (resp.data.tenantId) {
                  this.$router.push({ name: 'workbench', params: { orgId: resp.data.tenantId } })
                } else {
                  this.$router.push({ name: 'org-setting' })
                }
              }
            }
          }, (error) => {
            this.loading = false
            this.$message({
              message: error.message,
              type: 'error'
            })
          }).asyncErrorCatch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    pushLogin () {
      this.$router.push({ name: 'login' })
    },
    pushService() {
      this.$router.push({ name: 'serviceprotocol' })
    }
  }
}
</script>

<style lang="scss">
.register {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 100%;
  background-color: rgba(247, 247, 247, 100);
  overflow: auto;
  .df-form-item--help {
    display: none;
  }
  .blue-header {
    top: 0;
    width: 100%;
    height: 3.43rem;
    background-color: #027AFF;
  }
  .form {
    background-color: #027AFF;
    //background-color: rgba(247, 247, 247, 100);
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  .header {
    width: 100%;
    border-radius: 4px 4px 0 0;
    box-sizing: border-box;
    padding: 2.6rem 1.14rem 2.6rem 1.14rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 0.1rem solid #EBEEF5 !important;
    overflow: auto;
    background-color: rgba(255, 255, 255, 100);
    min-height: 109.91px;
    .register--title {
      color: rgba(51, 51, 51, 100);
      font-size: 14px;
      margin-bottom: 0.7rem;
      font-weight: bolder;
    }
    .welcome-use {
      font-size: 12px;
      color: rgba(178, 178, 178, 100);
    }
  }
  .register-logo {
    width: 9.6875rem;
    height: 2.5rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .register-form {
    width: 100%;
    position: relative;
    background-color: rgba(255, 255, 255, 100);
    padding-top: 0.8rem;
    .df-form-item {
      background-color: rgba(255, 255, 255, 100);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0.3rem 0 0.8rem;
      .visible {
        display: none;
      }
      .cube-input-append {
        padding: 10px 6px 9px 20px;
        border-bottom: 1px solid #EBEEF5;
        .input-code-suffix {
          text-align: right;
          //margin-left: 3.7rem;
          margin-right: 0.8rem;
          //width: 10rem;
        }
      }
      .grey {
        color: #B2B2B2;
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
      .input-item-title {
        font-weight: bolder;
        padding-left: 1.14rem;
      }
      .warning {
        padding: 0.3rem 1rem;
        font-size: .86rem;
        color: #f56c6c;
        background-color: #ffecec
      }
      .cube-input:focus {
        outline: none;
      }
      .cube-input_active {
        border: 0 !important;
        outline: none;
        &::after {
          content: none;
        }
      }
      .cube-input-field {
        padding: 9PX 1.14rem !important;
        outline: none;
        border-bottom: 0.1rem solid #EBEEF5 !important;
      }
      .df-form-item--help {
        padding-left: 0.7rem;
        //height: 0;
      }
      .input-code-suffix {
        margin-right: 1rem;
      }
    }
    .code-input {
      .svg-icon {
        width: 0 !important;
      }
    }
    .term {
      padding-left: 1.14rem;
      padding-bottom: .7rem;
      font-size: 12px;
      color: rgba(178, 178, 178, 100);
      background-color: rgba(255, 255, 255, 100);
      border-bottom: 0.1rem solid #EBEEF5 !important;
      span {
        color: #027AFF;
      }
    }
    .phone-register-btn {
      background-color: rgba(255, 255, 255, 100);
      padding: 1rem 1.14rem;
    }
  }
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    flex: 1;
    padding-bottom: 1rem;
    background-color: rgba(247, 247, 247, 100);
    span {
      color: #027AFF;
    }
  }
}
</style>
