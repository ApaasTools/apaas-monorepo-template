<template>
  <div
    class="x-app-org-logo-compact"
    storefontsize="middle"
    i18nlangdata=""
    showthemebackgroundcolor="true"
    headportraitcardstyle="true"
    negativewhitenesscompact="true"
  >
    <div class="org-logo org-header-logo">
      <img :src="logoUrl" alt="logo" class="img-logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: "XOrgLogo",
  props: {},
  data() {
    return {
      identityName: null,
    };
  },
  computed: {
    /**
     * 自己去后台配置一个 logo 的环境变量，用于自定义 logo 的展示
     */
    logoUrl() {
      return window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.LOGO_URL;
    },
  }
};
</script>
