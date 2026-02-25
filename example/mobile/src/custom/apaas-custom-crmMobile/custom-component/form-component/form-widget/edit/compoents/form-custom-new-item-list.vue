<!--
 * @Description: 新件清单
 * @Author: junfa
 * @Date: 2023-08-11 09:39:19
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmMobile\custom-component\form-component\form-widget\edit\compoents\form-custom-new-item-list.vue
 * @LastEditors: junfa
 * @LastEditTime: 2025-04-16 11:17:05
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
            @click="openImport()"
            class="tw-flex-1 tw-min-w-[calc(50%-0.5rem)] tw-h-[38px] tw-rounded-full tw-text-sm tw-font-medium"
          >
            导入
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
        <new-item-list-item
          v-for="(item, index) in tableData"
          :key="index"
          :item="item"
          :index="index"
          :editable="renderScene === 'edit' || operationPermission"
          :dictionaryData="dictionaryData"
          @show-detail="showItemDetail"
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
    <new-item-edit-form
      v-model="formPanelVisible"
      :dataList="formDataList"
      :documentId="formData.documentId"
      :mode="formMode"
      :loading="detailLoading"
      :dictionaryData="dictionaryData"
      :cacheData="{ ...formData, '35154ccb93b5d021e658fec1': tableData }"
      @close="handleFormClose"
      @save="confirmAdd"
    />

    <!-- 移动端导入弹窗 -->
    <mobile-detail-popup
      v-model="importPopupVisible"
      title="导入新件清单"
      :z-index="999"
      @close="importPopupVisible = false"
    >
      <mobile-import-steps
        :loading="importLoading"
        downloadDesc="下载新件清单导入模板"
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
import { Popup, Loading, Button, Input, Dialog, Toast } from 'cube-ui/lib'

import NewItemListItem from './form-custom-new-item-list/new-item-list-item.vue'
import NewItemEditForm from './form-custom-new-item-list/new-item-edit-form.vue'
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup/index.vue'
import MobileImportSteps from '@/custom/common/components/mobile-import-steps/index.vue'

import {
  initNewDataItem,
  processFormData,
  formatData
} from './form-custom-new-item-list/utils/data-utils'
import {
  formatDictionaryValue,
  formatArrayValue,
  extractArrayValue
} from './form-custom-new-item-list/utils/formatters'
import * as api from './form-custom-new-item-list/api.js'
import { cloneDeep } from 'lodash'

