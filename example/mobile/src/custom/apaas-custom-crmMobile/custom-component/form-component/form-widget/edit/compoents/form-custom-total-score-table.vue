<!--
 * @Description: junfa
 * @Author: junfa
 * @Date: 2023-08-11 09:39:19
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmApaasProject\custom-component\form-component\form-widget\edit\TotalScoreTable.vue
 * @LastEditors: junfa
 * @LastEditTime: 2025-07-22 15:46:34
-->
<template>
  <x-proxy-form-item
    :isInTable="widget.isInTable"
    :showRequired="showRequired"
    :validatorRules="validatorRules"
    :validateKey="validateKey"
    :validateInfo="validateInfo"
    :webFormSettings="webFormSettings"
  >
    <!-- {{ tableModelCode }} -->
    <XMobileSonTable
      :widget="widget"
      :showHeader="true"
      :tableData="filterTableData"
      :columns="computedTableColumn"
      :requiredRow="requiredRow"
      :requiredField="requiredField"
    >
      <template v-for="i in tableColumn" #[i.customSlot]="{row, column ,index}">
        <div v-if="i.customSlot === 'index'" :key="'index-' + i.customSlot">
          {{ index + 1 }}
        </div>

        <div v-else-if="i.customSlot" :key="'slot-' + i.customSlot">
          <component
            :is="componentName(column.customSlot)"
            v-model="row[column.prop]"
            :renderScene="renderSceneText"
            :row="row"
            :column="column"
            :index="rowIndex"
            :options="options"
            :tableDisabled="tableDisabled"
            :uuidObj="uuidObj"
            :uuid="column.prop + index"
            :propKey="propKey"
            v-bind="column.compConfig"
            :compConfig="column.compConfig"
            :connect="column.connect"
            :disabled="column.disabled || tableDisabled"
            :selectShow="selectShow"
            :tableColumn="tableColumn"
            :style="{ width: (column?.minWidth ?? 200) / 4 }"
            @optionChange="optionChange"
            @inputChange="inputChange($event, row, column)"
          />
        </div>
        <div v-else :key="'prop-' + i.prop">
          {{ row[column.prop] }}
        </div>
      </template>
    </XMobileSonTable>
  </x-proxy-form-item>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'

import UploadCrm from './form-custom-comon-table/upload-crm.vue'
import BaseInfo from './form-custom-comon-table/base-info.vue'
import InputSelect from './form-custom-comon-table/input-select.vue'
import BaseInput from './form-custom-comon-table/base-input.vue'
import BaseDate from './form-custom-comon-table/base-date.vue'
import BaseInputNumber from './form-custom-comon-table/base-input-number.vue'
import SelectDictionary from '@/custom/common/components/selection-input.vue'
import BaseSwitch from './form-custom-comon-table/base-switch.vue'
import PersonSelect from './form-custom-comon-table/person-select.vue'
import XMobileSonTable from '@/custom/common/components/x-ui/x-mobile-son-table.vue'

