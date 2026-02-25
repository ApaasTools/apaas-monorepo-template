<!--
 * @Description: 服务文件选择组件(移动端适配版)
 * @Author: HongYu
 * @Date: 2025-06-05
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmApaasProject\custom-component\form-component\form-widget\edit\form-service-file-selection.vue
 * 【移动端适配说明】：
 *  1. 使用cube-ui组件替换Element UI组件，优化移动端交互体验
 *  2. 增加下拉刷新和上拉加载更多功能
 *  3. 优化标签展示和选择交互，增大点击区域
 *  4. 添加弹窗全屏展示，最大化利用移动端空间
 *  5. 添加手势操作支持，提升用户体验
 *  6. 优化移动端1px边框显示
 * 【展示测试】：
 *  1、一个类似输入框的区域，点击后弹出文件选择弹窗
 *  2、弹窗是否有数据，有则显示，没有则显示暂无数据
 *  3、搜索表单，测试搜索条件"11",应该无数据
 *  4、点击确认后，将选择的数据赋值给formValue，并显示在输入框中
 *  5、点击取消后，关闭弹窗
 *  6、全选按钮，测试全选，应该将所有数据都勾选
 -->
<template>
  <div class="widget-item">
    <!-- 输入框显示区域 -->
    <x-proxy-form-item
      class="widget-item"
      :isInTable="widget.isInTable"
      :showRequired="showRequired"
      :label="widget.label"
      :validatorRules="validatorRules"
      :validateKey="validateKey"
      :validateInfo="validateInfo"
      :webFormSettings="webFormSettings"
    >
      <div class="input-container" @click="openDialog">
        <div class="render-data-container">
          <!-- 简洁模式：只显示数量和第一个选中项 -->
          <div v-if="formValue && formValue.length > 0" class="compact-display">
            <span class="selected-count">已选择 {{ formValue.length }} 项</span>
            <span class="first-item-name">{{ formValue[0]?.stationName }}</span>
            <span v-if="formValue.length > 1" class="more-indicator" @click.stop="showAllSelected"
              >查看全部 ({{ formValue.length }})</span
            >
          </div>
          <!-- 无选择时的提示 -->
          <div v-else class="empty-tip">
            请选择服务站
          </div>
        </div>
        <!-- 搜索图标 -->
        <i
          class="input-icon"
          :class="
            formValue && formValue.length > 0 && !isReadonly ? 'cubeic-close' : 'cubeic-search'
          "
          @click.stop="isReadonly ? null : clearAll($event)"
        ></i>
      </div>
    </x-proxy-form-item>

    <!-- 全部已选项弹窗 -->
    <cube-popup
      v-model="showAllPopup"
      position="center"
      :mask-closable="true"
      class="all-selected-popup"
      :zIndex="100"
    >
      <div class="popup-header">
        <div class="back-icon" @click="showAllPopup = false"><i class="cubeic-back"></i></div>
        <div class="popup-title">已选择服务站范围 ({{ (formValue && formValue.length) || 0 }})</div>
      </div>
      <div class="preview-scroll">
        <div v-if="!formValue || formValue.length === 0" class="no-selected-items">
          <i class="cubeic-warn"></i>
          <span>暂无选择项</span>
        </div>
        <div class="preview-item" v-for="(item, index) in formValue || []" :key="index">
          <div class="item-content">
            <div class="item-name">{{ item?.stationName }}</div>
            <div class="item-code" v-if="item.stationNumber">{{ item.stationNumber }}</div>
          </div>
          <div v-if="!isReadonly" class="item-remove" @click="removeTag(index)">
            <i class="cubeic-close"></i>
          </div>
        </div>
      </div>
      <div class="popup-footer">
        <cube-button
          :outline="true"
          v-if="!isReadonly && formValue && formValue.length > 0"
          @click="clearAll"
          >清空全部</cube-button
        >
        <cube-button :primary="true" @click="showAllPopup = false">确定</cube-button>
      </div>
    </cube-popup>

    <!-- 服务站选择弹窗 -->
    <cube-popup
      v-model="visible"
      position="bottom"
      :mask-closable="false"
      class="service-select-popup"
    >
      <div class="popup-header">
        <div class="popup-title">选择服务站</div>
        <i class="cubeic-close" @click="cancelSelection"></i>
      </div>

      <!-- 搜索表单 -->
      <div class="search-form">
        <cube-input v-model="formDataCustom.keyword" placeholder="请输入关键字" clearable>
          <i slot="append" class="cubeic-search" @click="refreshData"></i>
        </cube-input>
        <div class="action-buttons">
          <cube-button :primary="true" :inline="true" @click="refreshData">查询</cube-button>
          <cube-button :primary="true" :inline="true" @click="allClick"
            >全选({{ pagination.total }})</cube-button
          >
        </div>
      </div>

      <!-- 数据列表 -->
      <div class="data-scroll" ref="dataScroll" @scroll="handleScroll">
        <div class="data-list">
          <div v-if="tableLoading && pagination.currentPage === 1" class="loading-container">
            <cube-loading></cube-loading>
          </div>
          <div v-else-if="tableData.length === 0" class="no-data">
            暂无数据
          </div>
          <template v-else>
            <div
              v-for="(item, index) in tableData"
              :key="index"
              class="data-item"
              :class="{ selected: item.selected }"
              @click="toggleSelection(item)"
            >
              <div class="item-info">
                <div class="item-name">{{ item.stationName }}</div>
                <div class="item-code">{{ item.stationNumber }}</div>
              </div>
              <div class="checkbox">
                <i :class="item.selected ? 'cubeic-right' : ''"></i>
              </div>
            </div>
          </template>

          <!-- 上拉加载更多 -->
          <div class="pull-up-container" v-if="tableData.length > 0">
            <div v-if="loading" class="loading-more">
              <cube-loading :size="18"></cube-loading>
              <span>加载中...</span>
            </div>
            <div v-else-if="!hasMore" class="no-more">
              <span>没有更多数据了</span>
            </div>
            <div v-else class="pull-up-tip">
              <span>上拉加载更多</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="popup-footer">
        <div class="selected-count" v-if="selectedData.filter((item) => item.selected).length > 0">
          已选择 {{ selectedData.filter((item) => item.selected).length }} 项
        </div>
        <!-- 已选择的项目列表 -->
        <div class="selected-list" v-if="selectedData.filter((item) => item.selected).length > 0">
          <div
            class="selected-item"
            v-for="(item, index) in selectedData.filter((item) => item.selected)"
            :key="index"
          >
            <div class="item-name">{{ item.stationName }}</div>
            <i class="cubeic-close item-remove" @click.stop="toggleSelection(item)"></i>
          </div>
        </div>
        <div class="footer-btns">
          <cube-button :outline="true" :light="true" @click="cancelSelection">取消</cube-button>
          <cube-button
            :primary="true"
            :disabled="selectedData.filter((item) => item.selected).length === 0"
            @click="confirmSelection"
            >确定</cube-button
          >
        </div>
      </div>
    </cube-popup>
  </div>
