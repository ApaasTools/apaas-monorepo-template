<!--
 * @Description: 移动端下拉搜索选择组件
 * @Date: 2024-06-10 16:22:46
 * @FilePath: src/custom/common/components/mobile-selection-data-mobile/index.vue
-->
<template>
  <div
    class="tw-relative tw-w-full tw-border tw-border-solid tw-border-gray-300 tw-rounded-md"
    :class="disabled ? 'tw-bg-gray-100 tw-bg-opacity-50' : ''"
  >
    <!-- 搜索输入框 -->
    <cube-input
      v-model="searchText"
      :placeholder="placeholder"
      class="tw-w-full tw-pr-3 tw-h-10 !tw-bg-transparent"
      :disabled="disabled"
      :clearable="clearable"
      @input="handleSearch"
      @focus="showDropdown"
    >
      <i slot="append" class="cubeic-search tw-text-gray-400"></i>
    </cube-input>

    <!-- 下拉搜索结果 -->
    <div
      v-show="dropdownVisible"
      class="tw-absolute tw-left-0 tw-right-0 tw-top-full tw-mt-1 tw-bg-white tw-shadow-lg tw-rounded-md tw-max-h-48 tw-overflow-y-auto tw-z-50 tw-border tw-border-gray-200"
      ref="dropdownList"
      @scroll="handleScroll"
    >
      <!-- 加载状态 -->
      <div v-if="loading && !hasMore" class="tw-p-3 tw-flex tw-justify-center tw-items-center">
        <cube-loading></cube-loading>
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="options.length === 0" class="tw-p-3 tw-text-center tw-text-gray-500">
        暂无匹配数据
      </div>

      <!-- 数据列表 -->
      <template v-else>
        <div
          v-for="(item, idx) in options"
          :key="idx"
          class="tw-p-3 tw-border-b tw-border-gray-100 last:tw-border-none tw-cursor-pointer hover:tw-bg-blue-50"
          @click="selectItem(item)"
        >
          {{ item?.[labelKey] }}
        </div>

        <!-- 底部加载更多状态 -->
        <div v-if="loading && hasMore" class="tw-p-2 tw-flex tw-justify-center tw-items-center">
          <cube-loading size="24px"></cube-loading>
          <span class="tw-ml-2 tw-text-sm tw-text-gray-500">加载更多...</span>
        </div>

        <!-- 全部加载完毕状态 -->
        <div
          v-if="
            !loading && !hasMore && options.length > 0 && pagination.total > pagination.pageSize
          "
          class="tw-p-2 tw-text-center tw-text-sm tw-text-gray-500"
        >
          已加载全部数据
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { trackRequestError } from '@/custom/common/utils/track'
import { Input, Loading } from 'cube-ui/lib'

