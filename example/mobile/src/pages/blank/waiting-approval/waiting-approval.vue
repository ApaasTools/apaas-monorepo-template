<template>
  <div class="waiting-approval">
    <x-svg-icon class="join-tenant-icon" name="join-org"></x-svg-icon>
    <span class="join-tenant-text">
      已成功申请加入「{{ tenantInfo.name }}」，请耐心等待管理员审核。
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      tenantInfo: (state) => state.tenantModule.tempTenant
    })
  }
}
</script>

<style lang="scss">
.waiting-approval {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 1.429rem;
  word-break: break-all;
  word-wrap: break-word;
  .join-tenant-icon {
    margin: 1.714rem 0;
    width: 10.714rem;
    .svg-icon {
      width: 10.714rem !important;
      height: 10.714rem !important;
    }
  }
  .join-tenant-text {
    color: $--app-notice-font-color;
    font-size: $--app-base-font-size;
    text-align: center;
    line-height: 1.143rem;
  }
  .join-tenant-btn {
    margin-top: 1.714rem;
    margin-bottom: 1.143rem;
    background-color: #027affee;
  }
}
</style>
