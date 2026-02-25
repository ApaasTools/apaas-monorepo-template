<!--
 * @Description: 引擎列表项组件
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-engine-list/engine-list-item.vue
-->
<template>
  <div
    class="tw-bg-white tw-rounded-xl tw-p-4 tw-mb-3 tw-shadow-md hover:tw-shadow-lg tw-transition-shadow"
    @click="showDetail"
  >
    <div
      class="tw-flex tw-justify-between tw-items-center tw-mb-2.5 tw-border-b tw-border-gray-100 tw-pb-2.5"
    >
      <div class="tw-text-base tw-font-semibold">
        <span class="tw-text-gray-800">{{ item.engineNumber || '未填写' }}</span>
      </div>
      <div @click.stop>
        <cube-button
          v-if="editable"
          class="tw-text-red-500 tw-text-sm !tw-border-red-500 !tw-border-solid tw-border-[1px] tw-bg-transparent"
          @click="deleteItem"
        >
          删除
        </cube-button>
      </div>
    </div>

    <div class="tw-flex tw-flex-col">
      <div v-for="(field, index) in displayFields" :key="index" class="tw-mb-1">
        <div
          class="tw-flex tw-flex-row tw-items-center tw-py-1.5 tw-border-b tw-border-gray-50 last:tw-border-b-0"
        >
          <span
            class="tw-text-gray-500 tw-min-w-[90px] tw-flex-shrink-0 tw-block tw-w-[90px] tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap"
            >{{ field.label }}：</span
          >
          <span
            :class="[
              'tw-text-gray-800 tw-break-all tw-flex-1',
              field.tag ? 'tw-inline-block tw-text-blue-500' : ''
            ]"
          >
            <template v-if="field.formatter === 'formatPlantDp'">
              {{ formatPlantDp(item[field.prop]) }}
            </template>
            <template v-else-if="field.formatter === 'formatStatus'">
              {{ formatStatus(item[field.prop], field.dictionaryCode, dictionaryData) }}
            </template>
            <template v-else>
              {{ item[field.prop] || '未填写' }}
            </template>
          </span>
        </div>
      </div>
    </div>

    <cube-button v-if="editable" :primary="true" class="tw-mt-3" @click.stop="editItem">
      编辑
    </cube-button>
  </div>
</template>

<script>
import { listItemFields } from './utils/field-configs'
import { formatPlantDp, formatStatus } from './utils/formatters'
import { Button } from 'cube-ui/lib'

export default {
  name: 'EngineListItem',
  components: {
    CubeButton: Button
  },
  props: {
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
  computed: {
    displayFields() {
      // 排除发动机编号，因为它已经在标题中显示
      return listItemFields.filter((field) => field.prop !== 'engineNumber')
    }
  },
  methods: {
    showDetail() {
      this.$emit('show-detail', this.item)
    },
    deleteItem() {
      this.$emit('delete-item', this.item)
    },
    editItem() {
      this.$emit('edit-item', this.item)
    },
    formatPlantDp,
    formatStatus
  }
}
</script>
