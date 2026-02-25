<template>
  <x-modal
    title="功能更新"
    :visible.sync="visible"
    wrapper-class="function-update-modal"
  >
    <div class="func-update-content">
      <x-svg-icon class="func-update-icon" name="func-update"></x-svg-icon>
      <span class="func-update-text">更新得帆云以获得更优的使用体验。</span>
      <cube-button class="func-update-btn" primary @click="handleClick">
        更新使用
      </cube-button>
    </div>
    <template v-slot:footer></template>
  </x-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    openModal() {
      this.visible = true
    },
    closeModal() {
      this.visible = false
    },
    handleClick() {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss">
.function-update-modal {
  .func-update-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .func-update-icon {
      margin: 24px 0;
      width: 150px;
      .svg-icon {
        width: 150px !important;
        height: 150px !important;
      }
    }
    .func-update-text {
      color: $--app-notice-font-color;
      font-size: $--app-base-font-size;
    }
    .func-update-btn {
      width: 100px;
      margin-top: 24px;
      margin-bottom: 16px;
    }
  }
}
</style>
