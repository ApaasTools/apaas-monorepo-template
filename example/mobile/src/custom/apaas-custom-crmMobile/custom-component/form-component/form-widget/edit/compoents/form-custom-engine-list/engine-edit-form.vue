<!--
 * @Description: 引擎编辑组件
 * @Date: 2025-07-01
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-engine-list/engine-edit-form.vue
-->
<template>
  <mobile-detail-popup
    v-model="visible"
    :title="getTitle"
    @close="handleClose"
    :loading="loading"
    :zIndex="1000"
  >
    <!-- 表单内容区域 -->
    <div class="tw-pb-20">
      <div v-if="dataList.length === 0" class="tw-text-center tw-py-8 tw-text-gray-500">
        <p>暂无数据</p>
      </div>

      <div v-else>
        <div
          v-for="(field, fieldIndex) in formFieldConfigs"
          :key="fieldIndex"
          class="tw-py-3 tw-px-4 tw-border-b tw-border-gray-300 last:tw-border-b-0"
        >
          <span class="tw-text-gray-500 tw-mb-1 tw-block">{{ field.label }}：</span>

          <!-- 输入框类型 -->
          <cube-input
            v-if="field.type === 'input' && !isDateField(field.prop)"
            v-model="dataList[0][field.prop]"
            :placeholder="field.placeholder"
            :disabled="mode === 'view'"
            class="tw-w-full cube-input-border"
            :class="mode === 'view' ? 'tw-bg-gray-100 tw-bg-opacity-50' : ''"
          ></cube-input>

          <!-- 日期选择器类型 -->
          <div v-else-if="isDateField(field.prop)" class="tw-relative">
            <cube-input
              v-model="dataList[0][field.prop]"
              :placeholder="field.placeholder"
              readonly
              :disabled="mode === 'view'"
              class="tw-w-full tw-pr-3 cube-input-border"
              :class="mode === 'view' ? 'tw-bg-gray-100 tw-bg-opacity-50' : ''"
              @click.native="mode !== 'view' && showDatePicker(field.prop)"
            >
              <i slot="append" class="cubeic-calendar tw-text-gray-400"></i>
            </cube-input>
          </div>

          <!-- 责任驻外区域搜索下拉框 -->
          <div v-else-if="field.prop === 'responsibleOfficeDp'" class="tw-w-full">
            <EngineSelectionData
              v-model="dataList[0][field.prop]"
              :placeholder="field.placeholder"
              :tabId="field.tabId"
              :formId="field.formId"
              labelKey="officeName"
              prop="responsibleOfficeDp"
              :disabled="mode === 'view'"
              @change="selectionDataChange"
            />
          </div>

          <!-- 责任服务站搜索下拉框 -->
          <div v-else-if="field.prop === 'responsibilityStationDp'" class="tw-w-full">
            <EngineSelectionData
              v-model="dataList[0][field.prop]"
              :placeholder="field.placeholder"
              :tabId="field.tabId"
              :formId="field.formId"
              labelKey="stationName"
              prop="responsibilityStationDp"
              :disabled="mode === 'view'"
              @change="selectionDataChange"
            />
          </div>

          <!-- 选择器类型 -->
          <cube-select
            v-else-if="field.type === 'select'"
            v-model="dataList[0][field.prop]"
            :options="formatDictionaryOptions(field.dictionaryCode)"
            :placeholder="field.placeholder"
            :auto-pop="false"
            :immediate="true"
            :disabled="mode === 'view'"
            :zIndex="1000"
            class="tw-w-full cube-select-z-index"
          ></cube-select>

          <!-- 开关类型 -->
          <cube-switch
            v-else-if="field.type === 'switch'"
            v-model="dataList[0][field.prop]"
            :disabled="mode === 'view'"
          ></cube-switch>

          <!-- 纯展示类型 -->
          <span
            v-else-if="field.type === 'display'"
            class="tw-z-50 tw-text-gray-800 tw-leading-normal tw-break-all"
          >
            <template v-if="field.formatter === 'formatPlantDp'">
              {{ formatPlantDp(dataList[0][field.prop]) }}
            </template>
            <template v-else>
              {{ dataList[0][field.prop] }}
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- 底部固定保存按钮，仅在编辑/新增模式显示 -->
    <div
      v-if="mode !== 'view'"
      class="tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white tw-shadow-md tw-p-4 tw-border-t tw-border-gray-200"
    >
      <cube-button
        :primary="true"
        @click="confirmAdd"
        class="tw-w-full tw-h-11 tw-rounded-full tw-text-base tw-font-medium"
      >
        保存
      </cube-button>
    </div>

    <!-- 日期选择器 -->
    <cube-date-picker
      ref="datePicker"
      v-model="datePickerValue"
      :min="new Date(2000, 0, 1)"
      :max="new Date(2030, 11, 31)"
      @select="handleDateSelect"
      @cancel="handleDateCancel"
    ></cube-date-picker>
  </mobile-detail-popup>
