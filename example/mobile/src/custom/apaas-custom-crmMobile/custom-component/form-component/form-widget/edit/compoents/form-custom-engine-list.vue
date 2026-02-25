<!--
 * @Description: 发动机列表组件
 * @Author: junfa
 * @Date: 2023-08-11 09:39:19
 * @FilePath: src/custom/apaas-custom-crmMobile/custom-component/form-component/form-widget/edit/compoents/form-custom-engine-list.vue
 * @LastEditors: HongYu
 * @LastEditTime: 2025-03-27 15:36:58
-->
<template>
  <div class="form-widget custom-query-table">
    <div class="tw-flex tw-flex-col tw-w-full tw-p-2 tw-box-border">
      <!-- 头部区域 -->
      <div class="tw-bg-white tw-rounded-xl tw-p-3 tw-mb-3 tw-shadow-md">
        <div class="tw-flex tw-items-center tw-mb-2.5">
          <x-svg-icon :name="headIcon" class="tw-w-6 tw-h-6 tw-mr-2"></x-svg-icon>
          <span class="tw-text-base tw-font-semibold tw-text-gray-800">{{ title }}</span>
        </div>

        <!-- 搜索区域 -->
        <div class="tw-mb-3">
          <div
            class="tw-border tw-border-solid tw-border-gray-300 tw-rounded-md tw-px-3 tw-box-border"
          >
            <cube-input
              v-model="keywords"
              placeholder="输入关键词搜索"
              :clearable="true"
              class="tw-w-full"
            >
              <i class="cubeic-search tw-mr-1.5" slot="append" @click="refreshData"></i>
            </cube-input>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="tw-flex tw-flex-wrap tw-gap-2">
          <cube-button
            :primary="true"
            @click="refreshData"
            class="tw-flex-1 tw-min-w-[calc(50%-0.5rem)] tw-h-[38px] tw-rounded-full tw-text-sm tw-font-medium"
          >
            刷新
          </cube-button>

          <cube-button
            v-if="renderScene === 'edit' || operationPermission"
            @click="synchronizeData()"
            class="tw-flex-1 tw-min-w-[calc(50%-0.5rem)] tw-h-[38px] tw-rounded-full tw-text-sm tw-font-medium"
          >
            同步
          </cube-button>

          <cube-button
            v-if="renderScene === 'edit' || operationPermission"
            @click="openImport()"
            class="tw-flex-1 tw-min-w-[calc(50%-0.5rem)] tw-h-[38px] tw-rounded-full tw-text-sm tw-font-medium"
          >
            {{ generateTaskFlag === 'TRUE' ? '导入任务' : '导入发动机' }}
          </cube-button>

          <cube-button
            v-if="operationPermission"
            @click="exportData()"
            class="tw-flex-1 tw-min-w-[calc(50%-0.5rem)] tw-h-[38px] tw-rounded-full tw-text-sm tw-font-medium"
          >
            数据导出
          </cube-button>

          <cube-button
            v-if="renderScene === 'edit' || operationPermission"
            class="tw-flex-1 tw-min-w-[calc(50%-0.5rem)] tw-h-[38px] tw-rounded-full tw-text-sm tw-font-medium tw-bg-red-50 tw-text-red-500 tw-border-red-200"
            @click="showDeleteAllDialog()"
          >
            全部删除
          </cube-button>

          <cube-button
            v-if="renderScene === 'edit' || operationPermission"
            :primary="true"
            @click="openData('add')"
            class="tw-flex-1 tw-min-w-[calc(50%-0.5rem)] tw-h-[38px] tw-rounded-full tw-text-sm tw-font-medium"
          >
            新建
          </cube-button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="tableLoading" class="tw-flex tw-justify-center tw-items-center tw-py-8">
        <x-loading></x-loading>
      </div>

      <!-- 空数据状态 -->
      <div
        v-else-if="tableData.length === 0"
        class="tw-bg-white tw-rounded-xl tw-py-6 tw-px-4 tw-mb-3 tw-shadow-md tw-text-center"
      >
        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-4">
          <x-svg-icon name="x-lib-warning" width="48" height="48" fill="#dcdfe6"></x-svg-icon>
          <p class="tw-mt-2 tw-text-[15px] tw-text-gray-400 tw-font-medium">暂无数据</p>
        </div>
      </div>

      <!-- 卡片列表 -->
      <div v-else class="tw-space-y-3">
        <engine-list-item
          v-for="(item, index) in tableData"
          :key="index"
          :item="item"
          :editable="renderScene === 'edit'"
          :dictionaryData="dictionaryData"
          @show-detail="showEngineDetail"
          @delete-item="deleteItem"
          @edit-item="editItem"
        />
      </div>

      <!-- 分页 -->
      <div
        v-if="tableData.length > 0 && pagination.total > pagination.pageSize"
        class="tw-flex tw-justify-center tw-items-center tw-py-3 tw-px-2 tw-mb-4"
      >
        <cube-button
          :disabled="pagination.currentPage >= Math.ceil(pagination.total / pagination.pageSize)"
          :outline="true"
          class="tw-w-full tw-h-10 tw-rounded-full tw-text-[15px] tw-font-medium tw-bg-gray-100 tw-text-gray-600 tw-border-gray-300 disabled:tw-opacity-60 disabled:tw-text-gray-400"
          @click="loadMore"
        >
          加载更多
        </cube-button>
      </div>
    </div>

    <!-- 弹窗改为API调用方式 -->

    <!-- 统一的数据操作面板（编辑/新增/详情） -->
    <engine-edit-form
      v-model="formPanelVisible"
      :dataList="formDataList"
      :documentId="formData.documentId"
      :mode="formMode"
      :loading="detailLoading"
      :dictionaryData="dictionaryData"
      @close="handleFormClose"
      @add-item="addDataItem"
      @delete-selected="delAddData"
      @save="confirmAdd"
    />

    <!-- 移动端导入弹窗 -->
    <mobile-detail-popup
      v-model="importPopupVisible"
      title="导入发动机"
      @close="importPopupVisible = false"
    >
      <mobile-import-steps
        :loading="importLoading"
        :downloadDesc="generateTaskFlag === 'TRUE' ? '下载任务导入模板' : '下载发动机导入模板'"
        @download="downloadTemplate"
        @file-selected="handleFileSelected"
        @upload="uploadSelectedFile"
        @error="handleImportError"
        ref="importSteps"
      />
    </mobile-detail-popup>
  </div>
