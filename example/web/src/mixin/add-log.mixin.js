
const logMixin = {

  data() {
    return { }
  },
  props: {},
  computed: {
    reportDomain() {
      return (
        window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN ||
        'http://gateway.yctp.yuchaiqas.com/crm-standard-service/'
      )
    },
    userInfo() {
      return window.APaaSSDK?.context.globalVueContext.$store.state.authModule.userInfo || ''
    }
  },

  methods: {
    // 请求表头
    addRequestLog(type) {
      this.$request({
        url: `${this.reportDomain}/common/addFunctionAccessLog`,
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          sourceSystem: 'PC',
          menuName: '一键查询',
          functionName: type
        },
        headers: {
          'xdapaccount': this.userInfo.account
        }
      })
        .asyncThen((resp) => {})
    }
  }

}

export default logMixin