export default {
  name: 'EngineSelectionData',
  components: {
    CubeInput: Input,
    CubeLoading: Loading
  },
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    // 组件值
    value: {
      type: [String, Object, Array],
      default: null
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 多选模式
    // multiple: {
    //   type: Boolean,
    //   default: false
    // },
    // 占位文本
    placeholder: {
      type: String,
      default: '请选择或搜索'
    },
    // 显示文本的字段名
    labelKey: {
      type: String,
      default: 'name'
    },
    // 字段名
    prop: {
      type: String,
      default: ''
    },
    // 表单id
    formId: {
      type: String,
      default: ''
    },
    // 表单id
    tabId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchText: '', // 搜索文本
      dropdownVisible: false, // 下拉框是否可见
      options: [], // 选项列表
      loading: false, // 加载状态
      selectedItem: null, // 当前选中项
      searchTimer: null, // 搜索防抖定时器
      pagination: {
        page: 1,
        pageSize: 15,
        total: 0
      },
      hasMore: true, // 是否有更多数据
      scrollThreshold: 20 // 距离底部多少像素时触发加载
    }
  },
  mounted() {
    // 添加点击事件监听，用于关闭下拉框
    document.addEventListener('click', this.handleClickOutside)

    // 初始化searchText
    this.updateSearchTextFromValue()
  },
  beforeDestroy() {
    // 移除事件监听
    document.removeEventListener('click', this.handleClickOutside)
  },
  watch: {
    // 监听value变化，同步更新searchText
    value: {
      handler(newVal) {
        this.updateSearchTextFromValue()
      },
      immediate: true
    }
  },
  methods: {
    // 从value更新searchText
    updateSearchTextFromValue() {
      if (this.value) {
        if (Array.isArray(this.value) && this.value.length > 0) {
          const name = this.value[0].name
          this.selectedItem = {
            id: this.value[0].id,
            name,
            stationName: name,
            officeName: name,
            [this.labelKey]: name
          }
          // console.info('this.selectedItem',this.value, this.selectedItem)
          this.searchText = name || ''
        }
      } else {
        // 没有值时清空
        this.searchText = ''
        this.selectedItem = null
      }
    },

    // 显示下拉框
    showDropdown() {
      this.dropdownVisible = true
      // 如果有搜索文本，立即执行搜索
      if (this.searchText) {
        this.resetAndSearch()
      }
    },

    // 处理搜索
    handleSearch() {
      // 防抖处理
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      this.searchTimer = setTimeout(() => {
        if (!this.searchText) {
          this.options = []
          return
        }
        this.resetAndSearch()
      }, 300)
    },

    // 重置分页并搜索
    resetAndSearch() {
      this.pagination.page = 1
      this.options = []
      this.hasMore = true
      this.loading = true
      this.fetchData()
    },

    // 获取数据
    async fetchData() {
      if (!this.hasMore || !this.searchText) return

      const requestConfig = {
        url: `/custom/business/listPageBusinessData`,
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          tabId: this.tabId,
          formId: this.formId,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          selectorFilterConditionList: [],
          filterConditionGroup: [],
          orders: []
        }
      }
      requestConfig.params.selectorFilterConditionList = [
        {
          uuid: this.labelKey,
          componentType: 'FORM_TEXT_INPUT',
          conditionOption: 'CONTAIN',
          filterInputs: [
            {
              filterParams: [
                {
                  filterType: 'COMMON',
                  filterComponentUuid: '',
                  filterComponentType: '',
                  filterValue: this.searchText,
                  filterValueType: '',
                  filterDisplayValue: {},
                  searchBoxContentType: 'SINGLE_QUERY',
                  queryValueList: []
                }
              ],
              order: 0
            }
          ],
          connector: 'AND'
        }
      ]
      const [res, err] = await trackRequestError(this.$request(requestConfig, false))
      if (err) {
        this.loading = false
        if (this.pagination.page === 1) {
          this.options = []
        }
        return
      }

      //   console.info('fetchData', res)
      this.loading = false

      // 更新分页信息
      this.pagination.total = res.total || 0

      // 添加新数据
      const newData = res.table || []
      if (this.pagination.page === 1) {
        this.options = newData
      } else {
        this.options = [...this.options, ...newData]
      }

      // 判断是否有更多数据
      this.hasMore = newData.length > 0 && this.options.length < this.pagination.total
    },

    // 加载更多数据
    loadMore() {
      if (this.loading || !this.hasMore) return

      this.pagination.page += 1
      this.loading = true
      this.fetchData()
    },

    // 处理滚动事件
    handleScroll(e) {
      if (!this.$refs.dropdownList) return

      const { scrollTop, scrollHeight, clientHeight } = this.$refs.dropdownList
      // 当滚动到距离底部一定距离时，触发加载更多
      if (scrollHeight - scrollTop - clientHeight <= this.scrollThreshold) {
        this.loadMore()
      }
    },

    // 选择项目
    selectItem(item) {
      this.selectedItem = item
      this.searchText = item[this.labelKey] || ''

      // 根据multiple属性决定如何格式化返回值
      // const formattedValue = item
      // if (this.multiple) {
      //   formattedValue = [item]
      // } else {
      //   formattedValue = item
      // }

      // 更新model值
      this.$emit('update', item)

      // 触发change事件
      this.$emit('change', item, this.prop)

      // 关闭下拉框
      this.dropdownVisible = false
    },

    // 处理外部点击
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.dropdownVisible = false
      }
    }
  }
}
</script>
