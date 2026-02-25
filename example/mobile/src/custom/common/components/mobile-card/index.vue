<!--
 * @Description: 移动端卡片组件
 * @Date: 2025-07-01
 * @FilePath: src/custom/common/components/mobile-card/index.vue
-->
<template>
  <div class="mobile-card" :class="customClass" @click="$emit('click')">
    <!-- 卡片头部 -->
    <div v-if="showHeader" class="mobile-card-category-select">
      <div class="card-header-title">
        <slot name="header">
          <span v-if="title" class="card-title">{{ title }}</span>
        </slot>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="mobile-card-content">
      <slot></slot>
    </div>

    <!-- 卡片操作区 -->
    <div v-if="$slots.actions" class="mobile-card-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-card {
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  overflow: hidden;
  border: none;
  position: relative;
  padding-top: 2px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:active {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(1px);
  }

  * {
    box-sizing: border-box;
  }

  .mobile-card-category-select {
    padding: 12px 15px 0px 15px;
    background-color: #fff;
    position: relative;
    z-index: 1;
    box-sizing: border-box;

    .card-header-title {
      font-weight: 600;
      font-size: 16px;
      color: #303133;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .card-title {
        font-weight: 600;
        font-size: 16px;
        color: #303133;
      }
    }
  }

  .mobile-card-content {
    padding: 5px 15px 12px 15px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
  }

  .mobile-card-actions {
    display: flex;
    flex-direction: column;
    padding: 8px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
