<!--
 * @Author: HongYu
 * @Date: 2025-03-06 15:15:50
 * @LastEditTime: 2025-03-06 15:15:50
 * @LastEditors: HongYu
 * @Description: 通用表格组件, 基于 x-vxe-table 封装，支持表格高度自适应，支持所有 x-vxe-table 的属性
-->
<template>
  <div class="common-table">
    <!-- 表格标题 -->
    <div v-if="tableTitle" class="table-title">
      {{ tableTitle }}
    </div>

    <!-- 表格内容 -->
    <x-loading :visible="loading">
      <x-vxe-table
        ref="table"
        :height="height ?? tableHeight"
        :border="true"
        :seqType="seqType"
        layout="total,prev, pager, next, sizes"
        :colConfigs="formatterColConfigs"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template v-for="slot in filterFormatterColConfigs" v-slot:[slot.customSlot]="{ row, index }">
          <slot :name="slot.customSlot" :row="row" :index="index"></slot>
        </template>
        <template slot="empty">
          <x-empty-page class="empty-page"></x-empty-page>
        </template>
      </x-vxe-table>
    </x-loading>
  </div>
</template>

<script>
export default {
  name: 'CommonTable',
  inheritAttrs: false,
  props: {
    /** 表格高度  */
    height: [String, Number],
    /** 表格加载状态 */
    loading: { type: Boolean, default: false },
    /** 表格标题 */
    tableTitle: { type: String, default: '' },
    /** 表格列配置 */
    cols: { type: Array, default: () => [] },
    /** 通用列配置（参考 colConfigs 每一项的配置） */
    commonColConfig: { type: Object, default: () => ({}) },
    /** 序号类型 */
    seqType: { type: String, default: 'none' },
    /** 表格空数据描述 */
    emptyDescription: { type: String, default: '暂无数据' }
  },
  data() {
    return {
      // 表格高度
      tableHeight: 300
    }
  },
  computed: {
    /** 格式化后的列配置 */
    formatterColConfigs() {
      const res = this.cols.map((col) => {
        return {
          showOverflowTooltip: true,
          align: 'center',
          resizable: true,
          ...col,
          ...this.commonColConfig
        }
      })
      return res
    },
    // 过滤出自定义插槽的列配置
    filterFormatterColConfigs() {
      return this.formatterColConfigs.filter(
        (slot) => slot?.customSlot || slot?.customHeadSlot || slot?.customFootSlot
      )
    }
  },
  mounted() {
    if (this.height) return
    // 计算表格高度
    this.$nextTick(() => {
      try {
        const rect = this.$refs.table?.$el?.getBoundingClientRect()
        const pageHeight = document?.documentElement?.clientHeight

        if (rect?.top && pageHeight) {
          const tableHeight = pageHeight - rect.top - 100
          this.tableHeight = tableHeight
        }
      } catch (error) {
        console.error('计算表格高度失败', error)
      }
    })
  }
}
</script>

<style scoped>
/* ::v-deep body :not(.form-rich-text font) {
  position: relative;
} */

::v-deep .empty-page.x-empty-page {
  top: auto !important;
}

.common-table {
  width: 100%;
}

.common-table .table-title {
  width: 100%;
  font-size: 15px;
  font-weight: bold;
  padding: 14px 16px;
  box-sizing: border-box;
  border: 1px solid var(--color-border-1, #eeeeee);
  border-bottom: none;
}
</style>
