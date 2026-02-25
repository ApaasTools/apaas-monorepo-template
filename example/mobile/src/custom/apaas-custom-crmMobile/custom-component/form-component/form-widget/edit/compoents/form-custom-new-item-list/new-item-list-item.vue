<!--
 * @Description: 新件清单物料卡片组件
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-new-item-list/new-item-list-item.vue
-->
<template>
  <div class="tw-bg-white tw-rounded-xl tw-p-4 tw-shadow-md tw-relative" @click="showItemDetail">
    <!--  -->
    <!-- 标题与操作按钮 -->
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-3">
      <div class="tw-flex tw-items-center">
        <span class="tw-text-base tw-font-medium tw-text-gray-800">{{
          item.itemFigureNumber1 || '未填写'
        }}</span>
      </div>
      <div class="tw-flex tw-space-x-2" v-if="editable" @click.stop="deleteItem">
        <x-svg-icon
          name="x-lib-delete"
          class="tw-w-5 tw-h-5 tw-cursor-pointer tw-text-red-500"
        ></x-svg-icon>
      </div>
    </div>

    <!-- 物料信息展示 -->
    <div class="tw-flex tw-flex-col">
      <div v-for="(field, index) in displayFields" :key="index" class="tw-mb-1.5">
        <div class="tw-flex tw-flex-row tw-items-center">
          <span class="tw-text-gray-500 tw-min-w-[90px] tw-flex-shrink-0">{{ field.label }}：</span>
          <span class="tw-text-gray-800 tw-break-all tw-flex-1">
            <template v-if="field.formatter === 'formatArrayValue'">
              {{ formatArrayValue(item[field.prop], field.formatParams && field.formatParams[0]) }}
            </template>
            <template v-else-if="field.formatter === 'formatDictionaryValue'">
              {{ formatDictionaryValue(field.dictionaryCode, item[field.prop], dictionaryData) }}
            </template>
            <template v-else>
              {{ item[field.prop] || '未填写' }}
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="tw-mt-4 tw-pt-3 tw-border-t tw-border-gray-100 tw-flex tw-justify-between">
      <div v-if="editable" class="tw-flex-1 tw-flex tw-space-x-2" @click.stop>
        <cube-button :primary="true" class="tw-flex-1 tw-py-2 tw-rounded-full" @click="editItem">
          编辑
        </cube-button>
      </div>
    </div>
  </div>
</template>

<script>
import { listItemFields } from './utils/field-configs'
import { formatArrayValue, formatDictionaryValue } from './utils/formatters'
import { Button } from 'cube-ui/lib'

export default {
  name: 'NewItemListItem',
  components: {
    CubeButton: Button
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    dictionaryData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      displayFields: listItemFields
    }
  },
  methods: {
    formatArrayValue,
    formatDictionaryValue,

    // 显示物料详情
    showItemDetail() {
      this.$emit('show-detail', this.item)
    },

    // 编辑物料
    editItem() {
      this.$emit('edit-item', this.item, this.index)
    },

    // 删除物料
    deleteItem() {
      console.info('deleteItem', this.item)
      this.$emit('delete-item', this.item)
    }
  }
}
</script>