export default {
  name: 'TotalScoreTable',
  components: {
    BaseInfo,
    InputSelect,
    UploadCrm,
    BaseInput,
    BaseDate,
    BaseInputNumber,
    SelectDictionary,
    BaseSwitch,
    PersonSelect,
    XMobileSonTable
  },
  mixins: [FormWidgetConfigMixin],
  props: {
    headIcon: {
      type: String,
      default: 'x-lib-table'
    },
    tableType: {
      type: String,
      default: 'editSubTable'
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    // 控制表格选择类型 'radio' | 'checkbox' | 'seq' | 'none'
    seqType: {
      type: String,
      default: 'none'
    },
    // 打开详情的方式
    openMode: {
      type: String,
      default: 'drawer'
    },
    tableDisabled: {
      type: Boolean,
      default: false
    },
    openConfigs: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      tableLoading: false,
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      params: {},
      requiredRow: 0,
      requiredField: '',
      itemFigureNumber: null,
      uuidObj: {
        project_team: null,
        project: null,
        partitions: null,
        weight: null,
        Agrade: null,
        Bgrade: null,
        Cgrade: null,
        Dgrade: null,
        scoring: null,
        score: null,
        min_scoring: null,
        max_scoring: null,
        fill: null
      },
      renderSceneText: 'read',
      // 是否有发生更改，用于触发页面离开前的确认弹窗
      hasUnsavedChanges: false,
      // 是否首次加载
      isFirstLoad: true
    }
  },
  computed: {
    url() {
      return window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN
    },
    tableModelCode() {
      return this.widget?.modelField?.split('.')?.[1] || ''
    },
    tableconfig() {
      const { formEngine, tableModelCode } = this
      if (!formEngine?.formDataControl?.allTileFormItemList || !tableModelCode) {
        return {}
      }
      return (
        formEngine.formDataControl.allTileFormItemList.find(
          (item) => item.tableModelCode === tableModelCode
        ) || {}
      )
      // return obj
    },
    tableColumn() {
      if (!Array.isArray(this.tableconfig.tableColumn)) {
        return []
      }
      // Update uuidObj mapping if this field matches
      for (let key in this.uuidObj) {
        const obj =
          this.tableconfig.tableColumn.find(
            (item) => item.modelField && item.modelField === `${this.tableModelCode}.${key}`
          ) || {}
        this.uuidObj[key] = obj.uuid
      }
      // Filter visible columns and update field mappings in one pass
      const startArr = [
        {
          prop: 'index',
          label: '序号',
          customSlot: 'index',
          width: 60,
          align: 'center'
        },
        ...this.tableconfig.tableColumn
          .filter((item) => !item.hidden)
          .map((item) => {
            let configObj = {
              readOnly: item.readOnly || false,
              required: item.required || false,
              hidden: item.hidden || false,
              prop: item.uuid,
              label: item.label,
              minWidth: item.colWidth,
              align: 'center',
              showOverflowTooltip: true
            }
            // 优化：合并条件判断，提升可读性
            if (!item.readOnly) {
              configObj.customSlot = item.componentType
            }
            if (item.required) {
              configObj.customHeadSlot = 'required'
            }
            return configObj
          })
      ].filter((item) => item.label !== '项目组')
      return startArr
    },
    showColConfigs() {
      return []
    },
    tableData() {
      const data = this.formData[this.tableconfig.uuid] || []
      // console.info('tableData', data)
      return data
      // return Arr
    },
    filterTableData() {
      return this.tableData.filter((item) => {
        if (item[this.uuidObj.project] === '总分') return true
        return item[this.uuidObj.fill] !== 'N'
      })
    },
    colConfigs() {
      return [
        {
          prop: 'input',
          label: '输入框',
          customHeadSlot: 'required',
          customSlot: 'input'
        },
        {
          prop: 'date1',
          label: '日期1',
          customHeadSlot: 'required',
          customSlot: 'baseDate',
          compConfig: {
            dateType: 'datetimerange',
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            confirmFormat: (val) => ({
              createStartDate: val[0],
              createEndDate: val[1]
            })
          }
        },
        {
          prop: 'inputNumber',
          label: '数字组件',
          customHeadSlot: 'required',
          customSlot: 'inputNumber'
        },
        {
          prop: 'select',
          label: '下拉框',
          customHeadSlot: 'required',
          customSlot: 'select',
          compConfig: {
            dictionaryCode: 'SO_SUPPLY_PARTS_WAY',
            getDataMode: 'visibleChange',
            // getDataFun: this.queryThreeDigitCode,
            valueFormat: {
              label: 'threeDigitCode',
              value: 'threeDigitCode'
            }
          },
          connect: 'itemFigureNumber'
        },
        {
          prop: 'itemFigureNumber',
          label: '故障源件图号',
          customHeadSlot: 'required',
          customSlot: 'itemFigureNumber'
        }
      ]
    },
    computedTableColumn() {
      return this.tableColumn.map((item) => {
        return {
          ...item,
          minWidth: item.prop === 'index' ? 60 : (item?.minWidth ?? 200) / 3
        }
      })
    }
  },
  watch: {
    tableData: {
      handler: function(newVal, oldVal) {
        const { project, score, partitions, scoring } = this.uuidObj
        const totalRow = newVal.find((item) => item[project] === '总分')
        if (!totalRow) return

        const { totalScore, totalScoring, totalPartitions } = newVal.reduce(
          (acc, item) => {
            if (item[project] !== '总分') {
              acc.totalScore += Number(item[score]) || 0
              acc.totalScoring += Number(item[scoring]) || 0
              acc.totalPartitions += Number(item[partitions]) || 0
            }
            return acc
          },
          { totalScore: 0, totalScoring: 0, totalPartitions: 0 }
        )
        totalRow[score] = totalScore.toFixed(2)
        totalRow[scoring] = totalScoring.toFixed(2)
        totalRow[partitions] = totalPartitions.toFixed(2)

        // 只有在组件挂载后才标记为未保存（避免初始化时触发）
        if (!this.isFirstLoad) {
          this.hasUnsavedChanges = true
        }
        setTimeout(() => {
          if (this.isFirstLoad) this.isFirstLoad = false
        }, 1000)
      },
      deep: true
    },
    'formData.70db4a3cb054743cc89589df': {
      handler: function(newVal, oldVal) {
        this.tableData.forEach((item) => {
          if (item[this.uuidObj.project] === '绩效管理') {
            // console.info('70db4a3cb054743cc89589df', newVal)
            item[this.uuidObj.score] = newVal
          }
        })
      },
      deep: true
    },
    'formData.6b6f4ab9a0987b1ac2853125': {
      handler: function(newVal, oldVal) {
        // console.info('6b6f4ab9a0987b1ac2853125', newVal)
        let arr = this.formData['0b404dd884ef28f1994a287d']
        arr.forEach((item) => {
          this.tableData.forEach((e) => {
            if (e[this.uuidObj.project] === item['b84844cca7df1e2707565904']) {
              // console.info('6b6f4ab9a0987b1ac2853125', item['d46e42329ac1bf3afbf9d41b'])
              e[this.uuidObj.score] = item['d46e42329ac1bf3afbf9d41b']
            }
          })
        })
      },
      deep: true
    },
    route: {
      handler() {
        // 煞笔东西，renderScene 竟然不会变，明明点了编辑
        if (this.$route.path.includes('form-edit')) {
          this.renderSceneText = 'edit'
        } else {
          this.renderSceneText = 'read'
        }
      },
      immediate: true
    },
    renderScene: {
      handler() {
        console.info('renderScene', this.renderScene)
      },
      immediate: true,
      deep: true
    }
    // '$route': {
    //   handler() {
    //     console.info('$route', this.$route)
    //   }
    // }
  },
  created() {
    window.TotalScoreTable = this
    if (!window.TotalScoreTableObj) window.TotalScoreTableObj = {}
    window.TotalScoreTableObj[this.tableModelCode] = this
  },
  mounted() {},
  methods: {
    componentName(customSlot) {
      switch (customSlot) {
        // 输入框
        case 'FORM_TEXT_INPUT':
          return BaseInput
        // 日期
        case 'baseDate':
          return BaseDate
        // 数字选择组件
        case 'FORM_NUMBER_INPUT':
          return BaseInputNumber
        // 数据字典下拉框
        case 'select':
          return SelectDictionary
        case 'switch':
          return BaseSwitch
        case 'personSelect':
          return PersonSelect
        // 附件上传
        case 'FORM_TEXTAREA_INPUT':
          return UploadCrm
        // 基本展示
        default:
          return BaseInfo
      }
    },

    // 数字组件变化触发
    inputNumberChange($event, row, column) {
      const { project, score, weight, scoring } = this.uuidObj
      if (this.tableModelCode === 'maturiy_scoring_table') {
        row[score] = Number((row[weight] * row[scoring] * 0.4).toFixed(2))
        const totalRow = this.tableData.find((i) => i[project] === '总分')
        if (totalRow) {
          const nonTotalRows = this.tableData.filter((item) => item[project] !== '总分')
          totalRow[score] = Number(
            nonTotalRows.reduce((sum, item) => sum + Number(item[score] || 0), 0).toFixed(2)
          )
          totalRow[scoring] = Number(
            nonTotalRows.reduce((sum, item) => sum + Number(item[scoring] || 0), 0).toFixed(2)
          )
        }
      } else if (this.tableModelCode === 'performance_manage_scoring_table') {
        row[score] = row[scoring]
      }
    },

    // 下拉框变化触发
    selectChange($event, row, column) {
      // 计算总分
      this.countTotalScore()
    },

    // 输入框变化触发
    inputChange($event, row, column) {
      // 可以在这里添加输入框变化的逻辑
      // console.info('inputChange', $event, row, column)
      const { project, score, weight, scoring } = this.uuidObj
      if (this.tableModelCode === 'maturiy_scoring_table') {
        row[score] = Number((row[weight] * row[scoring] * 0.4).toFixed(2))
        const totalRow = this.tableData.find((i) => i[project] === '总分')
        if (totalRow) {
          const nonTotalRows = this.tableData.filter((item) => item[project] !== '总分')
          totalRow[score] = Number(
            nonTotalRows.reduce((sum, item) => sum + Number(item[score] || 0), 0).toFixed(2)
          )
          totalRow[scoring] = Number(
            nonTotalRows.reduce((sum, item) => sum + Number(item[scoring] || 0), 0).toFixed(2)
          )
        }
      } else if (this.tableModelCode === 'performance_manage_scoring_table') {
        row[score] = row[scoring]
      }

      // feature/20251117: 如果得分不是满分的，都必须填写描述，不能选“无”或者“未发现异常”
      const total = this.tableColumn.find((v) => v.label === '配分')
      if ($event !== row[total?.prop]) {
        // 需要清除已经选择的 描述
        const item = this.tableColumn.find((v) => v.label === '描述')
        if (['无', '未发现异常'].includes(row[item?.prop])) {
          row[item?.prop] = ''
        }
      }
    },

    // 日期变化触发
    baseDateChange($event, row, column) {
      // 可以在这里添加日期变化的逻辑
    },

    // 下拉框显示变化
    visibleChange($event, row, column) {
      // 可以在这里添加下拉框显示变化的逻辑
    },

    // 计算总分
    countTotalScore() {
      const { project, score, scoring, partitions } = this.uuidObj
      const totalRow = this.tableData.find((i) => i[project] === '总分')
      if (totalRow) {
        const nonTotalRows = this.tableData.filter((item) => item[project] !== '总分')
        totalRow[score] = Number(
          nonTotalRows.reduce((sum, item) => sum + Number(item[score] || 0), 0).toFixed(2)
        )
        totalRow[scoring] = Number(
          nonTotalRows.reduce((sum, item) => sum + Number(item[scoring] || 0), 0).toFixed(2)
        )
        if (partitions) {
          totalRow[partitions] = Number(
            nonTotalRows.reduce((sum, item) => sum + Number(item[partitions] || 0), 0).toFixed(2)
          )
        }
      }
    },

    formatValue(row, column, index) {
      if (column.prop === 'index') {
        return index + 1
      }
      const value = row[column.prop]

      if ([undefined, null, ''].includes(value)) {
        return '-'
      }
      return value
    },

    // 校验接口
    checkRequired() {
      this.requiredField = ''
      this.requiredRow = 0
      const requiredItem = this.tableColumn.filter((item) => item.customHeadSlot === 'required')
      try {
        this.filterTableData.forEach((item, index) => {
          // const index = item?.index ?? num
          requiredItem.forEach((v) => {
            let isRequired = item[this.uuidObj.project] !== '总分'
            if (v.customSlot === 'FORM_TEXTAREA_INPUT') {
              const inputs =
                this.tableColumn.filter((i) => i.customSlot === 'FORM_TEXT_INPUT') ?? []
              const hasNoValue = inputs.some((i) => item[i.prop] === '无')
              if (hasNoValue) isRequired = false
            }
            // console.info('item', item, index)
            // 先判断是否允许最小值为 0
            const minScoring = item[[this.uuidObj.min_scoring]] === 0
            // 如果最小值为 0 且当前值为 0 给予通过
            const isPass = item[v.prop] === 0 && minScoring ? false : !item[v.prop]

            // console.info({
            //   isRequired,
            //   isPass,
            //   requiredField: !this.requiredField,
            //   requiredRow: !this.requiredRow
            // })

            // 判断是否没有必填
            if (isPass && !this.requiredField && !this.requiredRow && isRequired) {
              this.requiredField = v.label
              this.requiredRow = index + 1
              throw new Error('continue')
            }
          })
        })
      } catch {
        console.error('终止')
      }

      // 是否校验通过
      const isPass = this.requiredRow > 0

      return isPass
    },

    optionChange() {
      this.hasUnsavedChanges = true
    }
  }
}
</script>

