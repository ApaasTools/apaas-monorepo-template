<!--
 * @Description: 标注
 * @Author: 张威
 * @Date: 2023-08-11 09:39:19
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmApaasProject\custom-component\form-component\form-widget\edit\form-custom-supplierSelection.vue
 * @LastEditors: junfa
 * @LastEditTime: 2024-07-18 18:03:12
-->
<template>
  <div>
    <x-proxy-form-item
      v-if="showBorder"
      class="widget-item"
      :isInTable="widget.isInTable"
      :showRequired="showRequired"
      :label="widget.label"
      :validatorRules="validatorRules"
      :validateKey="validateKey"
      :validateInfo="validateInfo"
      :webFormSettings="webFormSettings"
    >
      <!-- 移动端供应商选择输入区域 -->
      <div class="supplier-selection-input-mobile">
        <!-- 编辑状态：显示带边框的输入容器 -->
        <div class="input-container" @click="focusInput">
          <div class="render-data-container">
            <!-- 显示已选择的供应商信息 -->
            <div v-if="formValue" class="selected-display">
              <span class="selected-text">{{ formValue }}</span>
              <span class="clear-btn" @click.stop="clearData">
                <i class="cubeic-close"></i>
              </span>
            </div>
            <div v-else class="placeholder-display">
              <span class="placeholder-text">请选择{{ widget.label }}</span>
              <i class="cubeic-search"></i>
            </div>
          </div>
        </div>
      </div>
    </x-proxy-form-item>

    <!-- 只读状态：仅显示纯文本 -->
    <div v-else class="readonly-display">
      <span v-if="formValue" class="readonly-text">{{ formValue }}</span>
      <span v-else class="readonly-empty">-</span>
    </div>

    <mobile-detail-popup
      v-model="popupVisible"
      :title="widget.label + '选择'"
      :show-footer="true"
      ok-btn-text="确认"
      :mask-closable="false"
      @close="handleClose"
      @confirm="confirm"
    >
      <!-- 搜索区域 -->
      <div class="search-container">
        <cube-input v-model="keyword" class="tw-px-4" placeholder="请输入关键字搜索" @input="handleSearch">
          <template slot="prepend">
            <i class="cubeic-search"></i>
          </template>
        </cube-input>
      </div>

      <!-- 供应商列表 -->
      <div class="supplier-list-container">
        <cube-loading v-if="tableLoading && tableData.length === 0">
          <span>加载中...</span>
        </cube-loading>

        <div v-else-if="tableData.length === 0" class="empty-tip">
          暂无数据
        </div>

        <cube-scroll v-else ref="supplierScroll" :options="dynamicScrollOptions" @pulling-up="loadMore">
          <div
            v-for="item in tableData"
            :key="item.responsibilityCode"
            class="supplier-item"
            :class="{ selected: item.selected }"
            @click="selectSupplier(item)"
          >
            <div class="supplier-info">
              <div class="supplier-name">{{ item.responsibilityName }}</div>
              <div class="supplier-code">代码：{{ item.responsibilityCode }}</div>
              <div class="supplier-company">公司：{{ item.companyCode }}</div>
              <div class="supplier-department">部门：{{ item.departmentName }}</div>
            </div>
            <div class="selection-indicator">
              <i v-if="item.selected" class="cubeic-right"></i>
            </div>
          </div>

          <!-- 加载更多数据时的loading指示器 -->
          <div v-if="tableLoading && tableData.length > 0" class="load-more-indicator">
            <cube-loading>
              <span>正在加载更多...</span>
            </cube-loading>
          </div>
        </cube-scroll>
      </div>
    </mobile-detail-popup>
  </div>
</template>

<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
import { Input, Button, Loading, Scroll, Toast } from 'cube-ui/lib'
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup/index.vue'