export default {
  name: 'FORM_CUSTOM_NEW_ITEM_LIST',
  components: {
    CubePopup: Popup,
    CubeLoading: Loading,
    CubeButton: Button,
    CubeInput: Input,
    CubeDialog: Dialog,
    NewItemListItem,
    NewItemEditForm,
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
      default: '新件清单'
    },
    isAdd: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      colConfigs: [
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'itemFigureNumber1',
          label: '物料图号'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'itemName1',
          label: '物料名称',
          formatter: ({ cellValue }) => cellValue && cellValue[0]?.name
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'supplierName1',
          label: '供应商名称',
          formatter: ({ cellValue }) => cellValue && cellValue[0]?.name
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'threeDigitCode',
          label: '三位码'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'structureCode',
          label: '结构码'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'singleUnitUsage',
          label: '单台用量'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'totalSetsNum',
          label: '配件总量'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'unit',
          label: '单位'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'requestedTransfersNum',
          label: '已申请调件数量'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'usedQuantity',
          label: '已使用数量'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'unusedTransferredParts',
          label: '调件未使用数量'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'discharge',
          label: '排放',
          dictionaryCode: 'CRM_MD_EMISSION',
          formatter: ({ cellValue }) => {
            if (cellValue && Array.isArray(cellValue) && cellValue.length > 0) {
              return cellValue[0]
            }
            return cellValue
          }
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'remarks',
          label: '备注'
        },
        {
          resizable: true,
          showOverflowTooltip: true, // 当内容溢出时显示为省略号
          prop: 'docNumber',
          label: '文件ID'
        }
      ],
      tableColConfigs: [],
      addTableColConfigs: [],
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
      // 统一的弹出面板数据
      formMode: 'add', // 面板模式：add/edit/view
      formPanelVisible: false, // 统一面板是否可见
      formDataList: [], // 面板数据列表
      deleteDialogVisible: false, // 删除对话框可见性
      deleteAllDialogVisible: false, // 全部删除对话框可见性
      currentDeleteItem: null, // 当前要删除的项
      detailLoading: false, // 详情加载状态
      importPopupVisible: false, // 导入弹窗可见性
      selectedFile: null, // 选择的文件
      importLoading: false, // 导入加载状态
      oldTableData: []
    }
  },

  computed: {
    operationPermission() {
      let isPermission = this.roleCode.some((i) => this.currentRole.includes(i))
      // console.info('isPermission', isPermission)
      return isPermission
    },
    url() {
      return window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN
    },
    formId() {
      if (this.formData.documentId) {
        return this.formEngineContext.instance.formId
      }
      return this.getformData('crm_form_id')
    }
  },

  watch: {
    formData: {
      handler(newValue, oldValue) {
        this.tableColConfigs = this.colConfigs
      },
      deep: true,
      immediate: true
    },
    documentId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.refreshData()
      }
    }
  },

  async created() {
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
        this.$createToast &&
        this.$createToast({
          txt: '数据刷新中',
          type: 'loading',
          time: 1000
        }).show()
    },

    // 获取表格数据
    async getTableData() {
      this.tableLoading = true

      try {
        const res = await api.getNewItemsListData(this, {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          documentId: this.formData?.documentId,
          formId: this.formId,
          keywords: this.keywords
        })

        this.pagination.total = res.total
        this.tableLoading = false

        if (this.formPanelVisible && this.formMode !== 'view') {
          // 如果面板处于编辑或新增模式，更新表单数据
          this.formDataList = res.table
        } else {
          // 如果是首页，直接替换数据；如果是其他页，则追加数据
          const formattedData = formatData(res.table)
          // const formattedData = res.table
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

    // 确认添加/编辑数据
    async confirmAdd() {
      try {
        // 处理数据，确保符合API要求的格式
        const processedData = processFormData(
          this.formDataList,
          this.formData.documentId,
          this.formMode
        )

        await api.batchSaveNewItems(this, processedData)
        this.formDataList = []
        this.formPanelVisible = false
        this.refreshData()

        this.$createToast &&
          this.$createToast({
            txt: '保存成功',
            type: 'correct',
            time: 2000
          }).show()
      } catch (error) {
        console.error('保存数据失败', error)
        this.$createToast &&
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
        await api.deleteNewItems(this, this.formData.documentId, deleteIds)

        // 显示成功信息
        this.$createToast &&
          this.$createToast({
            txt: '删除成功',
            type: 'correct',
            time: 2000
          }).show()

        this.refreshData()
      } catch (error) {
        console.error('删除数据失败', error)
        this.$createToast &&
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
        await api.downloadTemplate(this)
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
      this.$createToast &&
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
          companyCode: this.getformData('fil_service_file_info.company_source')
        })

        this.importLoading = false
        this.$createToast &&
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
        this.$createToast &&
          this.$createToast({
            txt: '上传失败：' + (error.message || '未知错误'),
            type: 'error',
            time: 3000
          }).show()
      }
    },

    // 显示物料详情
    showItemDetail(item) {
      this.detailLoading = true
      this.formMode = 'view'
      // 确保数据是对象，直接使用原始数据，而不是再次格式化
      this.formDataList = [item]
      this.formPanelVisible = true
      this.detailLoading = false
    },

    // 编辑单个项目
    editItem(item, index) {
      this.formPanelVisible = true
      this.formMode = 'edit'
      // 将数据添加到编辑表
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
      const dictionaryCodeList = this.colConfigs.reduce((pre, cur) => {
        if (cur.dictionaryCode && !pre.includes(cur.dictionaryCode)) {
          pre.push(cur.dictionaryCode)
        }
        return pre
      }, [])

      dictionaryCodeList.push('CRM_COMMOM_COMPANY')

      try {
        const resp = await api.getDictionaryData(this, dictionaryCodeList)
        this.dictionaryData = resp.data
      } catch (error) {
        console.error('获取字典数据失败', error)
      }
    }
  }
}
</script>
