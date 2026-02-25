<template>
  <div class="x-mobile-son-table">
    <div v-if="showHeader" ref="tableHeader" class="table-header">
      <div class="header-left">
        <x-svg-icon name="x-lib-table"></x-svg-icon>
        <div class="table-header-label">
          {{ widget.label || '' }}
        </div>
        <div v-if="requiredRow && requiredField" class="custom-editSubTable-header-tip">
          <i class="el-icon-warning-outline"></i>
          &nbsp;第{{ requiredRow }}行中{{ requiredField }}&nbsp;是必填字段
        </div>
      </div>
      <div ref="headerRight" class="header-right">
        <slot name="header-right">
          <div
            v-show="validateInfo && validateInfo.validate === 'error'"
            class="x-proxy-form-item-validate-msg"
            :class="errorClass"
          >
            <x-svg-icon name="son-table-warning" width="16" height="16"></x-svg-icon>
            <span>{{ validateMsg }}</span>
          </div>
        </slot>
      </div>
    </div>
    <div
      class="table-content"
      :class="{ 'empty-table-content': !tableData.length }"
      @scroll.passive="scroll"
    >
      <table
        :class="{
          [`s-table-scroll-${widget.uuid}`]: true
        }"
        :style="tableData.length && { minHeight: `${tableData.length * 40.5 + 38}px` }"
      >
        <thead v-if="tableData.length" :class="{ 'empty-header': !tableData.length }">
          <tr align="center" class="s-thead-tr">
            <th
              v-for="header in scrollColumns"
              :key="header.uuid"
              class="s-thead-td tw-shrink-0"
              :class="{ cellComponent: header?.customHeadSlot }"
              :style="{
                width: header.width + 'px',
                maxWidth: header.maxWidth + 'px',
                minWidth: header.minWidth + 'px'
              }"
            >
              <div class="td-sub">
                <span class="label-info">{{ header.label }}</span>
              </div>
            </th>

            <!-- <th class="s-thead-td s-thead-td-end">
            </th> -->
          </tr>
        </thead>

        <tbody v-if="tableData.length">
          <tr
            v-for="(body, index) in tableData"
            :key="body.id"
            :class="'s-tbody-tr'"
            @click="handleViewDetail(body, index)"
          >
            <td
              v-for="header in scrollColumns"
              :key="header.uuid"
              class="s-tbody-td tw-shrink-0"
              :class="{ cellComponent: header?.customHeadSlot && index !== tableData.length - 1 }"
              :style="{
                width: header.minWidth + 'px',
                maxWidth: header.maxWidth + 'px',
                minWidth: header.minWidth + 'px'
              }"
            >
              <slot :name="header.customSlot" :index="index" :row="body" :column="header">
                {{ body[header.prop] }}
                <!-- <s-table-td-sub :header="header" :body="body" :inTable="inTable"></s-table-td-sub> -->
              </slot>
            </td>

            <!-- 空元素占位符 -->
            <!-- <td class="s-tbody-td">
              <div class="td-sub">
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>

      <!-- 背景色的内容 -->
      <div ref="emptyBgLeft" class="empty-bg-left"> </div>
      <div ref="emptyBgRight" class="empty-bg-right"> </div>
    </div>
  </div>
</template>

<script>
// import STableTdSub from './s-table-td-sub.vue'
export default {
  name: 'XMobileSonTable',
  components: {
    // STableTdSub
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    inTable: {
      type: Boolean
    },
    widget: {
      type: Object,
      default() {
        return {}
      }
    },
    validateInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    showHeader: {
      type: Boolean,
      default() {
        return true
      }
    },
    mobileDisplayfields: {
      type: Array,
      default: null
    },
    requiredRow: {
      type: Number,
      default: 0
    },
    requiredField: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollingMiddle: false
    }
  },
  computed: {
    computeColumns: function() {
      let columns = this.columns.filter(
        (item) => !['FORM_OCR_IDENTIFY'].includes(item.componentType)
      )
      if (this.mobileDisplayfields) {
        let computeColumns = []
        for (let i = 0; i < columns.length; i++) {
          if (this.mobileDisplayfields.includes(columns[i].uuid)) {
            computeColumns.push(columns[i])
          }
        }
        columns = computeColumns
      }
      return columns
    },
    needIndex() {
      // 需要序号
      return this.widget.mobileSonTableIndex
    },
    fixedNumber() {
      // 表格固定X列
      if (this.widget.mobileSonTableColumnFixed && this.widget.mobileSonTableColumnFixed > 0) {
        return this.widget.mobileSonTableColumnFixed
      } else {
        return 0
      }
    },
    fixedColumns() {
      // 固定的表头
      if (this.fixedNumber) {
        return this.computeColumns.slice(0, this.fixedNumber)
      } else {
        return []
      }
    },
    scrollColumns() {
      // 可滚动的表头
      if (this.fixedNumber) {
        return this.computeColumns.slice(this.fixedNumber)
      } else {
        return this.computeColumns
      }
      // return this.columns
    },
    validateMsg() {
      if (this.validateInfo) {
        if (this.validateInfo.validate === 'error') {
          this.message = this.validateInfo.msg
          return this.validateInfo.msg
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    errorClass() {
      return this.validateInfo && this.validateInfo.validate === 'error' ? 'is-error' : ''
    }
  },
  watch: {
    validateMsg: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.setTableHeader()
          })
        }
      },
      immediate: true
    }
  },
  activated() {
    this.$nextTick(() => {
      this.setTablesWidth()
      this.setTableHeader()
    })
  },
  updated() {
    this.setTablesWidth()
    this.setTableHeader()
  },
  mounted() {
    this.$nextTick(() => {
      this.setTablesWidth()
      this.setTableHeader()
    })
  },
  methods: {
    handleViewDetail(data, index) {
      this.$emit('view-detail', data, index)
    },
    setTablesWidth() {
      // debugger
      const fixedTable =
        document.querySelectorAll(`.s-table-fixed-${this.widget.uuid}`) &&
        document.querySelectorAll(`.s-table-fixed-${this.widget.uuid}`)[0]
      const scrollTable =
        document.querySelectorAll(`.s-table-scroll-${this.widget.uuid}`) &&
        document.querySelectorAll(`.s-table-scroll-${this.widget.uuid}`)[0]
      if (fixedTable && fixedTable.clientHeight && scrollTable) {
        scrollTable.style.marginLeft = fixedTable.clientWidth - 1 + 'px'
      }
    },
    scroll(event) {
      if (event.target.scrollLeft === 0) {
        this.scrollingMiddle = false
      } else {
        this.scrollingMiddle = true
      }
    },
    // 设置表格头部的左右两侧的阴影定位
    setTableHeader() {
      const {
        tableHeader: { clientHeight: headerHeight },
        emptyBgLeft: { style: leftStyle },
        emptyBgRight: { style: rightStyle }
      } = this.$refs
      const headPosition = `${headerHeight}px`
      headerHeight >= 22 && (leftStyle.top = rightStyle.top = headPosition)
    }
  }
}
</script>

<style scoped lang="scss">
.custom-editSubTable-header-tip {
  font-size: 12px;
  color: #f36;
}

.x-mobile-son-table .table-content table {
  table-layout: auto !important;
  width: 100%;
  z-index: 200;
}

.cellComponent {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  //   border: 1px solid black;
  .el-input-group__append {
    border: 1px solid #dcdfe6 !important;
    border-radius: 2px !important;
  }

  &::before {
    position: absolute;
    left: 0px;
    top: 6px;
    z-index: 1;
    margin-top: 5px;
    color: red;
    content: '*';
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
}
</style>
