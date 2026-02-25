<!--
 * @Description: junfa
 * @Author: junfa
 * @Date: 2023-08-11 09:39:19
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmApaasProject\custom-component\form-component\form-widget\edit\ScoringTable.vue
 * @LastEditors: junfa
 * @LastEditTime: 2025-07-22 15:05:32
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
      :tableData="tableData"
      :columns="computedTableColumn"
      :requiredRow="requiredRow"
      :requiredField="requiredField"
    >
      <template v-if="tableModelCode == 'apparatus_scoring_table'" #header-right>
        <cube-button :primary="true" @click="addRow">
          新增
        </cube-button>
      </template>

      <template v-for="i in tableColumn" #[i.customSlot]="{row, column ,index}">
        <div v-if="i.customSlot === 'index'" :key="i.customSlot">
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
            @change="selectChange($event, row, column)"
            @inputChange="inputChange($event, row, column)"
            @baseDateChange="baseDateChange($event, row, column)"
            @inputNumberChange="inputNumberChange($event, row, column)"
            @selectChange="selectChange($event, row, column)"
            @optionChange="optionChange"
          />
        </div>
        <div v-else :key="i.prop"> {{ row[column.prop] }}</div>
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
  name: 'ScoringTable',
  components: {
    // CubeInput: Input,
    // CubeSelect: Select,
    // CubeSwitch: Switch,
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
      selectConfig: [
        'maturiy_scoring_table',
        'performance_manage_scoring_table',
        'service_station_image_table',
        'service_station_venue_table',
        'repair_tools_process',
        'apparatus_scoring_table'
      ],
      uuidObj: {
        project: null,
        weight: null,
        Agrade: null,
        Bgrade: null,
        Cgrade: null,
        Dgrade: null,
        scoring: null,
        score: null,
        min_score: null,
        max_score: null,
        min_scoring: null,
        max_scoring: null
      },
      partition: {
        maturiy_scoring_table: 'partition1',
        partition2: 'partition2',
        service_station_image_table: 'partition3',
        service_station_venue_table: 'partition4',
        repair_tools_process: 'partition5'
      },
      switchValue: {}, // 用于管理 switch 组件的值
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
      return this.widget?.modelField?.split('.')?.[1] || 'maturiy_scoring_table'
    },
    selectShow() {
      return this.selectConfig.includes(this.tableModelCode)
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
      // return obj.find((item) => item.tableModelCode === this.tableModelCode) || {}
    },
    tableColumn() {
      if (!Array.isArray(this.tableconfig.tableColumn)) {
        return []
      }
      // Update uuidObj mapping if this field matches
      for (let key in this.uuidObj) {
        const obj =
          this.tableconfig.tableColumn.find((item) =>
            item.modelField?.includes(`${this.tableModelCode}.${key}`)
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
              if (this.tableModelCode === 'apparatus_scoring_table' && configObj.label === '打分') {
                configObj.customSlot = 'FORM_NUMBER_INPUT'
              } else if (item.componentType) {
                configObj.customSlot = item.componentType
              }
            }
            if (item.required) {
              configObj.customHeadSlot = 'required'
            }
            return configObj
          })
      ].filter((item) => item.label !== '权重')

      return startArr
    },
    showColConfigs() {
      return []
    },
    tableData() {
      const data = this.formData[this.tableconfig.uuid] || []
      return data
      // return Arr
    },
    totalScoreData() {
      return this.tableData.find((item) => item[this.uuidObj.project] === '总分') || {}
    },
    options() {
      const grades = ['Agrade', 'Bgrade', 'Cgrade', 'Dgrade']
      if (this.tableModelCode === 'apparatus_scoring_table') {
        return ['已更新', '未更新']
      }
      return grades
        .map((grade) => {
          const val = Number(this.totalScoreData[this.uuidObj[grade]])
          return isNaN(val) ? undefined : val
        })
        .filter((val) => val !== undefined)
    },
    // cube-select 需要的选项格式
    scoreOptions() {
      return this.options.map((item) => ({
        text: item.toString(),
        value: item
      }))
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
    // computedFields() {
    //   // 返回要在移动端显示的字段 uuid 数组
    //   return this.tableColumn
    //     .filter((item) => !item.hidden && item.uuid && item.prop !== 'index') // 过滤掉隐藏字段和序号列
    //     .slice(0, 4) // 取前4个字段
    //     .map((item) => item.uuid) // 返回 uuid 数组
    // },

    // computedDisplayNum() {
    //   return this.pagination?.pageSize || 10
    // }
  },
  watch: {
    // 监听表格数据变化，初始化 switch 值
    tableData: {
      handler(newVal, oldVal) {
        // 标记有未保存的更改
        if (!this.isFirstLoad) {
          this.hasUnsavedChanges = true
        }
        setTimeout(() => {
          if (this.isFirstLoad) this.isFirstLoad = false
        }, 1000)
      },
      // immediate: true,
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
    }
  },
  created() {
    window.TotalScoreTable = this
    if (!window.ScoringTableObj) window.ScoringTableObj = {}
    window.ScoringTableObj[this.tableModelCode] = this
  },
  // mounted() {
  //   console.info('formValue', this.$refs.tableRef, this.propKey)
  //   this.$nextTick(() => {
  //     if (this.$refs.tableRef) {
  //       this.$refs.tableRef.formData = this.formData
  //       // this.$refs.tableRef.tableData = this.tableData
  //     }
  //   })
  //   console.info('formValue222=>', this.$refs.tableRef)

  //   // this.formValue = this.tableData
  // },
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
          return InputSelect
        // return BaseInputNumber
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
        // return SelectDictionary
      }
    },

    // 获取要显示的列（根据展开状态）
    // 数字组件变化触发
    // 数字组件变化触发
    inputNumberChange($event, row, column) {
      const { score, scoring } = this.uuidObj

      // 使用策略模式优化条件判断
      const strategy = {
        maturiy_scoring_table: () => this.maturiy_scoring_table($event, row, column),
        performance_manage_scoring_table: () => (row[score] = row[scoring]),
        service_station_venue_table: () => this.service_station_venue_table($event, row, column)
      }

      if (strategy[this.tableModelCode]) {
        strategy[this.tableModelCode]()
      }

      // 计算总分
      this.countTotalScore()
    },
    // 下拉框变化触发
    selectChange($event, row, column) {
      if (this.tableModelCode !== 'apparatus_scoring_table') {
        this.weightScoring(row, this.partition[this.tableModelCode])
      }
      // 计算总分
      this.countTotalScore()

      // feature/20251117: 如果得分不是满分的，都必须填写描述，不能选“无”或者“未发现异常”
      if ($event !== 1) {
        // 需要清除已经选择的 描述
        const item = this.tableColumn.find((v) => v.label === '描述')
        if (['无', '未发现异常'].includes(row[item?.prop])) {
          row[item?.prop] = ''
        }
      }
    },
    // 计算总分
    countTotalScore() {
      const { project, score, scoring } = this.uuidObj
      const { project: wproject, score: wscore, scoring: wscoring } =
        window.TotalScoreTable?.uuidObj || {}
      const totalRow = this.tableData.find((i) => i[project] === '总分')
      if (!totalRow) return
      const nonTotalRows = this.tableData.filter((item) => item[project] !== '总分')
      // 使用策略模式处理不同表格类型的分数计算
      const scoreStrategies = {
        apparatus_scoring_table: () => {
          const hasUnupdated = nonTotalRows.some(
            (item) => !item[scoring] || item[scoring] === '未更新'
          )
          totalRow[scoring] = hasUnupdated ? 0 : 1
          totalRow[score] = hasUnupdated ? 0 : 1
        },
        default: () => {
          totalRow[score] = Number(
            nonTotalRows.reduce((sum, item) => sum + Number(item[score] || 0), 0)
          ).toFixed(2)
          totalRow[scoring] = Number(
            nonTotalRows.reduce((sum, item) => sum + Number(item[scoring] || 0), 0)
          ).toFixed(2)
        }
      }
      const strategy = scoreStrategies[this.tableModelCode] || scoreStrategies['default']
      strategy()

      // 更新汇总表数据
      const summaryTable = this.formData[this.getTableUuid('process_scoring_summary_table')]
      const summaryTableRow = summaryTable?.find((item) =>
        this.tableconfig.label.includes(item[wproject])
      )

      if (summaryTableRow) {
        if (this.tableModelCode === 'performance_manage_scoring_table') {
          summaryTableRow[wscore] =
            Number(totalRow[score]) + Number(this.formData['70db4a3cb054743cc89589df'])
        } else {
          summaryTableRow[wscore] = totalRow[score]
        }
        summaryTableRow[wscoring] = totalRow[scoring]
      }
    },
    // 权重计算
    weightScoring(row, partition) {
      const { project, score, weight, scoring } = this.uuidObj
      const numPartition = Number(
        this.getformData(`service_station_maturity_evaluate_process.${partition}`)
      )
      if (row[project] === '总分') return
      // 使用策略模式处理不同表格类型的分数计算
      const scoreStrategies = {
        service_station_image_table: () =>
          Number(((row[scoring] * numPartition) / (this.tableData.length - 1)).toFixed(3)),
        performance_manage_scoring_table: () =>
          Number((row[scoring] / (this.tableData.length - 1)).toFixed(3)),
        default: () => Number((row[weight] * row[scoring] * numPartition * 0.1).toFixed(2))
      }
      row[score] = (scoreStrategies[this.tableModelCode] || scoreStrategies['default'])()
    },

    // 处理移动端数字输入
    handleNumberInput(value, row, column) {
      // 转换为数字
      const numValue = parseFloat(value) || 0
      row[column.prop] = numValue

      // 调用原有的数字变化处理逻辑
      this.inputNumberChange(numValue, row, column)
    },
    // 验证数字输入范围
    validateNumberInput(value, row, column) {
      const numValue = parseFloat(value) || 0
      const min = Number(row[this.uuidObj.min_score] || row[this.uuidObj.min_scoring]) || 0
      const max = Number(row[this.uuidObj.max_score] || row[this.uuidObj.max_scoring]) || 100

      if (numValue < min) {
        row[column.prop] = min
        this.$toast.show(`输入值不能小于 ${min}`)
      } else if (numValue > max) {
        row[column.prop] = max
        this.$toast.show(`输入值不能大于 ${max}`)
      }

      // 重新触发计算
      this.inputNumberChange(row[column.prop], row, column)
    },
    // 处理 switch 组件变化
    handleSwitchChange(value, row, column) {
      // cube-switch 返回 boolean 值，需要转换为字符串
      const stringValue = value ? 'TRUE' : 'FALSE'
      row[column.prop] = stringValue

      // 调用原有的 switch 变化处理逻辑
      this.switchChange(stringValue, row)
    },

    formatValue(row, column, index) {
      if (column.prop === 'index') {
        return index + 1
      }
      const value = row[column.prop]

      // 附件上传
      if (value && column.customSlot === 'FORM_TEXTAREA_INPUT') {
        const data = JSON.parse(value)
        // console.info('row', row, column, data)
      }
      if ([undefined, null, ''].includes(value)) {
        return '-'
      }
      return value
    },

    addRow() {
      let obj = {}
      obj[this.uuidObj.project] = 'YCGJGZ0112'
      // console.info(this.tableData)
      this.tableData.unshift(obj)
    },

    // 校验接口
    checkRequired() {
      this.requiredField = ''
      this.requiredRow = 0
      const requiredItem = this.tableColumn.filter((item) => item.customHeadSlot === 'required')
      try {
        this.tableData.forEach((item, index) => {
          requiredItem.forEach((v) => {
            let isRequired = item[this.uuidObj.project] !== '总分'
            if (v.customSlot === 'FORM_TEXTAREA_INPUT') {
              const inputs =
                this.tableColumn.filter((i) => i.customSlot === 'FORM_TEXT_INPUT') ?? []
              const hasNoValue = inputs.some((i) => item[i.prop] === '无')
              if (hasNoValue) isRequired = false
            }
            // 先判断是否允许最小值为 0
            const isMinNumber = this.options.includes(0)
            // 如果最小值为 0 且当前值为 0 给予通过
            const isPass = item[v.prop] === 0 && isMinNumber ? false : !item[v.prop]

            console.info({
              isPass,
              isRequired,
              requiredField: !this.requiredField,
              requiredRow: !this.requiredRow,
              isMinNumber,
              value: item[v.prop]
            })

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
      return this.requiredRow > 0
    },

    // 计算宽度
    calculateWidth(column) {
      const width = (column?.minWidth ?? 200) / 4
      return {
        width,
        minWidth: width,
        maxWidth: width
      }
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
  .custom-editSubTable-header {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 40px;
    line-height: 40px;
    border-radius: 4px 4px 0 0;
    // border: 1px solid #e0e0e0;
    border-bottom: 0;
    background-color: #fff;
    .x-svg-icon {
      width: 16px;
      height: 16px;
    }
    .custom-editSubTable-header-icon {
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      .x-svg-icon {
        width: 24px;
        height: 24px;
      }
    }
    .custom-editSubTable-header-title {
      max-width: 80%;
      font-size: 14px;
      font-weight: 600;
    }
    .custom-editSubTable-header-tip {
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      margin-left: 10px;
      color: #f24949;
      font-weight: 400;
      font-size: 14px;
    }
    .custom-editSubTable-header-operate {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: end;
      -ms-flex-pack: end;
      justify-content: flex-end;
      margin-right: 12px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      .x-svg-icon {
        cursor: pointer;
      }
      .custom-editSubTable-header-operate-btn {
        padding: 0 !important;
        border: 0;
        color: #027aff;
        min-width: unset;
        background-color: unset;
        height: 22px;
        margin-left: 16px;
      }
    }
  }
}

// 移动端评分表样式
.mobile-scoring-table {
  // 移动端内容区域
  .mobile-content {
    padding: 15px;

    .scoring-cards {
      .scoring-card {
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 12px;
        // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        transition: all 0.2s ease;
        // border: 1px solid #e0e0e0;
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

          // 展开控制按钮
          .expand-control {
            margin-bottom: 12px;
            text-align: center;

            .expand-btn {
              min-height: 36px;
              padding: 0 16px;
              font-size: 13px;
              border-radius: 18px;

              .cubeic-up,
              .cubeic-down {
                margin-left: 4px;
                font-size: 12px;
              }
            }
          }

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
              // margin-bottom: 8px;
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
                // min-height: 44px;
                display: flex;
                align-items: center;
                padding: 0 12px;
                // background-color: #f5f7fa;
                border-radius: 6px;
                color: #303133;
                font-size: 14px;

                // 长文本处理
                word-break: break-all;
                // line-height: 1.4;
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

// Cube-UI 组件样式覆盖
::v-deep .cube-input {
  .cube-input-field {
    min-height: 44px;
    font-size: 16px; // 防止iOS缩放
    border-radius: 6px;
    border: 1px solid #dcdfe6;
    padding: 0 12px;
    background-color: #fff;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    }

    &[type='number'] {
      -webkit-appearance: none;
      -moz-appearance: textfield;
      appearance: none;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
      }
    }
  }
}

// ::v-deep .cube-select {
//   .cube-select-text {
//     min-height: 44px;
//     font-size: 16px;
//     border-radius: 6px;
//     border: 1px solid #dcdfe6;
//     padding: 0 12px;
//     background-color: #fff;
//     transition: border-color 0.2s ease;

//     &.cube-select-text_active {
//       border-color: #409eff;
//       box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
//     }
//   }

//   .cube-select-icon {
//     color: #c0c4cc;
//     transition: transform 0.2s ease;
//   }

//   &.cube-select_active .cube-select-icon {
//     transform: rotate(180deg);
//   }
// }

::v-deep .cube-switch {
  transform: scale(1.2); // 放大开关以便触摸

  .cube-switch-btn {
    transition: all 0.3s ease;
  }
}

::v-deep .cube-button {
  min-height: 44px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;

  &.cube-btn_outline {
    border-width: 1px;
  }

  &:active {
    transform: translateY(1px);
  }
}

::v-deep .cube-loading {
  .cube-loading-spinners {
    .cube-loading-spinner {
      background-color: #409eff;
    }
  }
}

// 移动端触摸优化
@media (max-width: 767px) {
  // 确保所有可点击元素有足够的触摸区域
  .mobile-scoring-table {
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
