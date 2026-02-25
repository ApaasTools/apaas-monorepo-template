<template functional>
  <div class="menu-item" v-on="listeners">
    <div v-if="!props.menuInfo.isPlaceholder" class="menu-item-content">
      <div class="menu-logo">
        <img v-if="props.menuInfo.cusIconStatus === 'ENABLE'" :src="props.menuInfo.menuCustomIcon" alt="">
        <XSvgIcon v-else :name="props.menuInfo.menuIcon"></XSvgIcon>
      </div>
      <span class="menu-title text-overflow">{{ props.menuInfo.menuName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  functional: true,
  props: {
    menuInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
.menu-item {
  display: flex;
  justify-content: center;
  height: 4.29rem;
  width: 4.29rem;
  padding: 0 0.285rem;
  .menu-item-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .menu-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 2.86rem;
      width: 2.86rem;
      height: 2.86rem;
      border-radius: 50%;
      background-color: $--app-primary-color;
      color: $--app-light-color;
      margin-bottom: 0.285rem;
      font-size: 0;
      overflow: hidden;
      .x-svg-icon .svg-icon {
        width: 1.43rem !important;
        height: 1.43rem !important;
      }
      img {
        width: 2.86rem;
        height: 2.86rem;
      }
    }
    .menu-title {
      width: calc(100% - 1.14rem);
      text-align: center;
      line-height: 1.285rem;
      font-size: $--app-base-font-size;
      color: $--app-notice-font-color;
    }
  }
}
</style>