export default {
  name: 'FORM_CUSTOM_SUPPLIER_SELECTION',
  components: {
    CubeInput: Input,
    CubeButton: Button,
    CubeLoading: Loading,
    CubeScroll: Scroll,
    CubeToast: Toast,
    MobileDetailPopup
  },
  mixins: [FormWidgetConfigMixin],
  data() {
    return {
      tableData: [],
      tableLoading: false,
      pagination: {
        pageSize: 20, // 移动端增加每页数量
        currentPage: 1,
        total: 0
      },
      keyword: '',
      searchDebounce: null,
      hasMore: true, // 是否还有更多数据
      scrollOptions: {
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: '上滑加载更多',
            noMore: '没有更多数据了'
          }
        },
        scrollbar: false,
        bounce: {
          top: false,
          bottom: true
        }
      },
      showBorder: false,
      popupVisible: false
    }
  },
  watch: {
    "formData[this.getHideUid('ord_responsible_info.responsibility_category')]": function(newVal) {
      this.formValue = null
      this.formData[this.getHideUid('ord_responsible_info.three_digit_code')] = null
      this.formData[this.getHideUid('ord_responsible_info.department_code')] = null
      this.formData[this.getHideUid('ord_responsible_info.department_name')] = null
    }
  },
  computed: {
    // 判断是否为编辑状态
    isEdit() {
      return !this.widget?.readOnly && this.renderScene === 'edit'
    },
    // 动态滚动选项
    dynamicScrollOptions() {
      return {
        pullUpLoad: this.hasMore ? {
          threshold: 50, // 增加阈值，提前触发加载
          txt: {
            more: '上滑加载更多',
            noMore: '没有更多数据了'
          }
        } : {
          txt: {
            noMore: '没有更多数据了'
          }
        },
        scrollbar: {
          fade: true,
          interactive: false
        },
        bounce: {
          top: false,
          bottom: true
        },
        momentum: true,
        mouseWheel: {
          speed: 20,
          invert: false
        },
        preventDefault: false,
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/
        }
      }
    }
  },
  created() {
    window.supplierSelection = this
    // 初始化搜索防抖
    this.searchDebounce = this.debounce(this.performSearch, 500)
  },
  mounted() {
    // 用于判断是否编辑
    this.$nextTick(() => {
      const compElement = document.querySelector(`[data-component-id="${this.propKey}"]`)
      if (compElement) {
        this.showBorder = true
      }
    })
  },
  methods: {
    // 防抖工具函数
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },

    // 点击输入框打开选择弹窗
    focusInput() {
      // 只有在编辑状态下才能打开弹窗
      if (!this.isEdit) {
        return
      }

      // 检查是否有必要的前置条件
      if (
        this.widget.readOnly ||
        (this.getformData('ord_responsible_info.responsibility_category') &&
          this.getformData('ord_responsible_info.responsibility_category').length === 0)
      ) {
        return
      }

      this.popupVisible = true
      this.resetPagination()
      this.keyword = ''
      this.tableData = []
      // 等待DOM更新后再加载数据，确保scroll组件已经渲染
      this.$nextTick(() => {
        this.getTableData()
        // 确保scroll组件正确初始化
        this.refreshScrollComponent()
      })
    },

    // 清空数据
    clearData() {
      this.formValue = null
      this.formData[this.getHideUid('ord_responsible_info.responsibility_code')] = null
      this.formData[this.getHideUid('ord_responsible_info.department_code')] = null
      this.formData[this.getHideUid('ord_responsible_info.department_name')] = null
    },

    // 关闭弹窗
    handleClose() {
      this.popupVisible = false
    },

    // 搜索处理
    handleSearch() {
      this.searchDebounce()
    },

    // 执行搜索
    performSearch() {
      this.resetPagination()
      this.tableData = []
      // 重置scroll组件状态
      if (this.$refs.supplierScroll) {
        this.$refs.supplierScroll.scrollTo(0, 0)
      }
      this.getTableData()
      // 搜索后刷新scroll组件
      this.refreshScrollComponent()
    },

    // 重置分页
    resetPagination() {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        total: 0
      }
      this.hasMore = true
    },

    // 加载更多数据
    loadMore() {
      if (this.hasMore && !this.tableLoading) {
        this.pagination.currentPage++
        this.getTableData(true)
      } else {
        // 如果没有更多数据，需要调用forceUpdate来停止loading状态
        this.$nextTick(() => {
          if (this.$refs.supplierScroll) {
            this.$refs.supplierScroll.forceUpdate()
          }
        })
      }
    },

    // 刷新滚动组件
    refreshScrollComponent() {
      this.$nextTick(() => {
        if (this.$refs.supplierScroll) {
          this.$refs.supplierScroll.refresh()
        }
      })
    },

    // 选择供应商
    selectSupplier(item) {
      // 清除之前的选择
      this.tableData.forEach((supplier) => {
        this.$set(supplier, 'selected', false)
      })
      // 设置当前选择
      this.$set(item, 'selected', true)
    },
    // 获取表格数据
    getTableData(isLoadMore = false) {
      this.tableLoading = true
      const url = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN

      this.$request({
        url: `${url}business/serviceOrder/queryResponsibleUnitList`,
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          keywords: this.keyword,
          companyProduct: this.getformData('ord_responsible_info.company_source'), // 适用公司
          docTypeNumber: this.getformData('ord_responsible_info.doc_type_number'), // 单据类型
          responsibilityCategory:
            this.getformData('ord_responsible_info.responsibility_category').length > 0
              ? this.getformData('ord_responsible_info.responsibility_category')[0]
              : null, // 责任分类
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
      })
        .asyncThen(
          (res) => {
            const newData = (res.table || []).map(item => ({
              ...item,
              selected: false // 确保每个项目都有selected属性
            }))

            if (isLoadMore) {
              // 加载更多时追加数据
              this.tableData = [...this.tableData, ...newData]
            } else {
              // 首次加载或搜索时替换数据
              this.tableData = newData
            }

            this.pagination.total = res.total

            // 判断是否还有更多数据
            const totalLoaded = this.tableData.length
            this.hasMore = totalLoaded < this.pagination.total && newData.length === this.pagination.pageSize

            this.tableLoading = false

            // 完成加载更多 - 需要在下一个tick中调用forceUpdate确保DOM已更新
            this.$nextTick(() => {
              if (this.$refs.supplierScroll) {
                this.$refs.supplierScroll.forceUpdate()
              }
            })
          },
          () => {
            this.tableLoading = false
            this.hasMore = false
            // 确保在错误情况下也更新scroll组件状态
            this.$nextTick(() => {
              if (this.$refs.supplierScroll) {
                this.$refs.supplierScroll.forceUpdate()
              }
            })
          }
        )
        .asyncErrorCatch(() => {
          this.tableLoading = false
          this.hasMore = false
          // 确保在错误情况下也更新scroll组件状态
          this.$nextTick(() => {
            if (this.$refs.supplierScroll) {
              this.$refs.supplierScroll.forceUpdate()
            }
          })
        })
    },
    // 确认选择
    confirm() {
      const selectData = this.tableData.find((i) => i.selected)

      if (!selectData) {
        // 使用移动端提示
        const toast = this.$createToast({
          txt: '请选择一个供应商',
          type: 'warn',
          time: 2000
        })
        toast.show()
        return
      }

      // 设置表单值
      this.formValue = selectData.responsibilityName
      this.formData[this.getHideUid('ord_responsible_info.responsibility_code')] =
        selectData.responsibilityCode
      this.formData[this.getHideUid('ord_responsible_info.department_code')] =
        selectData.departmentCode
      this.formData[this.getHideUid('ord_responsible_info.department_name')] =
        selectData.departmentName

      // 关闭弹窗
      this.popupVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
// 移动端供应商选择输入样式
.supplier-selection-input-mobile {
  .input-container {
    min-height: 44px; // 移动端最小触摸目标
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:active {
      border-color: #409eff;
      background-color: #f5f7fa;
    }

    .render-data-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .selected-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .selected-text {
          flex: 1;
          font-size: 14px;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .clear-btn {
          margin-left: 8px;
          padding: 4px;
          color: #c0c4cc;
          font-size: 16px;
          cursor: pointer;
          transition: color 0.3s ease;

          &:active {
            color: #f56c6c;
          }
        }
      }

      .placeholder-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .placeholder-text {
          flex: 1;
          font-size: 14px;
          color: #c0c4cc;
        }

        i {
          color: #c0c4cc;
          font-size: 16px;
        }
      }
    }
  }

  // 只读状态样式
  .readonly-display {
    min-height: 44px;
    display: flex;
    align-items: center;
    padding: 8px 0;

    .readonly-text {
      font-size: 14px;
      color: #303133;
      line-height: 1.4;
    }

    .readonly-empty {
      font-size: 14px;
      color: #c0c4cc;
      line-height: 1.4;
    }
  }
}