</template>

<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
import { trackRequestError } from '@/custom/common/utils/track'
import { uniqBy } from 'lodash-es'
import { Popup, Input, Button, Loading, Toast, Dialog } from 'cube-ui/lib'

const map = {
  type: { key: '', description: '服务站范围类型' },
  companySource: { key: '', description: '适用公司' },
  officeIds: { key: '', description: '、驻外区域范围' },
  stationDp: { key: '', description: '服务站范围（隐藏赋值）' }
}

export default {
  name: 'FormCustomServiceFileSelection_Mobile',
  components: {
    CubePopup: Popup,
    CubeInput: Input,
    CubeButton: Button,
    CubeLoading: Loading
  },
  mixins: [FormWidgetConfigMixin],
  props: {},
  data() {
    return {
      visible: false,
      showAllPopup: false, // 控制全部已选项弹窗
      maxDisplayCount: 3, // 最多显示的标签数量
      formDataCustom: {
        keyword: ''
      },
      selectedData: [],
      formConfigs: Object.freeze([
        {
          label: '关键字',
          prop: 'keyword'
        }
      ]),
      colConfigs: Object.freeze([
        {
          prop: 'stationName',
          label: '服务名称'
        },
        {
          prop: 'stationNumber',
          label: '服务编码'
        }
      ]),
      tableData: [],
      tableLoading: false,
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      allFlag: false, // 是否全选
      allSelected: false, // 全选中
      hasMore: true, // 是否还有更多数据
      refreshing: false, // 是否正在刷新
      loading: false // 是否正在加载更多
    }
  },
  computed: {
    // 接口域名
    domain() {
      return (
        window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN ??
        'https://crm-fw.yuchaiqas.com/crm-standard-service/'
      )
    },
    // 参数，由配置页面配置的文本解析为json对象
    widgetConfig() {
      let description = this.widget.titleDescription ?? this.widget?.titleDescriptionOptions?.value
      if (Array.isArray(this.widget?.titleDescriptionOptions)) {
        description = this.widget?.titleDescriptionOptions?.[0].value
      }
      try {
        if (description) {
          const text = description
            .replace(/\s+/g, '')
            .replace(/<\/?br\s*\/?>/g, '')
            .replace(/;/g, ',')
            .toString()
          return JSON.parse(text)
        }
        return map
      } catch {
        console.error('description 解析失败', description)
        return map
      }
    },
    // 是否只读
    isReadonly() {
      return this.renderScene === 'read'
    },
    // 服务站范围（隐藏赋值）
    stationDp() {
      return this.getHideUid(this.widgetConfig?.stationDp?.key) ?? ''
    }
  },
  watch: {
    // 监听formValue变化, 如果formValue为空，则不进行任何操作
    formValue: {
      immediate: true,
      handler(val) {
        // 确保formValue始终是数组
        if (!val || !Array.isArray(val)) {
          try {
            this.formValue = JSON.parse(val)
          } catch (e) {
            console.error('解析formValue失败', e)
            this.formValue = val
          }
          return
        }

        if (val.length === 0) return
        if (typeof val === 'string') {
          try {
            this.formValue = JSON.parse(val)
          } catch (e) {
            console.error('解析formValue失败', e)
            this.formValue = []
          }
        }
      }
    }
  },
  methods: {
    // 打开选择弹窗
    openDialog() {
      if (this.isReadonly) return

      // 确保formValue初始化为数组
      if (!this.formValue || !Array.isArray(this.formValue)) {
        this.formValue = []
      }

      // 初始化数据
      this.formDataCustom = {}
      this.searchKeyword = ''
      this.pagination = {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
      this.allFlag = false

      // 加载数据
      this.getTableData()

      // 直接设置visible为true显示弹窗
      this.visible = true
    },

    // 显示所有已选项
    showAllSelected() {
      if (this.formValue && this.formValue.length > 0) {
        this.showAllPopup = true
      }
    },

    // 删除标签
    removeTag(index) {
      // 确保formValue是数组
      if (!this.formValue || !Array.isArray(this.formValue)) {
        this.formValue = []
        return
      }

      // eslint-disable-next-line no-unused-expressions
      this.formValue?.splice(index, 1)
      // eslint-disable-next-line no-unused-expressions
      this.formData[this.stationDp]?.splice(index, 1)
    },

    // 刷新数据（表单搜索）
    refreshData() {
      this.pagination = {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
      // 刷新数据时重置allFlag为false
      this.allFlag = false
      this.getTableData()
    },

    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getTableData()
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getTableData()
    },

    // 选择数据变化
    handleSelectionChange(selection) {
      // 如果选择的数据中有一个未选中，则将allFlag设置为false
      if (selection.length !== this.pagination.pageSize) {
        this.allFlag = false
      }
      // 合并已经选择的数据
      this.selectedData = uniqBy([...selection, ...this.selectedData], 'id')
    },

    // 获取表格数据
    async getTableData(isAll = false) {
      // 如果不是全选模式，设置加载状态
      if (!isAll) {
        this.tableLoading = true
        // 仅当是刷新操作时清空数据
        if (this.pagination.currentPage === 1) {
          this.tableData = []
        }
      }

      // 确保formValue是数组
      if (!this.formValue || !Array.isArray(this.formValue)) {
        this.formValue = []
      }

      this.allSelected = isAll
      this.loading = true

      const type = this.formData[this.getHideUid(this.widgetConfig?.type?.key)]?.[0] ?? ''
      const companySource =
        this.formData[this.getHideUid(this.widgetConfig?.companySource?.key)]?.[0] ?? ''
      let officeIds = this.formData[this.getHideUid(this.widgetConfig?.officeIds?.key)] ?? []

      if (Array.isArray(officeIds)) {
        officeIds = officeIds.map((item) => item?.id)
      }

      const params = {
        url: `${this.domain}/common/queryStationForFileInfo`,
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage,
          ...this.formDataCustom,
          type,
          companySource,
          officeIds,
          allFlag: this.allFlag
        }
      }

      try {
        const [res, err] = await trackRequestError(this.$request(params, false))
        if (err) {
          this.tableLoading = false
          this.allSelected = false
          this.loading = false

          // 刷新完成或加载更多完成
          this.finishPullToRefresh()
          return
        }

        const newData =
          res?.table?.map((item) => ({
            ...item,
            selected: isAll || this.formValue?.some((item2) => item2?.id === item?.id) || false
          })) ?? []

        // 检查是否还有更多数据
        this.hasMore = newData.length === this.pagination.pageSize

        // 如果是第一页，直接替换tableData
        if (this.pagination.currentPage === 1) {
          this.tableData = newData
        } else {
          // 否则追加到现有数据
          this.tableData = [...this.tableData, ...newData]
        }

        // 更新选中数据
        this.selectedData = uniqBy(
          [...this.tableData.filter((item) => item.selected), ...this.selectedData],
          'id'
        )

        this.pagination.total = res?.total || 0
      } catch (error) {
        console.error('获取数据失败', error)
        this.$createToast({
          txt: '获取数据失败',
          type: 'error'
        }).show()
      } finally {
        this.tableLoading = false
        this.allSelected = false
        this.loading = false

        // 刷新完成或加载更多完成
        this.finishPullToRefresh()
      }
    },

    // 完成下拉刷新或上拉加载更多
    finishPullToRefresh() {
      // 因为已经移除了cube-scroll，所以不再需要这些代码
      this.refreshing = false
      this.loading = false
    },

    // 下拉刷新处理
    onPullingDown() {
      this.refreshing = true
      this.pagination.currentPage = 1
      this.getTableData()
    },

    // 处理滚动事件，检测是否需要加载更多数据
    handleScroll(e) {
      if (this.loading || !this.hasMore) return

      const scrollEl = this.$refs.dataScroll
      if (!scrollEl) return

      // 计算滚动距离底部的距离
      const scrollDistance = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight

      // 当距离底部小于50px时，触发加载更多
      if (scrollDistance < 50) {
        this.onPullingUp()
      }
    },

    // 上拉加载更多处理
    onPullingUp() {
      if (!this.hasMore || this.loading) return

      this.loading = true
      this.pagination.currentPage++
      this.getTableData()
    },

    // 取消选择
    cancelSelection() {
      // 初始化formValue确保它是数组
      if (!this.formValue || !Array.isArray(this.formValue)) {
        this.formValue = []

        // 隐藏弹窗
        this.visible = false
        return
      }

      // 如果有未保存的选择，询问用户是否确认放弃
      const currentSelected = this.selectedData
        .filter((i) => i.selected)
        .map((i) => i.id)
        .sort()
      const formValueIds = this.formValue.map((i) => i.id).sort()

      const hasUnsavedChanges = JSON.stringify(formValueIds) !== JSON.stringify(currentSelected)

      if (hasUnsavedChanges) {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: '您有未保存的更改，确定要放弃吗？',
          confirmBtn: {
            text: '确定',
            active: true,
            disabled: false
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false
          },
          onConfirm: () => {
            // 隐藏弹窗
            this.visible = false
          }
        }).show()
      } else {
        // 隐藏弹窗
        this.visible = false
      }
    },

    // 确认选择
    confirmSelection() {
      // 检查是否有选中数据
      const selectedItems = this.selectedData.filter((item) => item.selected)
      if (selectedItems.length === 0) {
        this.$createToast({
          txt: '请选择数据',
          type: 'warn',
          time: 2000
        }).show()
        return
      }

      // 初始化formValue
      if (!this.formValue || !Array.isArray(this.formValue)) {
        this.formValue = []
      }

      // 更新formValue，只保留选中的数据
      this.formValue = selectedItems.map((item) => ({
        id: item.id,
        stationName: item.stationName,
        selected: true
      }))

      // 同步更新隐藏字段
      this.formData[this.stationDp] = this.formValue.map((item) => ({
        id: item.id,
        name: item.stationName
      }))

      // 显示成功提示
      this.$createToast({
        txt: `已选择${this.formValue.length}个服务站`,
        type: 'success',
        time: 1500
      }).show()

      // 隐藏弹窗
      this.visible = false
    },

    // 全选
    async allClick() {
      if (this.allFlag) {
        this.$createToast({
          txt: '您已经已全选了，请先取消已选数据',
          type: 'warn',
          time: 2000
        }).show()
        return
      }

      // 显示加载中提示
      const toast = this.$createToast({
        txt: '正在加载所有数据...',
        mask: true,
        time: 0
      })
      toast.show()

      try {
        // 设置allFlag为true并重新请求数据
        this.allFlag = true
        await this.getTableData(true)

        // 标记所有数据为已选中
        this.tableData = this.tableData.map((item) => ({
          ...item,
          selected: true
        }))

        this.selectedData = [...this.tableData]

        toast.hide()
        this.$createToast({
          txt: `已全选${this.pagination.total}个服务站`,
          type: 'success',
          time: 1500
        }).show()
      } catch (error) {
        toast.hide()
        this.$createToast({
          txt: '全选操作失败',
          type: 'error',
          time: 2000
        }).show()
      }
    },

    // 切换选择状态
    toggleSelection(item) {
      item.selected = !item.selected
      if (item.selected) {
        this.selectedData.push(item)
      } else {
        this.selectedData = this.selectedData.filter((i) => i.id !== item.id)
      }
    },

    // 取消全选
    clearAll(event) {
      // 阻止事件冒泡，防止触发父容器的点击事件
      if (event && event.stopPropagation) {
        event.stopPropagation()
      }

      // 如果没有数据，不执行任何操作
      if (!this.formValue || !Array.isArray(this.formValue)) {
        this.formValue = []
        return
      }

      if (this.formValue.length === 0) return

      // 询问用户是否确认清空
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定要清空所有已选数据吗？',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false
        },
        onConfirm: () => {
          // 重置allFlag为false
          this.allFlag = false
          this.formValue = []
          this.selectedData = []
          this.formData[this.stationDp] = []

          // 更新表格数据的选中状态
          this.tableData = this.tableData.map((item) => ({ ...item, selected: false }))

          this.$createToast({
            txt: '已清空所有已选数据',
            type: 'success',
            time: 1500
          }).show()
        }
      }).show()
    }
  },
  mounted() {
    // 初始化
    if (!this.formValue || !Array.isArray(this.formValue)) {
      this.formValue = []
    }
  },

  beforeDestroy() {
    // 清理资源
    this.selectedData = []
    this.tableData = []
  },
  created() {
    // 创建Toast和Dialog实例的方法
    this.$createToast =
      this.$createToast ||
      function(options) {
        return Toast.$create(options)
      }

    this.$createDialog =
      this.$createDialog ||
      function(options) {
        return Dialog.$create(options)
      }
  }
}
</script>

