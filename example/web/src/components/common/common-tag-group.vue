<!--
 * @Author: HongYu
 * @Date: 2025-03-06 15:15:50
 * @LastEditTime: 2025-03-06 15:15:50
 * @LastEditors: HongYu
 * @Description: 通用标签组件, 基于 x-tag-group 封装，支持所有 x-vxe-table 的属性
-->
<template>
  <x-tag-group
    ref="tagGroup"
    :containerWidth="containerWidth"
    :collapseTags="false"
    :showNumber="true"
    :tagFontSize="14"
    :tagPaddingWidth="24"
    tooltipKey="label"
    mode="calc"
    class="custom-tag-group"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:tag="{ tag }">
      <Tag type="primary" size="small" class="custom-tag">
        {{ tag?.label }}
      </Tag>
    </template>
  </x-tag-group>
</template>

<script>
import { Tag } from 'element-ui'

export default {
  name: 'CommonTagGroup',
  components: { Tag },
  inheritAttrs: false,
  props: {
    width: [Number]
  },
  data() {
    return {
      containerWidth: this.width || 100,
      resizeObserver: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      const parent = this.$refs?.tagGroup?.$el?.parentElement
      if (parent) {
        this.containerWidth = parent?.offsetWidth || 100
        this.resizeObserver = new ResizeObserver(() => {
          this.containerWidth = parent?.offsetWidth || 100
        })
        this.resizeObserver.observe(parent)
      }
    })
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tag-group {
  width: 100%;
  justify-content: center;
}

::v-deep .custom-tag {
  background-color: rgb(2, 122, 255);
  color: rgb(255, 255, 255);
  border-radius: 50px;
}
</style>