<style scoped lang="scss">
.custom-editSubTable {
  margin-bottom: 20px;
}

// 移动端总分表样式
.mobile-total-score-table {
  // 移动端内容区域
  .mobile-content {
    padding: 15px;

    .scoring-cards {
      .scoring-card {
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 12px;
        overflow: hidden;
        transition: all 0.2s ease;
        box-shadow: 0 0.285714rem 1.142857rem 0.571429rem rgba(0, 0, 0, 0.02);
        border: 0.07142rem solid #eeeeee;

        // 总分卡片特殊样式
        &.total-score-card {
          border: 2px solid #409eff;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        // 卡片头部
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 12px;
          border-bottom: 1px solid #f0f0f0;
          box-sizing: border-box;

          .card-title {
            display: flex;
            align-items: center;

            .row-number {
              font-size: 16px;
              font-weight: 600;
              color: #303133;
              margin-right: 8px;
            }

            .project-name {
              font-size: 14px;
              color: #606266;
              background-color: #f5f7fa;
              padding: 2px 8px;
              border-radius: 4px;
            }
          }

          .total-badge {
            background-color: #409eff;
            color: #fff;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }
        }

        // 卡片内容
        .card-content {
          padding: 16px;

          .field-row {
            margin-bottom: 6px;
            display: flex;
            align-items: center;

            &:last-child {
              margin-bottom: 0;
            }

            .field-label {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-weight: 500;
              width: 60px;
              flex-shrink: 0;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              color: #999;

              .required-mark {
                color: #f56c6c;
                margin-right: 4px;
                font-weight: bold;
              }
            }

            .field-input {
              flex: 1;
              .display-value {
                height: 100%;
                display: flex;
                align-items: center;
                padding: 0 12px;
                border-radius: 6px;
                color: #303133;
                font-size: 14px;
                word-break: break-all;
              }
            }
          }
        }

        // 触摸反馈
        &:active {
          transform: translateY(1px);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }
      }
    }

    // 空状态
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      background-color: #fff;
      border-radius: 12px;
      margin-top: 20px;
    }
  }
}

// 移动端触摸优化
@media (max-width: 767px) {
  .mobile-total-score-table {
    -webkit-tap-highlight-color: transparent;

    * {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    input,
    textarea {
      -webkit-user-select: text;
      user-select: text;
    }
  }

  // 优化滚动性能
  .mobile-content {
    -webkit-overflow-scrolling: touch;
    transform: translateZ(0);
  }
}
</style>
