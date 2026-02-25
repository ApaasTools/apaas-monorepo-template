<template>
  <div
    class="tw-py-2 tw-px-3 tw-rounded"
    :class="{
      'tw-border tw-border-solid tw-border-gray-200': isEdit
    }"
  >
    <div v-if="isEdit">
      <div class="tw-flex tw-items-center tw-gap-2">
        <!-- 输入框 - 只在选择"手动填写"时显示 -->
        <input
          v-if="selectedOption === ''"
          v-model.trim="row[column.prop]"
          placeholder="请输入内容"
          :disabled="column.disabled || tableDisabled"
          class="focus-visible:tw-border-none tw-flex-1 tw-border-none tw-outline-none"
          @input="handleInput"
        />

        <!-- 显示选中的值 - 当不是手动填写时 -->
        <span v-else-if="selectedOption" class="tw-flex-1 tw-text-sm">
          {{ selectedOption }}
        </span>
        <!-- 下拉选择器 -->
        <cube-select
          v-if="!column.disabled && !tableDisabled"
          v-model="selectedOption"
          :options="selectOptions"
          placeholder="请选择"
          @change="handleOptionChange"
          class="tw-px-2 tw-py-1 tw-text-xs tw-border tw-border-gray-300 tw-rounded tw-whitespace-nowrap tw-shrink-0 tw-bg-white"
        ></cube-select>
      </div>
    </div>
    <div v-else class="tw-truncate">{{ row[column.prop] }}</div>
  </div>
</template>

<script>
import { Input, Select } from 'cube-ui/lib'

export default {
  name: 'BaseInput',
  components: {
    CubeInput: Input,
    CubeSelect: Select
  },
  props: {
    column: {
      type: Object,
      default: () => {}
    },
    tableDisabled: {
      type: Boolean,
      default: false
    },
    uuidObj: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    },
    tableColumn: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedOption: '',
      selectOptions: [
        { text: '未发现异常', value: '未发现异常' },
        { text: '无', value: '无' },
        { text: '手动填写', value: '' }
      ]
    }
  },
  computed: {
    isEdit() {
      return this.row[this.uuidObj.project] !== '总分' && !this.column.readOnly
    }
    // selectOptions() {
    //   const baseOptions = [
    //     { text: '未发现异常', value: '未发现异常' },
    //     { text: '无', value: '无' },
    //     { text: '手动填写', value: '' }
    //   ]
    //   const item = this.tableColumn.find((v) => v.label === '打分')
    //   const disabled = this.row[item?.prop] !== 1

    //   // if (!item) {
    //   //   // feature/20251117: 如果得分不是满分的，都必须填写描述，不能选“无”或者“未发现异常”
    //   const total1 = this.tableColumn.find((v) => v.label === '配分')
    //   const total2 = this.tableColumn.find((v) => v.label === '得分')
    //   console.info('==>', this.row[total1?.prop] !== this.row[total2?.prop], item)

    //   //   if (this.row[total1?.prop] !== this.row[total2?.prop]) {
    //   //     return baseOptions?.slice(-1)
    //   //   }
    //   // }

    //   return disabled ? baseOptions?.slice(-1) : baseOptions
    // }
  },
  watch: {
    // 监听row[column.prop]的变化，同步到selectedOption
    row: {
      handler(newVal) {
        if (newVal && this.column && this.column.prop) {
          const currentValue = newVal[this.column.prop]
          if (currentValue === '未发现异常' || currentValue === '无') {
            this.selectedOption = currentValue
          } else if (currentValue && currentValue !== '') {
            this.selectedOption = ''
          } else {
            // 当值为空时，默认选择"手动填写"
            this.selectedOption = ''
          }
        }

        const baseOptions = [
          { text: '未发现异常', value: '未发现异常' },
          { text: '无', value: '无' },
          { text: '手动填写', value: '' }
        ]
        const item = this.tableColumn.find((v) => v.label === '打分')
        const disabled = this.row[item?.prop] !== 1

        // 总表的逻辑
        if (!item) {
          // feature/20251117: 如果得分不是满分的，都必须填写描述，不能选“无”或者“未发现异常”
          const total1 = this.tableColumn.find((v) => v.label === '配分')
          const total2 = this.tableColumn.find((v) => v.label === '得分')
          const isMax = this.row[total1?.prop] === this.row[total2?.prop]
          this.selectOptions = isMax ? baseOptions : baseOptions?.slice(-1)
          return
        }
        this.selectOptions = disabled ? baseOptions?.slice(-1) : baseOptions
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleOptionChange() {
      if (this.selectedOption === '未发现异常' || this.selectedOption === '无') {
        // 选择预设选项时，直接设置值
        this.row[this.column.prop] = this.selectedOption
        this.$emit('input-change', this.row[this.column.prop], this.row, this.column)
      } else if (this.selectedOption === '') {
        // 选择手动填写时，清空当前值，等待用户输入
        this.row[this.column.prop] = ''
      }
      this.$emit('optionChange', this.row[this.column.prop])
    },
    handleInput() {
      // 处理输入事件，可以在这里添加其他逻辑
      this.$emit('input-change', this.row[this.column.prop], this.row, this.column)
      this.$emit('optionChange', this.row[this.column.prop])
      // this.$emit('change', this.row[this.column.prop])
    }
    // selectOptions(row, value) {
    //   const item = this.tableColumn.find((v) => v.label === '打分')
    //   const disabled = row[item?.prop] !== 1
    //   const baseOptions = [
    //     { text: '未发现异常', value: '未发现异常' },
    //     { text: '无', value: '无' },
    //     { text: '手动填写', value: '' }
    //   ]
    //   return baseOptions
    // }
  }
}
</script>
