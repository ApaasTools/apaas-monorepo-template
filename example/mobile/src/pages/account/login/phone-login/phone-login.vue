<template>
  <div class="phone-login">
    <df-form ref="loginForm" :model="loginForm" :rules="rules" @validate="handleValidate">
      <df-form-item prop="phone">
        <input-text
          v-model="loginForm.phone"
          icon-name="account-phone"
          placeholder="手机号"
        ></input-text>
      </df-form-item>
      <df-form-item prop="code">
        <input-code
          v-model="loginForm.code"
          :disabled="!canInputCode"
          icon-name="envelope"
          placeholder="验证码"
          @verify-success="handleVerifySuccess"
        ></input-code>
      </df-form-item>
    </df-form>
    <cube-button primary class="phone-login-btn" @click="handleLogin">
      登录
    </cube-button>
    <div class="account-login">
      <span @click="handleToggle">账号密码登录</span>
      <span @click="handleRegister">免费注册</span>
    </div>
  </div>
</template>

<script>
import InputText from '@/components/input-text/input-text'
import DfForm from '@/components/df-form/df-form'
import DfFormItem from '@/components/df-form-item/df-form-item'
import InputCode from '@/components/input-code/input-code'
import apis from '@/api'

export default {
  components: {
    InputText,
    DfForm,
    DfFormItem,
    InputCode
  },
  data() {
    return {
      canInputCode: false,
      loginForm: {
        phone: '',
        code: ''
      },
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
          }
        ]
      }
    }
  },
  methods: {
    handleVerifySuccess(callback) {
      if (this.loginForm.phone) {
        const request = {
          ...apis.ACCOUNT.SEND_PHONE_CODE,
          params: {
            type: 'login',
            phone: this.loginForm.phone
          }
        }
        this.$request(request)
          .asyncThen(
            (resp) => {
              if (resp.code === 'ok') {
                callback()
              }
            },
            () => {
              callback(false)
            }
          )
          .asyncErrorCatch(() => {
            callback(false)
          })
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('login', {
            type: 'phone',
            data: {
              account: this.loginForm.phone,
              code: this.loginForm.code
            },
            callback: () => {}
          })
          // const request = {
          //   ...apis.ACCOUNT.USER_LOGIN,
          //   params: {
          //     type: 'phone',
          //     account: this.loginForm.phone,
          //     code: this.loginForm.code
          //   }
          // }
          // this.$request(request).asyncThen((resp) => {
          //   if (resp.code === 'ok') {
          //     this.setDaptenatVersion(resp.data.userDefaultTenant && resp.data.userDefaultTenant.tenantBasicInfo && resp.data.userDefaultTenant.tenantBasicInfo.limitId)
          //     this.$emit('success', resp.data)
          //   }
          // }, (err) => {
          //   console.error(err)
          // }).asyncErrorCatch(err => {
          //   console.error(err)
          // })
        }
      })
    },
    handleToggle() {
      this.$emit('toggle', 'PlainLogin')
    },
    handleValidate(prop, isRight, errMsg) {
      if (prop === 'phone') {
        this.canInputCode = isRight
      }
    },
    handleRegister() {
      this.$router.replace({ name: 'register' })
    }
  }
}
</script>

<style lang="scss">
.phone-login {
  .phone-login-btn {
    margin-top: 2rem;
  }
  .account-login {
    margin-top: $--app-title-font-size;
    display: flex;
    justify-content: space-between;
    font-size: $--app-title-font-size;
    color: $--app-primary-color;
  }
}
</style>
