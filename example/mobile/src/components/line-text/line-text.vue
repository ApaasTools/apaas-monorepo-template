<template>
  <div class="line-text" @click="handleClick">
    <x-svg-icon v-if="icon" class="line-logo" :name="icon" />
    <div class="line-right">
      <div class="line-content text-ellipsis">
        {{ content }}
      </div>
      <div class="split-line"></div>
      <div class="line-content text-ellipsis data-content">
        <slot name="data">
          {{ data }}
        </slot>
      </div>
      <div v-if="link" class="link-edit">
        <x-svg-icon class="link-next" name="arrow-right-icon"></x-svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    link: {
      type: Boolean,
      default: false
    },
    data: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick() {
      if (this.link) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.line-text {
  background: $--app-light-color;
  height: 3.143rem;
  width: calc(100% - 0.857rem);
  display: flex;
  padding-left: .857rem;
  &:last-child {
    .line-right {
      .split-line {
        height: 0;
      }
    }
  }
  .line-logo {
    height: 1.714rem;
    width: 1.714rem;
    padding: .714rem .571rem .714rem 0;
  }
  .line-right {
    display: flex;
    flex-grow: 1;
    height: 100%;
    // max-width: calc(100% - 2.4rem);
    align-items: center;
    position: relative;
    .split-line {
      height: 1px;
      background: $--app-body-bgColor;
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    .line-content {
      flex-grow: 100;
    }
    .data-content {
      color: $--app-notice-color;
      flex-grow: 1;
      max-width: 60%;
    }
    .link-edit {
      display: flex;
      align-items: center;
      padding-right: .857rem;
      .link-next {
        height: 1.714rem;
        width: 1.714rem;
        color: $--app-notice-color;
      }
    }
  }
}
</style>
