<template>
  <cube-input class="input-text" v-bind="$attrs" v-on="$listeners">
    <template v-slot:prepend>
      <template v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <div v-else class="input-text-icon">
        <x-svg-icon :name="iconName"></x-svg-icon>
      </div>
    </template>
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </cube-input>
</template>

<script>
export default {
  name: 'InputText',
  inheritAttrs: false,
  props: {
    iconName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.input-text {
  &::after {
    border: 0 !important;
    border-bottom: 1PX solid $--app-input-border-bottom-color !important;
    z-index: 10;
  }
  .x-svg-icon {
    display: flex;
    align-items: center;
    color: $--app-notice-font-color;
  }
}
</style>
