<template>
  <div class="menu-group">
    <div class="menu-group-header">
      <span class="menu-group--title">{{ group.menuName }}</span>
      <x-svg-icon
        name="arrow-down-icon"
        :class="{
          'menu-group--icon': true,
          'is-active': isCollapse
        }"
        @click.native="handleClick"
      ></x-svg-icon>
    </div>
    <div class="menu-group-content">
      <df-collapse-transition>
        <menu-panel v-if="!isCollapse" :menuList="group.submenus" v-on="$listeners"></menu-panel>
      </df-collapse-transition>
    </div>
  </div>
</template>

<script>
import MenuPanel from '@/components/menu-panel/menu-panel'
import DfCollapseTransition from '@/transitions/collapse-transition/collapse-transition'

export default {
  components: {
    MenuPanel,
    DfCollapseTransition
  },
  inheritAttrs: false,
  props: {
    group: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleClick() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss">
.menu-group {
  padding-bottom: 1rem;
  border-bottom: 1PX solid $--app-split-line-color;
  .menu-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.14rem;
    .menu-group--title {
      font-size: $--app-title-font-size;
    }
    .menu-group--icon {
      transition: transform .3s ease-in-out;
      transform: rotate(180deg);
      &.is-active {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
