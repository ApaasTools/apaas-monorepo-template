<template>
  <div class="empty-org">
    <div class="empty-org">
      <div class="select-option" @click="toggleOption('join-org')">
        <div class="option-prefix">
          <x-svg-icon name="join-org"></x-svg-icon>
        </div>
        <div class="option-info">
          <span class="info-title">加入已有组织</span>
          <span class="info-desc">被其他人邀请使用</span>
        </div>
        <div class="option-suffix">
          <x-svg-icon name="arrow-right-icon"></x-svg-icon>
        </div>
      </div>
      <div class="select-option" @click="toggleOption('join-org')">
        <div class="option-prefix">
          <x-svg-icon name="create-org"></x-svg-icon>
        </div>
        <div class="option-info">
          <span class="info-title">创建新的组织</span>
          <span class="info-desc">为企业或团队创建新的组织</span>
        </div>
        <div class="option-suffix">
          <x-svg-icon name="arrow-right-icon"></x-svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toggleOption(componentName) {

    }
  }
}
</script>

<style lang="scss">
.empty-org {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $--app-light-color;
  .empty-org-header {
    display: flex;
    height: 30PX;
    justify-content: center;
    padding-top: 14PX;
    font-size: 16px;
    border-bottom: 1PX solid #EBEEF5;
  }
  .empty-org {
    .select-option {
      display: flex;
      align-items: center;
      height: 88px;
      margin: 20px 16px;
      padding: 24px 14px;
      border-radius: $--app-base-border-radius;
      box-shadow: 0 0 8px 0 $--app-split-line-color;
      box-sizing: border-box;
      cursor: pointer;
      &:last-child {
        margin-bottom: 0;
      }
      .option-prefix, .option-suffix {
        flex: 0 0 48px;
        display: flex;
        .x-svg-icon .svg-icon {
          width: 48px;
          height: 48px;
        }
      }
      .option-prefix {
        justify-content: center;
        .x-svg-icon .svg-icon{
          width: 48px !important;
          height: 48px !important;
        }
      }
      .option-suffix {
        justify-content: flex-end;
        > .x-svg-icon .svg-icon{
          color: $--app-notice-font-color;
        }
      }
      .option-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 14px;
        .info-title {
          font-size: 14px;
          font-weight: $--app-base-font-weight;
          color: $--app-base-font-color;
          margin-bottom: 10px;
        }
        .info-desc {
          color: $--app-notice-font-color;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