</template>

<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
import { getStr } from '@/util/apaas.js'
import {
  Popup,
  Loading,
  Button,
  Input,
  Dialog,
  Toast,
  Checkbox,
  Switch,
  Picker,
  Select
} from 'cube-ui/lib'

import EngineListItem from './form-custom-engine-list/engine-list-item.vue'
import EngineEditForm from './form-custom-engine-list/engine-edit-form.vue'
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup/index.vue'
import MobileImportSteps from '@/custom/common/components/mobile-import-steps/index.vue'

import {
  initNewDataItem,
  processFormData,
  formatData
} from './form-custom-engine-list/utils/data-utils'
import {
  formatPlantDp,
  formatStatus,
  extractArrayValue
} from './form-custom-engine-list/utils/formatters'
import * as api from './form-custom-engine-list/api'

export default {
  name: 'FORM_CUSTOM_ENGINE_LIST_Mobile',
  components: {
    CubePopup: Popup,
    CubeLoading: Loading,
    CubeButton: Button,
    CubeInput: Input,
    CubeDialog: Dialog,
    CubeCheckbox: Checkbox,
    CubeSwitch: Switch,
    CubePicker: Picker,
    CubeSelect: Select,
    EngineListItem,
    EngineEditForm,
    MobileDetailPopup,
    MobileImportSteps
  },
  mixins: [FormWidgetConfigMixin],
  props: {
    headIcon: {
      type: String,
      default: 'x-lib-table'
    },
    title: {
      type: String,
      default: '发动机列表'
    },
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      addcolConfigs: [
        {
          resizable: true,
          prop: 'engineNumber',
          label: '发动机编号',
          customSlot: 'elInput'
        },
        {
          resizable: true,
          prop: 'factoryNumber',
          label: '发动机出厂编号',
          customSlot: 'elInput'
        }
      ],
      colConfigs: [
        {
          resizable: true,
          prop: 'engineNumber',
          label: '发动机编号'
        },
        {
          resizable: true,
          prop: 'factoryNumber',
          label: '发动机出厂编号'
        }
      ],
      tableColConfigs: [],
      addTableColConfigs: [],
      options: [],
      keywords: null,
      tableData: [],
      tableLoading: false,
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectData: [],
      selectDataID: [],
      loading: false,
      networkError: false,
      selectLoading: false,
      // 统一的弹出面板数据
      formMode: 'add', // 面板模式：add/edit/view
      formPanelVisible: false, // 统一面板是否可见
      formDataList: [], // 面板数据列表
      dictionaryData: {},
      roleCode: [
        'CRM_GS_SJGLY',
        'CRM_GS_ZLJDCG',
        'CRM_GS_ZLJDJG',
        'CRM_GS_ZLJDZGKZ',
        'crm_00013',
        'crm_00015',
        'crm_00017',
        'crm_00018',
        'crm_00021',
        'crm_00015',
        'crm_00007',
        'crm_00001',
        'crm_00043',
        'crm_00030'
      ],
      currentRole: [],
      deleteDialogVisible: false,
      deleteAllDialogVisible: false,
      currentDeleteItem: null,
      detailLoading: false,
      importPopupVisible: false,
      selectedFile: null,
      importLoading: false
    }
  },
  computed: {
    generateTaskFlag() {
      return this.getformData('fil_engine_control_range.generate_task_flag')
    },
    operationPermission() {
      let isPermission = this.roleCode.some((i) => this.currentRole.includes(i))
      return isPermission
    },
    url() {
      return window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN
    }
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        if (
          this.getformData('fil_engine_control_range.generate_task_flag') &&
          this.getformData('fil_engine_control_range.generate_task_flag').includes('TRUE')
        ) {
          this.tableColConfigs = this.colConfigs
          this.addTableColConfigs = this.addcolConfigs
        } else {
          this.tableColConfigs = this.colConfigs.filter((i) => i.prop === 'engineNumber')
          this.addTableColConfigs = this.addcolConfigs.filter((i) => i.prop === 'engineNumber')
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    window.FormCustomEngineList = this
    await this.getDictionaryCode()
    await this.getUserInfo()
    this.refreshData(false)

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

    this.$createPicker =
      this.$createPicker ||
      function(options) {
        return Picker.$create(options)
      }
  },
  mounted() {
    // 确保数据加载，避免首次加载失败的情况
    if (this.tableData.length === 0) {
      this.getTableData()
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await api.getUserInfo(this)
        this.currentRole = (res.data && res.data.roleCode) || []
        return res
      } catch (error) {
        console.error('获取用户信息失败', error)
      }
    },

    // 刷新数据
    refreshData(isRefresh = true) {
      this.pagination = {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
      // 清空现有数据
      this.tableData = []
      this.getTableData()

      // 显示加载提示
      isRefresh &&
        this.$createToast({
          txt: '数据刷新中',
          type: 'loading',
          time: 1000
        }).show()
    },

    // 分页处理
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getTableData()
    },

    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getTableData()
    },

    // 获取表格数据
    async getTableData() {
      this.tableLoading = true

      try {
        const res = await api.getEngineListData(this, {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          documentId: this.formData.documentId,
          formId: '6577b5977d3a620dc8c4a15f',
          keywords: this.keywords
        })

        this.pagination.total = res.total
        this.tableLoading = false

        if (this.formPanelVisible && this.formMode !== 'view') {
          // 如果面板处于编辑或新增模式，更新表单数据
          this.formDataList = res.table
        } else {
          if (this.getHideUid('quantity_rectified')) {
            this.formData[this.getHideUid('quantity_rectified')] = res.total
          }
          // 如果是首页，直接替换数据；如果是其他页，则追加数据
          const formattedData = formatData(res.table)
          if (this.pagination.currentPage === 1) {
            this.tableData = formattedData
          } else {
            this.tableData = [...this.tableData, ...formattedData]
          }
        }
      } catch (error) {
        console.error('获取表格数据失败', error)
        this.tableLoading = false
      }
    },

    // 选择数据变化
    selectDataChange(arr) {
      this.selectData = arr
      this.selectDataID = this.selectData.map((i) => i.documentId) || []
    },

    // 打开编辑表单
    openData(type) {
      this.formPanelVisible = true
      this.formMode = type

      if (type === 'add') {
        // 新建模式，创建一个空数据项
        const newItem = initNewDataItem(this.formData.documentId)
        this.formDataList = [newItem]
      }
    },

    // 选择数据变化
    selectionDataChange(e, row, column) {
      if (column.prop === 'responsibilityStationDp') {
        this.$set(row, 'stationNumber', e.stationNumber)
      }
      if (column.prop === 'responsibleOfficeDp') {
        this.$set(row, 'officeCode', e.officeCode)
      }
    },

    // 添加数据项
    addDataItem(newItem) {
      // 在新的实现中，我们只处理单个数据项
      this.formDataList = [newItem]
    },

    // 删除选中的数据项
    delAddData() {
      this.formDataList = this.formDataList.filter((i) => !i.selected)
    },

    // 确认添加/编辑数据
    async confirmAdd() {
      try {
        // 处理数据，确保符合API要求的格式
        const processedData = processFormData(
          this.formDataList,
          this.formData.documentId,
          this.formMode
        )
        console.info('processedData', processedData)
        await api.batchSaveEngineList(this, processedData)
        this.formDataList = []
        this.formPanelVisible = false
        this.refreshData()

        this.$createToast({
          txt: '保存成功',
          type: 'correct',
          time: 2000
        }).show()
      } catch (error) {
        console.error('保存数据失败', error)
        this.$createToast({
          txt: '保存失败',
          type: 'error',
          time: 2000
        }).show()
      }
    },

    // 显示全部删除确认对话框
    showDeleteAllDialog() {
      this.$createDialog({
        type: 'confirm',
        title: '确认删除',
        content: '是否确认删除全部数据？此操作不可恢复！',
        confirmBtn: {
          text: '确定',
          active: true
        },
        cancelBtn: {
          text: '取消'
        },
        onConfirm: () => {
          this.executeDelete()
        }
      }).show()
    },

    // 执行删除操作
    async executeDelete(ids) {
      try {
        // 如果传入了ID数组，使用传入的，否则使用选中的ID
        const deleteIds = ids || this.selectDataID
        await api.deleteEngineList(this, this.formData.documentId, deleteIds)

        // 显示成功信息
        this.$createToast({
          txt: '删除成功',
          type: 'correct',
          time: 2000
        }).show()

        this.refreshData()
      } catch (error) {
        console.error('删除数据失败', error)
        this.$createToast({
          txt: '删除失败',
          type: 'error',
          time: 2000
        }).show()
      }
    },

    // 删除单个项目
    deleteItem(item) {
      this.currentDeleteItem = item
      this.$createDialog({
        type: 'confirm',
        title: '确认删除',
        content: '是否确认删除此条数据？',
        confirmBtn: {
          text: '确定',
          active: true
        },
        cancelBtn: {
          text: '取消'
        },
        onConfirm: () => {
          this.executeDelete([this.currentDeleteItem.documentId])
        }
      }).show()
    },

    // 打开导入弹窗
    openImport() {
      this.importPopupVisible = true
    },

    // 下载模板
    async downloadTemplate() {
      this.importLoading = true
      try {
        await api.downloadTemplate(this, this.generateTaskFlag)
        this.importLoading = false
      } catch (error) {
        console.error('下载模板失败', error)
        this.importLoading = false
      }
    },

    // 处理文件选择
    handleFileSelected(file) {
      this.selectedFile = file
    },

    // 处理导入错误
    handleImportError(message) {
      this.$createToast({
        txt: message,
        type: 'warn',
        time: 2000
      }).show()
    },

    // 上传选择的文件
    async uploadSelectedFile(file) {
      if (!file) {
        this.handleImportError('请先选择文件')
        return
      }

      this.importLoading = true

      try {
        const result = await api.uploadFile(this, {
          file: file,
          documentId: this.formData.documentId,
          fileDocNumber: this.getformData('fil_service_file_info.service_file_num'),
          taskFlag: this.getformData('fil_engine_control_range.generate_task_flag')
        })

        this.importLoading = false
        this.$createToast({
          txt: result.message || '上传成功',
          type: 'correct',
          time: 2000
        }).show()

        this.refreshData()
        this.importPopupVisible = false

        // 清空选择的文件
        if (this.$refs.importSteps) {
          this.$refs.importSteps.clearFile()
        }
      } catch (error) {
        this.importLoading = false
        this.$createToast({
          txt: '上传失败：' + (error.message || '未知错误'),
          type: 'error',
          time: 3000
        }).show()
      }
    },

    // 同步数据
    async synchronizeData() {
      try {
        await api.syncEngineList(this, this.formData.documentId, this.selectData)
        this.refreshData()

        this.$createToast({
          txt: '同步成功',
          type: 'correct',
          time: 2000
        }).show()
      } catch (error) {
        console.error('同步数据失败', error)
        this.$createToast({
          txt: '同步失败',
          type: 'error',
          time: 2000
        }).show()
      }
    },

    // 导出数据
    async exportData() {
      this.tableLoading = true

      // 创建导出提示
      const toast = this.$createToast({
        txt: '正在准备导出数据，请稍候...',
        type: 'loading',
        time: 0
      })
      toast.show()

      try {
        await api.exportEngineList(this, '6577b5977d3a620dc8c4a15f', this.formData.documentId)
        toast?.hide()
        this.$createToast({
          txt: '导出成功！',
          type: 'correct',
          time: 2000
        }).show()
      } catch (error) {
        console.error('导出数据失败', error)
        toast?.hide()
        this.$createToast({
          txt: '导出失败',
          type: 'error',
          time: 2000
        }).show()
      } finally {
        this.tableLoading = false
      }
    },

    // 显示发动机详情
    showEngineDetail(item) {
      this.detailLoading = true
      this.formMode = 'view'
      // 格式化详情数据
      this.formDataList = [formatData(item)]
      this.formPanelVisible = true
      this.detailLoading = false
    },

    // 编辑单个项目
    editItem(item) {
      this.formPanelVisible = true
      this.formMode = 'edit'
      // 将数据添加到编辑表中
      this.formDataList = [item]
    },

    // 处理表单关闭
    handleFormClose() {
      this.formPanelVisible = false
      this.refreshData()
    },

    // 加载更多数据
    loadMore() {
      this.pagination.currentPage += 1
      this.getTableData()
    },

    // 获取字典数据
    async getDictionaryCode() {
      const dictionaryCodeList = this.addcolConfigs.reduce((pre, cur) => {
        if (cur.dictionaryCode && !pre.includes(cur.dictionaryCode)) {
          pre.push(cur.dictionaryCode)
        }
        return pre
      }, [])

      try {
        const resp = await api.getDictionaryData(this, dictionaryCodeList)
        this.dictionaryData = resp.data

        this.addcolConfigs.forEach((item) => {
          if (item.dictionaryCode) {
            this.$set(item, 'options', resp.data[item.dictionaryCode])
          }
        })
      } catch (error) {
        console.error('获取字典数据失败', error)
      }
    },

    // 格式化主机厂名称
    formatPlantDp,

    // 格式化状态字段
    formatStatus
  }
}
</script>