</template>

<script>
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup'
import { initNewDataItem } from './utils/data-utils'
import { formFieldConfigs, detailFieldConfigs } from './utils/field-configs'
import { formatPlantDp, formatStatus } from './utils/formatters'
import { Button, Input, Switch, Select, DatePicker } from 'cube-ui/lib'
import * as api from './api'
import EngineSelectionData from './engine-selection-data.vue'

export default {
  name: 'EngineEditForm',
  components: {
    MobileDetailPopup,
    CubeButton: Button,
    CubeInput: Input,
    CubeSwitch: Switch,
    CubeSelect: Select,
    CubeDatePicker: DatePicker,
    EngineSelectionData
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    },
    documentId: {
      type: String,
      required: true
    },
    modeType: {
      type: String,
      default: 'add'
    },
    // 新增 mode 属性，表示组件的模式：编辑/新增/查看
    mode: {
      type: String,
      default: 'add',
      validator: (value) => ['add', 'edit', 'view'].includes(value)
    },
    dictionaryData: {
      type: Object,
      default: () => ({})
    },
    // 新增 loading 属性，用于详情加载状态
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      datePickerValue: new Date(),
      currentDateField: '' // 当前正在编辑的日期字段
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    formFieldConfigs() {
      return formFieldConfigs
    },
    detailFieldConfigs() {
      return detailFieldConfigs
    },
    // 根据模式获取标题
    getTitle() {
      const titles = {
        add: '添加发动机',
        edit: '编辑发动机',
        view: '发动机详情'
      }
      return titles[this.mode] || '发动机信息'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    formatPlantDp,
    formatStatus,
    formatDictionaryOptions(dictionaryCode) {
      if (!this.dictionaryData || !this.dictionaryData[dictionaryCode]) {
        return []
      }

      return this.dictionaryData[dictionaryCode].map((option) => ({
        text: option.valueName,
        value: option.valueCode
      }))
    },
    confirmAdd() {
      this.$emit('save')
    },
    // 判断是否为日期字段
    isDateField(prop) {
      const field = this.formFieldConfigs.find((f) => f.prop === prop)
      return field && field.type === 'date'
    },
    // 显示日期选择器
    showDatePicker(fieldProp) {
      this.currentDateField = fieldProp
      // 如果已有日期，则设置为当前值
      if (this.dataList[0][fieldProp]) {
        try {
          const dateParts = this.dataList[0][fieldProp].split('-')
          if (dateParts.length === 3) {
            this.datePickerValue = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
            )
          }
        } catch (e) {
          this.datePickerValue = new Date()
        }
      } else {
        this.datePickerValue = new Date()
      }

      // 使用nextTick确保DOM更新后再显示日期选择器
      this.$nextTick(() => {
        if (this.$refs.datePicker && this.$refs.datePicker.show) {
          this.$refs.datePicker.show()
        }
      })
    },
    // 处理日期选择
    handleDateSelect(selectedDate, selectedVal, selectedText) {
      if (!this.currentDateField) return

      // 格式化日期为 YYYY-MM-DD HH:mm:ss
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      // 添加时间部分，统一设为当日的00:00:00
      const formattedDate = `${year}-${month}-${day} 00:00:00`

      // 更新数据
      this.$set(this.dataList[0], this.currentDateField, formattedDate)
    },
    // 处理日期选择取消
    handleDateCancel() {
      // 不做任何操作，日期选择器会自动隐藏
    },

    // 获取驻外区域URL
    getOfficeUrl() {
      return (
        window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_IMP_EXP_DOMAIN +
        'business/common/queryOfficeList'
      )
    },

    // 获取服务站URL
    getStationUrl() {
      return (
        window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_IMP_EXP_DOMAIN +
        'business/common/queryStationList'
      )
    },

    // 选择数据变化处理
    selectionDataChange(e, prop) {
      if (prop === 'responsibilityStationDp') {
        this.$set(this.dataList[0], 'stationNumber', e.stationNumber)
      }
      if (prop === 'responsibleOfficeDp') {
        this.$set(this.dataList[0], 'officeCode', e.officeCode)
      }
    }
  },
  mounted() {
    // 确保日期选择器初始化后不自动显示
    this.$nextTick(() => {
      if (this.$refs.datePicker && this.$refs.datePicker.hide) {
        this.$refs.datePicker.hide()
      }
    })
  }
}
</script>

<style scoped lang="scss">
.cube-input-border {
  border: 1px solid #dbd8d8f8;
  border-radius: 4px;
}
</style>

<style>
.cube-picker {
  z-index: 1000 !important;
}
</style>