// 移动端弹窗内容样式
.search-container {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;

  .cube-input {
    border: 1px solid #dcdfe6;
    border-radius: 20px;
    overflow: hidden;

    .cube-input-field {
      padding: 10px 15px;
      font-size: 14px;
    }
  }
}

.supplier-list-container {
  height: calc(100vh - 220px); // 增加高度以避免与底部按钮重叠
  overflow: hidden;
  position: relative;

  .empty-tip {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-size: 14px;
  }

  .supplier-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 80px; // 确保足够的触摸目标
    position: relative;

    &:active {
      background-color: #f5f7fa;
      transform: scale(0.98);
    }

    &:last-child {
      border-bottom: none;
      margin-bottom: 10px; // 为loading indicator留出空间
    }

    &.selected {
      background-color: #e6f7ff;
      border-left: 3px solid #409eff;

      .supplier-info {
        .supplier-name {
          color: #409eff;
          font-weight: 600;
        }
      }
    }

    .supplier-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .supplier-name {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        line-height: 1.4;
      }

      .supplier-code,
      .supplier-company,
      .supplier-department {
        font-size: 12px;
        color: #909399;
        line-height: 1.3;
      }
    }

    .selection-indicator {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;

      i {
        font-size: 18px;
        color: #409eff;
      }
    }
  }
}

// 加载状态样式
.cube-loading {
  padding: 20px;
  text-align: center;

  span {
    margin-top: 10px;
    font-size: 14px;
    color: #999;
  }
}

// 加载更多指示器样式
.load-more-indicator {
  padding: 15px 20px;
  text-align: center;
  background-color: #f8f9fa;
  border-top: 1px solid #f0f0f0;
  animation: fadeInUp 0.3s ease-out;

  .cube-loading {
    padding: 10px;

    span {
      margin-top: 5px;
      font-size: 13px;
      color: #666;
    }
  }
}

// 加载动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
