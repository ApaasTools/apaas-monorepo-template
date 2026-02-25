<template>
  <div class="plain-login">
    <df-form ref="loginForm" :model="loginForm" :rules="rules">
      <df-form-item prop="account">
        <!-- <input-text v-model="loginForm.account" icon-name="account" placeholder="手机号或邮箱"></input-text> -->
        <input-text v-model="loginForm.account" icon-name="account" placeholder="账号"></input-text>
      </df-form-item>
      <df-form-item prop="password">
        <input-text v-model="loginForm.password" icon-name="lock" placeholder="密码" type="password"></input-text>
      </df-form-item>
    </df-form>
    <cube-button primary class="plain-login-btn" @click="handleLogin">
      登录
    </cube-button>
    <!-- <div class="phone-login">
      <span @click="handleToggle">手机验证码登录</span>
      <span @click="handleRegister">免费注册</span>
    </div> -->
  </div>
</template>

<script>
import InputText from '@/components/input-text/input-text'
import DfForm from '@/components/df-form/df-form'
import DfFormItem from '@/components/df-form-item/df-form-item'

export default {
  components: {
    InputText,
    DfForm,
    DfFormItem
  },
  data() {
    return {
      loginForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          {
            type: 'required',
            // help: '请填写手机号或邮箱'
            help: '请填写账号'
          }
        ],
        password: [
          {
            type: 'required',
            help: '请填写密码'
          }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('login', {
            type: 'account',
            data: this.$lodash.cloneDeep(this.loginForm),
            callback: () => {}
          })
          // const request = {
          //   ...apis.ACCOUNT.USER_LOGIN,
          //   params: {
          //     type: 'account',
          //     ...this.loginForm
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
      this.$emit('toggle', 'PhoneLogin')
    },
    handleRegister() {
      this.$router.replace({ name: 'register' })
    }
  }
}
</script>
<style lang="scss">
.plain-login {
  .plain-login-btn {
    margin-top: 2rem;
  }
  .phone-login {
    margin-top: $--app-title-font-size;
    display: flex;
    justify-content: space-between;
    font-size: $--app-title-font-size;
    color: $--app-primary-color;
  }
}
</style>
