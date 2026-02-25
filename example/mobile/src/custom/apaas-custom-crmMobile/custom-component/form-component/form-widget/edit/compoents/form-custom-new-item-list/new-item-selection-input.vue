<template>
  <div>
    <div
      class="date-picker tw-w-full tw-h-12 tw-flex tw-items-center tw-px-3 tw-leading-10 tw-overflow-hidden tw-border tw-border-solid tw-border-gray-300 tw-rounded-md"
      :class="{
        'tw-bg-gray-100': fieldConfig?.disabled,
        'tw-border-red-500': errors[fieldConfig.prop]
      }"
      @click="showPopup"
    >
      <div v-if="formValue" class="tw-flex-1 tw-truncate">{{ formValue }}</div>
      <div v-else class="tw-flex-1 tw-truncate tw-text-gray-400">
        {{ fieldConfig?.attrs?.placeholder }}
      </div>
      <i v-if="formValue" class="cubeic-wrong tw-text-lg" @click.stop="clearValue"></i>
      <i v-else class="cubeic-arrow tw-text-gray-400"></i>
    </div>

    <bottom-popup
      ref="bottomPopupRef"
      v-model="visible"
      :title="fieldConfig.label"
      :showFooter="true"
      content-class="tw-h-[60vh]"
      @confirm="confirm"
    >
      <template #content>
        <div class="tw-w-full">
          <!-- 搜索区域 -->
          <div
            class="tw-w-full tw-bg-white tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-2 tw-border-b tw-border-gray-100"
          >
            <cube-input
              class="tw-flex-1 tw-border tw-border-solid tw-border-gray-200 tw-rounded-md tw-px-2"
              v-model="keyword"
              :placeholder="`搜索${fieldConfig.label}`"
              clearable
            >
              <i slot="prepend" class="cubeic-search tw-text-gray-500"></i>
            </cube-input>
            <div
              class="tw-text-blue-500 tw-shrink-0 tw-ml-2 tw-text-sm tw-font-medium"
              @click="search"
            >
              搜索
            </div>
          </div>

          <!-- 表头 -->
          <div
            class="tw-flex tw-items-center tw-p-1.5 tw-px-3 tw-bg-gray-50 tw-border-b tw-border-gray-200 tw-sticky tw-top-0 tw-z-20"
          >
            <div class="tw-flex-1">
              <div class="tw-flex tw-items-center tw-justify-between">
                <div class="tw-text-xs tw-font-medium tw-text-gray-500"># 物料图号</div>
                <div class="tw-text-xs tw-font-medium tw-text-gray-500">公司</div>
              </div>
              <div class="tw-flex tw-justify-between tw-mt-0.5">
                <div class="tw-flex-1 tw-text-xs tw-font-medium tw-text-gray-500 tw-mr-1">
                  物料名称
                </div>
                <div class="tw-flex tw-items-center tw-justify-between tw-space-x-2">
                  <div
                    class="tw-text-xs tw-font-medium tw-text-gray-500 tw-text-center tw-shrink-0"
                  >
                    单位
                  </div>
                  <div class="tw-text-xs tw-font-medium tw-text-gray-500 tw-shrink-0"
                    >零件结构码</div
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 滚动区域 -->
          <cube-scroll
            ref="scroll"
            :data="tableData"
            :options="{
              pullDownRefresh: {
                threshold: 60,
                stop: 40,
                txt: '刷新成功'
              },
              pullUpLoad: {
                threshold: 0,
                txt: {
                  more: '加载更多',
                  noMore: '没有更多数据了'
                }
              },
              scrollbar: true
            }"
            class="tw-h-[calc(60vh-215px)]"
            @pulling-down="onPullingDown"
            @pulling-up="onPullingUp"
          >
            <div class="tw-w-full tw-h-full tw-bg-white">
              <!-- 列表项 -->
              <div v-for="(item, index) in tableData" :key="index" class="list-item">
                <div
                  class="tw-flex tw-items-center tw-w-full tw-py-1.5 tw-px-2 tw-border-b tw-border-gray-100 tw-rounded tw-shadow-sm tw-my-1 tw-mx-1 tw-cursor-pointer"
                  :class="{
                    'tw-bg-blue-100 tw-border-2 tw-border-solid tw-border-l-[#3b82f6]':
                      item.selected
                  }"
                  @click.stop="selectItem(item)"
                >
                  <div class="tw-relative tw-flex-1">
                    <div class="tw-flex tw-items-center tw-justify-between">
                      <!-- 物料图号 -->
                      <div
                        class="tw-text-sm tw-font-medium"
                        :class="item.selected ? 'tw-text-blue-700' : 'tw-text-gray-700'"
                      >
                        {{ item?.itemFigureNumber }}
                      </div>
                      <!-- 公司 -->
                      <div
                        class="tw-text-xs"
                        :class="item.selected ? 'tw-text-blue-600' : 'tw-text-gray-500'"
                      >
                        {{ formatCompany(item?.companyCode) }}
                      </div>
                    </div>
                    <div class="tw-flex tw-justify-between tw-mt-0.5 tw-text-xs">
                      <!-- 物料名称 -->
                      <div
                        class="tw-flex-1 tw-truncate tw-mr-1"
                        :class="item.selected ? 'tw-text-blue-600' : 'tw-text-gray-600'"
                      >
                        {{ item?.itemName }}
                      </div>
                      <div class="tw-flex tw-items-center tw-justify-between tw-space-x-2">
                        <!-- 单位 -->
                        <div
                          class="tw-text-center tw-shrink-0"
                          :class="item.selected ? 'tw-text-blue-500' : 'tw-text-gray-500'"
                        >
                          {{ item?.basicUnit?.[0] }}
                        </div>
                        <!-- 零件结构码 -->
                        <div
                          class="tw-truncate tw-shrink-0"
                          :class="item.selected ? 'tw-text-blue-500' : 'tw-text-gray-500'"
                        >
                          {{ item?.structureCode }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 无数据提示 -->
              <div
                v-if="tableData.length === 0 && !isLoading"
                class="tw-text-center tw-text-gray-600 tw-py-4"
              >
                暂无数据
              </div>

              <!-- 加载中提示 -->
              <div
                v-if="isLoading"
                class="tw-flex tw-items-center tw-justify-center tw-text-gray-600 tw-py-4 tw-mt-2"
              >
                <cube-loading size="20px"></cube-loading>
                <span class="tw-ml-2">加载中...</span>
              </div>
            </div>
          </cube-scroll>
        </div>
      </template>
    </bottom-popup>
  </div>
</template>

<script>
import { formMixin } from '@/custom/common/components/mobile-form/utils/form.mixin'

import BottomPopup from '@/custom/common/components/bottom-popup.vue'
import { Input, Button, Loading, Scroll } from 'cube-ui/lib'
import { trackRequestError } from '@/custom/common/utils/track'
import { debounce } from 'lodash-es'

export default {
  name: 'NewItemSelectionInput',
  mixins: [formMixin],
  props: {
    cacheData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    formData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dictionaryData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    mode: {
      type: String,
      default: 'add' // add, edit, view
    }
  },
  components: {
    BottomPopup,
    CubeInput: Input,
    CubeButton: Button,
    CubeLoading: Loading,
    CubeScroll: Scroll
  },
  data() {
    return {
      visible: false,
      keyword: '',
      selectedItem: {},
      pagination: {
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      hasMore: true,
      tableData: [],
      isLoading: false
    }
  },
  methods: {
    showPopup() {
      if (this.disabled) return
      this.visible = true
      this.resetSearch()
      this.getTableData().then(() => {
        // 确保如果已有选中项，在数据加载后重新标记为选中状态
        if (this.selectedItem) {
          this.tableData.forEach((item) => {
            item.selected = item.id === this.selectedItem.id
          })
        }
      })
    },
    clearValue() {
      this.$emit('clear', this.fieldConfig.prop)
    },

    // 搜索功能
    search: debounce(function() {
      this.resetSearch()
      this.getTableData()
    }, 300),

    // 重置搜索状态
    resetSearch() {
      this.keyword = ''
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        total: 0
      }
      this.hasMore = true
      this.tableData = []
    },

    // 通用数据获取
    getCommonData(tableRowNum) {
      // let tableRowNum
      if (this.mode === 'add') {
        this.cacheData['35154ccb93b5d021e658fec1'].push(this.formData)
      }

      return new Promise(async (resolve, reject) => {
        const requestConfig = {
          url: `/custom/business/newDataSelectorData`,
          method: 'POST',
          disableErrorMsg: true,
          disableSuccessMsg: true,
          params: {
            ...this.fieldConfig?.extra?.params,
            data: this.cacheData,
            keyWord: this.keyword,
            page: this.pagination.currentPage,
            pageSize: this.pagination.pageSize,
            componentId: this.fieldConfig.prop,
            tableDataSelectQueryInfo: {
              ...this.fieldConfig?.extra?.params?.tableDataSelectQueryInfo,
              tableRowNum: this.formData?._XID
            }
          }
        }

        const [res, err] = await trackRequestError(this.$request(requestConfig, false))
        if (err) return reject(err)

        const newData = res.data.pageRespHelper.table || []
        this.pagination.total = res.data.pageRespHelper.total

        // 添加已选状态标识
        if (this.selectedItem) {
          newData.forEach((item) => {
            // 使用ID进行比较，确保选中状态的稳定性
            item.selected = item.id === this.selectedItem.id
          })
        }

        // 判断是否还有更多数据
        this.hasMore = this.tableData.length + newData.length < this.pagination.total

        // 加载更多时追加数据，否则替换数据
        if (this.pagination.currentPage > 1) {
          this.tableData = [...this.tableData, ...newData]
        } else {
          this.tableData = newData
        }

        resolve(this.tableData)
      })
    },

    // 获取数据
    getTableData(isLoadMore = false) {
      // 如果正在加载则不执行
      if (this.isLoading) return Promise.resolve()

      this.isLoading = true

      let dataPromise = this.getCommonData()

      return dataPromise
        .then((data) => {
          this.isLoading = false
          return data
        })
        .catch((err) => {
          this.isLoading = false
          return Promise.reject(err)
        })
    },

    // 下拉刷新
    onPullingDown() {
      // 重置分页并加载第一页数据
      this.resetSearch()
      this.getTableData().then(() => {
        this.$refs.scroll.forceUpdate()
      })
    },

    // 上拉加载更多
    onPullingUp() {
      if (this.hasMore && !this.isLoading) {
        this.pagination.currentPage += 1
        this.getTableData(true).then(() => {
          this.$refs.scroll.forceUpdate()
        })
      } else {
        this.$refs.scroll.forceUpdate()
      }
    },

    // 选择项目
    selectItem(item) {
      if (item.selected) return

      // 清除之前的选择
      this.tableData = this.tableData.map((row) => {
        return {
          ...row,
          selected: row.id === item.id
        }
      })

      // 更新选中项
      this.selectedItem = { ...item }

      // 添加选中效果的反馈
      setTimeout(() => {
        this.$refs.scroll && this.$refs.scroll.refresh()
      }, 100)
    },

    // 确认选择
    confirm() {
      if (!this.selectedItem) {
        this.$createToast({
          txt: '请选择一项',
          type: 'warn'
        }).show()
        return
      }

      this.$emit('confirm', this.selectedItem)

      // let data = {}

      // if (this.mode === 'add') {
      //   data = {
      //     id: this.selectedItem.id,
      //     name: this.selectedItem?.itemName,
      //     unit: this.selectedItem?.basicUnit,
      //     structureCode: this.selectedItem?.structureCode,
      //     itemFigureNumber: this.selectedItem?.itemFigureNumber
      //   }
      // }

      // if (this.mode === 'edit') {
      //   data = {
      //     id: this.selectedItem.id,
      //     name: this.selectedItem?.itemName,
      //     // t
      //   }
      // }

      // this.$set(this.formData, this.fieldConfig.prop, [data])

      // if (this.compConfig?.extra?.confirmFormatter) {
      //   this.compConfig.extra.confirmFormatter(data)
      // }
      this.visible = false
    },

    formatCompany(cellValue) {
      // 先把值转换成String
      let itemVal = null
      if (cellValue && Array.isArray(cellValue) && cellValue.length > 0) {
        itemVal = cellValue[0]
      } else {
        itemVal = cellValue
      }
      // 根据String匹配数据字典，返回显示
      let showVal = null
      if (
        itemVal &&
        this.dictionaryData['CRM_COMMOM_COMPANY']?.some((s) => s.valueCode === itemVal)
      ) {
        showVal = this.dictionaryData['CRM_COMMOM_COMPANY']?.find((s) => s.valueCode === itemVal)
          .valueName
      }
      return showVal
    }
  }
}
</script>