<style scoped lang="scss">
.widget-item {
  width: 100%;
}

.input-container {
  width: 100%;
  display: flex;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
  cursor: text;
  border-radius: 4px;
  min-height: 48px; /* 增大点击区域 */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  &:active {
    border-color: #409eff;
  }
}

// 渲染数据容器样式 - 移动端优化
.render-data-container {
  width: 100%;
  min-height: 44px;
  padding: 8px 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  // 简洁模式显示样式
  .compact-display {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .selected-count {
      color: #666;
      font-size: 14px;
      margin-right: 8px;
      font-weight: 500;
    }

    .first-item-name {
      color: #333;
      font-size: 14px;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60%;
    }

    .more-indicator {
      color: #409eff;
      font-size: 13px;
      padding: 4px 10px;
      margin-left: auto;
      //   border-radius: 4px;
      //   background-color: #fff;
      //   border: 1px solid #409eff;
      //   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      font-weight: 500;
    }
  }

  // 无选择时的提示样式
  .empty-tip {
    color: #c0c4cc;
    font-size: 14px;
    line-height: 24px;
  }
}

.input-icon {
  height: 44px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 18px;
}

// 全部已选项弹窗样式
.all-selected-popup {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  ::v-deep .cube-popup-container.cube-popup-center .cube-popup-content {
    top: -50%;
    width: 100%;
  }

  .popup-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    position: relative;
    top: 0;

    .back-icon {
      position: absolute;
      left: 16px;
      color: #666;
      font-size: 18px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .popup-title {
      flex: 1;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      text-align: center;
    }
  }

  .preview-scroll {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0;
    height: calc(100vh - 130px); /* 减去头部和底部高度 */
    padding-bottom: 80px; /* 为底部按钮留出空间 */

    .no-selected-items {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 15px;
      padding: 40px 0;

      i {
        font-size: 50px;
        margin-bottom: 16px;
        color: #e0e0e0;
      }
    }
  }

  .preview-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
    background-color: #fff;
    margin: 0;

    &:active {
      background-color: #f9f9f9;
    }

    &:last-child {
      margin-bottom: 80px; /* 确保最后一项不被底部按钮遮挡 */
    }

    .item-content {
      flex: 1;
      padding-right: 10px;

      .item-name {
        font-size: 15px;
        color: #333;
        margin-bottom: 6px;
        word-break: break-all;
        font-weight: 500;
      }

      .item-code {
        font-size: 12px;
        color: #999;
        display: flex;
        align-items: center;

        &:before {
          content: '#';
          margin-right: 2px;
          color: #ccc;
        }
      }
    }

    .item-remove {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        color: #999;
        font-size: 14px;
      }

      &:active {
        background-color: #eee;
      }
    }
  }

  .popup-footer {
    padding: 16px;
    background-color: #fff;
    border-top: 1px solid #f5f5f5;
    display: flex;
    gap: 12px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;

    ::v-deep .cube-btn {
      border-radius: 8px;
      height: 44px;
      font-size: 15px;
      flex: 1;

      &.cube-btn-outline {
        border-color: #ddd;
        color: #666;
      }

      &.cube-btn-primary {
        background-color: #78c6f2;
        border-color: #78c6f2;
      }
    }
  }
}

