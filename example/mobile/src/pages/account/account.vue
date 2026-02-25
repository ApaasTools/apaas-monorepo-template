<template>
  <div class="account">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlice" :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blankRouter: null
    }
  },
  provide() {
    return {
      getBlankRouter: this.getBlankRouter
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path.startsWith('/blank')) {
      next(vm => {
        vm.blankRouter = {
          name: from.name,
          query: from.query
        }
      })
    } else {
      next()
    }
  },
  methods: {
    getBlankRouter() {
      return this.blankRouter
    }
  }
}
</script>

<style lang="scss">
.account {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  .cube-btn {
    height: 2.86rem;
    font-size: 1.14rem;
  }
}
</style>
