<!--
 * @Author: your name
 * @Date: 2020-07-23 19:02:29
 * @LastEditTime: 2020-07-23 19:10:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-h5-workspace/packages/xdap-h5/src/pages/blank/blank.vue
-->
<template>
  <div class="blank">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Blank',
  inject: ['addKeepAlive', 'removeKeepAlive'],
  watch: {
    '$route': {
      handler(to, from) {
        if (to.name === 'publicFormContent') {
          this.addKeepAlive('Blank')
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.blank {
  height: 100%;
}
</style>