// 服务站选择弹窗样式
.service-select-popup {
  height: 100%;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 99; /* 确保弹窗在暂存和提交按钮之上 */

  ::v-deep .cube-popup-content {
    height: 100%;
  }

  .popup-header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #fff;
    border-bottom: 1px solid #eee;

    .popup-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      flex: 1;
      text-align: center;
    }

    .cubeic-close {
      font-size: 18px;
      color: #999;
      padding: 8px;
    }
  }

  .search-form {
    flex-shrink: 0;
    padding: 12px 16px;
    // background-color: #fff;
    border-bottom: 1px solid #eee;

    ::v-deep .cube-input {
      margin-bottom: 12px;
      border: 1px solid #dcdfe6;
      padding: 0 12px;
      background-color: #fff;
      border-radius: 4px;

      // input {
      
      // }
    }

    .action-buttons {
      display: flex;
      justify-content: space-between;
      gap: 10px;

      ::v-deep .cube-btn {
        flex: 1;
        height: 36px;
        background-color: #78c6f2;
        border-color: #78c6f2;

        &:active {
          background-color: #64b8e8;
          border-color: #64b8e8;
        }
      }
    }
  }

  .data-scroll {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 220px; // 增加底部内边距，确保最后一个元素不被遮挡
    // height: calc(100vh - 130px); /* 减去头部和底部高度 */
    // background-color: #f5f5f5;
    // height: 50vh;
    // max-height: 50vh;
    max-height: 55vh; // 限制高度，确保可滚动
    touch-action: pan-y; // 允许垂直平移
    cursor: grab; // 添加可拖动的鼠标样式
    user-select: none; // 防止文本选择干扰滚动

    &:active {
      cursor: grabbing; // 拖动时的鼠标样式
    }
  }

  .data-list {
    padding: 0 16px;

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 30px 0;
    }

    .no-data {
      text-align: center;
      padding: 30px 0;
      color: #999;
      font-size: 14px;
    }

    .pull-up-container {
      padding: 15px 0;
      text-align: center;

      .loading-more,
      .no-more,
      .pull-up-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 13px;

        span {
          margin-left: 8px;
        }
      }
    }

    .data-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 10px;
      border-bottom: 1px solid #eee;
      // background-color: #f5f5f5;

      &.selected {
        .checkbox {
          border-color: #78c6f2;
          background-color: #fff;
        }
      }

      .item-info {
        flex: 1;
        padding-right: 12px;

        .item-name {
          font-size: 15px;
          color: #333;
          margin-bottom: 4px;
        }

        .item-code {
          font-size: 12px;
          color: #999;
        }
      }

      .checkbox {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;

        i {
          font-size: 14px;
          color: #78c6f2;
        }
      }
    }
  }

  .popup-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 16px;
    background-color: #fff;
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: column;
    z-index: 100; /* 确保在暂存和提交按钮之上 */

    .selected-count {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 500;
    }

    .selected-list {
      max-height: 100px;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      margin-bottom: 10px;
      background-color: #f9f9f9;
      border-radius: 4px;
      touch-action: pan-y; // 允许垂直平移
      cursor: grab; // 添加可拖动的鼠标样式
      user-select: none; // 防止文本选择干扰滚动

      &:active {
        cursor: grabbing; // 拖动时的鼠标样式
      }

      .selected-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        margin-bottom: 6px;
        background-color: #ecf5ff;
        border-radius: 4px;
        min-height: 36px; // 确保足够的触摸区域

        .item-name {
          font-size: 13px;
          color: #333;
        }

        .item-remove {
          color: #999;
          padding: 4px;
        }
      }
    }

    .footer-btns {
      display: flex;
      gap: 10px;
      width: 100%;

      ::v-deep .cube-btn {
        flex: 1;
        height: 40px;

        &:last-child {
          background-color: #78c6f2;
          border-color: #78c6f2;
        }
      }
    }
  }
}

// 增加移动端1px边框解决方案
.border-bottom-1px {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #f0f0f0;
    transform-origin: 0 100%;
  }
}

@media (min-resolution: 2dppx) {
  .border-bottom-1px::after {
    transform: scaleY(0.5);
  }
}

@media (min-resolution: 3dppx) {
  .border-bottom-1px::after {
    transform: scaleY(0.33);
  }
}

::v-deep .cube-popup-mask {
  background-color: #fff;
}
</style>
