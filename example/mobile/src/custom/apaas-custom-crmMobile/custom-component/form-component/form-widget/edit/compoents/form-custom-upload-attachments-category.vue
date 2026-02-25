<!--
 * @Author: 瞿灿
 * @Date: 2024-01-03 15:06:48
 * @LastEditors: junfa
 * @LastEditTime: 2025-01-15 14:19:34
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmApaasProject\custom-component\form-component\form-widget\edit\form-custom-file-class.vue
-->
<template>
  <div class="form-widget form-custom-file-class">
    <input
      id="file"
      ref="files"
      type="file"
      style="display: none;"
      multiple="multiple"
      @change="fileUpload"
    />
    <div class="mobile-card-container">
      <!-- 按钮区域 -->
      <div class="action-card">
        <div class="action-buttons">
          <cube-button
            v-if="isEdit"
            :primary="true"
            :disabled="uploadLoading"
            @click="
              () => {
                this.$refs.files.click()
                this.fileDialogShow(false)
              }
            "
          >
            批量上传
          </cube-button>
          <cube-button
            v-if="isEdit"
            :class="tableData.length === 0 ? 'disabled-danger' : 'danger'"
            :disabled="tableData.length === 0"
            @click="deleteFiles(null)"
          >
            删除
          </cube-button>
          <cube-button
            v-if="!isEdit || isUploadEnd"
            :disabled="previewImages.length === 0"
            @click="viewPicture"
          >
            预览所有图片
          </cube-button>
          <!--  -->
          <cube-button
            v-if="isOperate"
            :disabled="previewImages.length === 0"
            @click="setSupplierInvisible"
          >
            设置供应商不可见
          </cube-button>
        </div>
      </div>

      <!-- 文件卡片区域 -->
      <div v-if="tableData.length === 0" class="empty-card">
        <div class="empty-wrapper">
          <x-svg-icon name="x-lib-warning" width="48" height="48" fill="#dcdfe6"></x-svg-icon>
          <p class="empty-text">暂无数据</p>
        </div>
      </div>

      <div
        v-for="(item, index) in !isSupplier ? tableData : computedTableData"
        :key="item.fileId || index"
        class="mobile-card"
      >
        <!-- 分类选择 -->
        <div class="mobile-card-category-select">
          <div class="select-container" :class="{ 'select-container-edito': isEdit }">
            <cube-select
              v-if="isEdit"
              :key="'select-' + (item.fileId || index)"
              v-model="item.fileClass"
              :options="formatClassListOptions(classList)"
              :placeholder="'选择分类'"
              :auto-pop="false"
              :immediate="true"
              @change="(val) => fileClassUpdate(val, item)"
            >
            </cube-select>
            <div v-else class="mobile-card-category">
              <span class="category-label">选择分类：</span>
              <span class="category-value">{{ item.parentName || '未分类' }}</span>
            </div>
          </div>
        </div>

        <div class="mobile-card-content">
          <!-- 如果是图片则显示缩略图 -->
          <div
            v-if="item.fileType === 'image'"
            class="mobile-card-image"
            @click="inlinePreview(item, index)"
          >
            <div v-if="!item.fileUrl" class="image-error-wrapper">
              <x-svg-icon name="x-lib-warning" width="32" height="32" fill="#f56c6c"></x-svg-icon>
              <span class="image-error-text">图片链接失效</span>
              <cube-button :mini="true" @click.stop="refreshImageUrl(item)">刷新</cube-button>
            </div>
            <img
              v-else
              :src="getImageList(item)"
              alt="图片缩略图"
              class="thumbnail mobile-preview-img"
              @error="handleImageError(item)"
            />
          </div>
          <!-- 如果不是图片则显示文件图标 -->
          <div v-else class="mobile-card-file-icon" @click="downloadBlob(item)">
            <x-svg-icon
              :name="getFileIconClass(item.fileType)"
              :width="48"
              :height="48"
              class="file-icon"
            ></x-svg-icon>
          </div>

          <div class="mobile-card-info">
            <div class="mobile-card-filename">{{ item.fileName }}</div>
            <div class="mobile-card-meta">
              <div class="mobile-card-upload-info">
                <div>上传时间：{{ formatDate(item.uploadTime) }}</div>
                <div>上传人：{{ item.uploadUserName }}</div>
              </div>
              <div class="mobile-card-actions">
                <a class="mobile-action-btn" @click="downloadBlob(item)">
                  <x-svg-icon
                    name="x-lib-download"
                    width="20"
                    height="20"
                    type="primary"
                  ></x-svg-icon>
                </a>
                <a class="mobile-action-btn" @click="inlinePreview(item, index)">
                  <x-svg-icon
                    name="x-lib-preview"
                    width="20"
                    height="20"
                    type="primary"
                  ></x-svg-icon>
                </a>
              </div>
            </div>
          </div>

          <!-- 底部删除按钮 -->
          <div v-if="isEdit && showDel(item)" class="delete-button-container">
            <cube-button class="delete-button" @click="deleteFiles(item)">
              删除
            </cube-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置供应商不可见弹窗 -->
    <MobileDetailPopup
      v-model="supplierInvisible"
      title="设置供应商不可见"
      :show-footer="false"
      ok-btn-text="确认"
      :z-index="600"
    >
      <div class="supplier-setting-content">
        <!-- 批量操作区域 -->
        <div class="popup-toolbar">
          <div class="popup-batch-actions">
            <div class="selected-info">
              已选择 {{ selectedImages.length }} 张图片
            </div>
            <div class="batch-buttons">
              <cube-button
                v-if="selectedImages.length > 0"
                class="batch-btn batch-hide-btn"
                @click="batchHideSelectedImages"
              >
                <x-svg-icon name="x-lib-eye-close" width="12" height="12"></x-svg-icon>
                批量隐藏
              </cube-button>
              <cube-button
                v-if="selectedImages.length > 0"
                class="batch-btn batch-show-btn"
                @click="batchShowSelectedImages"
              >
                <x-svg-icon name="x-lib-eye" width="12" height="12"></x-svg-icon>
                批量显示
              </cube-button>
              <cube-button
                v-if="selectedImages.length > 0"
                class="batch-btn batch-clear-btn"
                @click="clearSelection"
              >
                清空选择
              </cube-button>
            </div>
          </div>
        </div>
        <!-- 按分类展示文件 -->
        <div
          v-for="category in categorizedFiles"
          :key="category.categoryCode"
          class="popup-category-section"
        >
          <!-- 分类标题 -->
          <div class="popup-category-header">
            <div class="popup-category-title">
              <x-svg-icon name="x-lib-folder" width="18" height="18" fill="#3a8ee6"></x-svg-icon>
              <span class="popup-category-name">{{ category.categoryName }}</span>
              <span class="popup-file-count">({{ category.files.length }})</span>
            </div>
          </div>

          <!-- 该分类下的所有图片 -->
          <div class="popup-category-files">
            <div class="popup-images-grid">
              <div
                v-for="(item, index) in category.files.filter((file) => file.fileType === 'image')"
                :key="item.fileId || index"
                class="popup-image-item"
              >
                <div 
                  class="popup-image-wrapper" 
                  :class="{ 
                    'selected': isImageSelected(item)
                  }"
                  @click="toggleImageSelection(item)"
                >
                  <div v-if="!item.fileUrl" class="popup-image-error">
                    <x-svg-icon
                      name="x-lib-warning"
                      width="20"
                      height="20"
                      fill="#f56c6c"
                    ></x-svg-icon>
                    <span class="popup-error-text">链接失效</span>
                  </div>
                  <img
                    v-else
                    :src="getImageList(item)"
                    :alt="item.fileName"
                    class="popup-image-thumbnail"
                    @error="handleImageError(item)"
                  />
                  <!-- 图片状态标识 -->
                  <!-- <div v-if="item.hidden" class="popup-image-status">
                    <x-svg-icon name="x-lib-eye-close" width="12" height="12" fill="#fff"></x-svg-icon>
                  </div> -->
                  <!-- 勾选框 -->
                  <div class="popup-image-checkbox">
                    <div class="checkbox-wrapper">
                      <x-svg-icon 
                        v-if="isImageSelected(item)"
                        name="x-lib-check" 
                        width="14" 
                        height="14" 
                        fill="#fff"
                      ></x-svg-icon>
                    </div>
                  </div>
                </div>
                <div class="popup-image-name">{{ item.fileName }}</div>
                <!-- 每张图片的独立控制按钮 -->
                <div class="popup-image-controls">
                  <cube-button
                    v-if="!item.hidden"
                    class="popup-image-btn popup-hide-btn"
                    @click="setImageSupplierInvisible(item)"
                  >
                    <x-svg-icon name="x-lib-eye-close" width="10" height="10"></x-svg-icon>
                    隐藏
                  </cube-button>
                  <cube-button
                    v-else
                    class="popup-image-btn popup-show-btn"
                    @click="setImageSupplierVisible(item)"
                  >
                    <x-svg-icon name="x-lib-eye" width="10" height="10"></x-svg-icon>
                    显示
                  </cube-button>
                </div>
              </div>
            </div>

            <!-- 如果该分类没有图片 -->
            <div
              v-if="category.files.filter((file) => file.fileType === 'image').length === 0"
              class="popup-no-images"
            >
              <x-svg-icon name="x-lib-image" width="24" height="24" fill="#dcdfe6"></x-svg-icon>
              <span>该分类暂无图片</span>
            </div>
          </div>

          <!-- 分类底部的批量控制按钮 -->
          <!-- <div class="popup-category-footer">
            <div class="popup-visibility-controls">
              <cube-button
                class="popup-visibility-btn popup-visible-btn"
                @click="setCategoryImagesVisible(category.categoryCode)"
              >
                <x-svg-icon name="x-lib-eye" width="14" height="14"></x-svg-icon>
                批量显示
              </cube-button>
              <cube-button
                class="popup-visibility-btn popup-invisible-btn"
                @click="setCategoryImagesInvisible(category.categoryCode)"
              >
                <x-svg-icon name="x-lib-eye-close" width="14" height="14"></x-svg-icon>
                批量隐藏
              </cube-button>
            </div>
          </div> -->
        </div>

        <!-- 如果没有任何文件 -->
        <div v-if="categorizedFiles.length === 0" class="popup-empty">
          <x-svg-icon name="x-lib-warning" width="32" height="32" fill="#dcdfe6"></x-svg-icon>
          <p class="popup-empty-text">暂无文件数据</p>
        </div>
      </div>
    </MobileDetailPopup>

    <!-- 移动端内联预览容器 -->
    <div class="mobile-preview-container" ref="mobilePreviewContainer">
      <div class="mobile-gallery">
        <img
          v-for="(item, index) in tableData"
          v-show="item.fileType === 'image'"
          :key="index"
          :src="getImageList(item)"
          :alt="item.fileName"
          class="mobile-gallery-img"
        />
      </div>
    </div>
    <!-- 移动端内联预览结束 -->

    <!-- 确认删除 Dialog -->
    <cube-dialog
      :visible.sync="deleteDialogVisible"
      :show-close="true"
      title="确认"
      content="是否确认删除？"
      @cancel="deleteDialogVisible = false"
      @confirm="confirmDelete"
    >
    </cube-dialog>
  </div>
</template>

<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
import { compressImage } from '@/custom/common/utils/compress-img'
import { createPart, uploadHandler } from '@/custom/common/file-upload-js/core'
import requestCustom from '@/custom/common/file-upload-utils/request'
import { isChinese } from '@/custom/common/utils/utils.js'
import { Base64 } from 'js-base64'
import { mapState } from 'vuex'
import moment from 'moment'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
import { trackRequestError } from '@/custom/common/utils/track'
import { downloadFile } from '@/custom/common/utils/upload'
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup/index.vue'
import { is } from 'core-js/core/object'

// 注册v-viewer插件
Vue.use(Viewer)

export default {
  name: 'FORM_CUSTOM_FILE_CLASS',
  components: { MobileDetailPopup },
  mixins: [FormWidgetConfigMixin],
  data() {
    return {
      requiredList: [],
      requiredInfoList: [],
      images: [],
      viewOptions: {},
      uploadLoading: false,
      dialogVisible: false,
      imageDialogVisible: false,
      tableData: [],
      classList: [],
      sourceList: [],
      fileClassData: [],
      deleteDialogVisible: false,
      currentDeleteItem: null,
      // Viewer 配置项
      viewerOptions: {
        toolbar: {
          zoomIn: true,
          zoomOut: true,
          oneToOne: true,
          reset: true,
          prev: true,
          play: false,
          next: true,
          rotateLeft: true,
          rotateRight: true,
          flipHorizontal: true,
          flipVertical: true
        },
        title: true,
        navbar: true,
        fullscreen: true,
        loop: false,
        zoomable: true,
        rotatable: true,
        scalable: true,
        keyboard: true,
        slideOnTouch: true,
        tooltip: true,
        movable: true,
        backdrop: true,
        modal: true,
        button: true,
        url: 'data-source',
        zIndex: 10000
      },
      options: [],
      multipleSelection: [],
      uploadFileCount: 0, // 上传文件数量,
      fileIdList: [],
      selectDataList: [],
      fromValueList: [],
      buildUploadConfigTree: [],
      station: false,
      isConstraint: false, // 是否约束    -- 附件控点：- 当用户的用户类型为服务站用户、供应商用户， 则这类用户只能删除 上传人为自己的附件
      uploading: false,
      isUploadEnd: false,
      saveTimeout: null, // Add this property to debounce save operations
      supplierInvisible: false,
      userInfo: {},
      fileIds: [],
      selectedImages: [] // 已选择的图片列表
    }
  },
  computed: {
    ...mapState({
      userNumber: (state) => state.authModule.userInfo?.userNumber,
      xdaptoken: (state) => state.authModule.token,
      userName: (state) => state.authModule.userInfo?.username,
      account: (state) => state.authModule.userInfo?.account
    }),
    // 判断当前用户是否是供应商或服务商
    isIncludeRole() {
      const userInfo =
        window.APaaSSDK?.context.globalVueContext.$store.state.authModule.userInfo || null
      if (userInfo && userInfo.department) {
        return userInfo.department.name === '供应商' || userInfo.department.name === '服务商'
      }
      return false
    },
    previewImages() {
      let list = []
      const tableData = !this.isSupplier ? this.tableData : this.computedTableData
      tableData.map((e) => {
        if (e.fileType === 'image') {
          list.push(e)
        }
      })
      return list
      // let list = []
      // this.tableData.map((e) => {
      //   if (e.fileType === 'image') {
      //     list.push(e)
      //   }
      // })
      // return list
    },
    // 按分类组织文件数据
    categorizedFiles() {
      const categories = new Map()

      // 遍历所有文件，按分类分组
      this.tableData.forEach((file) => {
        let categoryCode = 'uncategorized'
        let categoryName = '未分类'

        if (file.parentName) {
          categoryCode = file.fileClass && file.fileClass[0] ? file.fileClass[0] : 'uncategorized'
          categoryName = file.parentName
        }

        if (!categories.has(categoryCode)) {
          categories.set(categoryCode, {
            categoryCode,
            categoryName,
            files: [],
            docSort: file.docSort || 999
          })
        }

        categories.get(categoryCode).files.push(file)
      })

      // 转换为数组并按docSort排序
      return Array.from(categories.values()).sort((a, b) => a.docSort - b.docSort)
    },
    customEnv() {
      if (!window.GLOBAL_ENV || !window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV) {
        return {}
      }
      return window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV
    },
    domin() {
      const url = window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN
      return url || 'http://gateway.yctp.yuchaidev.com/crm-standard-service/'
    },
    domain() {
      if (this.customEnv.vue_app_upload_url) {
        return this.customEnv.vue_app_upload_url
      }
      return 'http://kong.yctp.yuchaidev.com'
    },
    appCode() {
      if (this.customEnv.VUE_APP_CODE) {
        return this.customEnv.VUE_APP_CODE
      }
      return 'crm'
    },
    sourceCode() {
      if (this.customEnv.VUE_APP_STORAGE_SOURCE_CODE) {
        return this.customEnv.VUE_APP_STORAGE_SOURCE_CODE
      }
      return 'OBS00011'
    },
    fileEncryptionKey() {
      if (this.customEnv.VUE_APP_FILE_ENCRYPTION_KEY) {
        return this.customEnv.VUE_APP_FILE_ENCRYPTION_KEY
      }
      return 'YqK7MTUxMjIwMjIyMTI0MDE1MDg9Ip'
    },
    uploadPath() {
      if (this.customEnv.VUP_APP_COMMON_UPLOAD_PATH) {
        return this.customEnv.VUP_APP_COMMON_UPLOAD_PATH
      }
      return '/crm/common_path'
    },
    onlinePreview() {
      if (this.customEnv.onlinePreview_url) {
        return this.customEnv.onlinePreview_url
      }
      return 'http://kkfile.yuchaidev.com/apaasFile/onlinePreview?url='
    },
    dictionaryId() {
      if (this.customEnv.vue_app_dictionary_id) {
        return this.customEnv.vue_app_dictionary_id
      }
      return '410795773244997632'
    },
    allTileFormItemList() {
      if (!this.formEngine) return []
      return this.formEngine.formDataControl.allTileFormItemList || []
    },
    getGlobalEnv() {
      if (window.APaaSSDK && window.APaaSSDK.context.globalEnv) {
        return window.APaaSSDK.context.globalEnv
      }
      return {}
    },
    isEdit() {
      return this.renderScene === 'ide' || this.renderScene === 'edit'
    },
    company() {
      return this.customEnv.VUE_APP_COMPANY_PRODUCT ?? '1030'
    },
    newSourceCode() {
      try {
        let titleDescription = this.widget?.titleDescription
        if (titleDescription) {
          const text = titleDescription
            .replace(/\s+/g, '')
            .replace(/<\/?br\s*\/?>/g, '')
            .replace(/;/g, ',')
          return text
        }
        return '客户服务平台创建'
      } catch {
        return '客户服务平台创建'
      }
    },
    /**
     * 是否显示对供应商隐藏按钮，且是市场部服务经理，办事处审核环节
     * CRM_GS_SCBFWJLTJ CRM_股司_驻外市场部服务经理（通机）
     * CRM_GS_SCBFWJLCJ CRM_股司_驻外市场部服务经理（车机）
     * crm_00008  CRM_股司_车机驻外区域总经理
     * crm_00009  CRM_股司_通机驻外区域总经理
     * OFFICE 驻外区域服务经理
     * CRM_DL_FWZXLD CRM_动力_服务中心领导
     * CRM_GS_FWZXLD CRM_股司_服务中心领导
     * crm_00089  CRM_动力_服务中心服务科
     * CRM_GS_FWZXLD_FWZGL  CRM_股司_服务中心领导_服务站管理
     * SE_service_supervisor_leader 服务中心领导
     *
     */
    isShowHideBtn() {
      const MANAGER_ROLE_CODES = [
        'CRM_GS_SCBFWJLTJ',
        'CRM_GS_SCBFWJLCJ',
        'crm_00008',
        'crm_00009',
        'OFFICE',
        'CRM_DL_FWZXLD',
        'CRM_GS_FWZXLD',
        'crm_00089',
        'CRM_GS_FWZXLD_FWZGL',
        'SE_service_supervisor_leader'
      ]

      return (
        this.formData.status === 'APPROVING' &&
        this.userInfo?.roleCode?.some((item) => MANAGER_ROLE_CODES.includes(item)) &&
        this.getformData('doc_status_code') === 'YG5304'
      )
    },
    /**
     * 是否是供应商
     */
    isSupplier() {
      // return this.userInfo?.account === 'yc90112885'
      const MANAGER_ROLE_CODES = ['crm_00078', 'supplier', 'CRM_FIX_SUPPLIER']
      return this.userInfo?.roleCode?.some((item) => MANAGER_ROLE_CODES.includes(item))
      // const userInfo =
      //   window.APaaSSDK?.context.globalVueContext.$store.state.authModule.userInfo || null
      // // TODO: 改回原来的判断
      // return userInfo.account === 'yc90112885'
      // if (userInfo && userInfo.department) {
      //   return userInfo.department.name === '供应商'
      // }
      // return false
    },
    /** 是否可操作 */
    isOperate() {
      // return true
      return this.isShowHideBtn && !this.isSupplier
    },
    computedFileClassData() {
      // console.info('computedFileClassData', this.fileClassData)
      return this.fileClassData.filter((item) => !item.hidden)
    },
    computedTableData() {
      return this.tableData.filter((item) => !item.hidden)
    },
    // 是否可以恢复供应商可见
    isCanRecover() {
      return this.fileClassData.some((item) => item?.hidden)
    }
  },
  watch: {
    formValue: {
      async handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          try {
            let arr = newValue ? JSON.parse(newValue) : []

            await this.getUserInfo()

            this.tableData = arr?.map((item) => {
              const { fileClass } = item
              return {
                ...item,
                fileClass: Array.isArray(fileClass) ? fileClass?.[0] : fileClass
              }
            })

            this.fromValueList = this.$lodash.cloneDeep(this.tableData)

            await this.setFileUrl()

            // 确保分类列表加载
            await this.ensureClassList()

            this.setFileClassData()
            this.setRequiredText()

            console.info('查询附件列表成功:', this.tableData)

            // 强制更新视图
            this.$forceUpdate()

            // 确保视图更新后数据正确
            // this.$nextTick(() => {
            //   if (this.tableData.length > 0) {
            //     console.log('检查分类数据是否正确:');
            //     this.tableData.forEach(item => {
            //       console.log(`- 文件 ${item.fileName} 分类值:`, item.fileClass);
            //     });
            //   }
            // })
          } catch (error) {
            console.error('Error processing formValue:', error)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    // 首次获取分类列表
    await this.fileDialogShow(false)
    this.setTableData()
    window._rateVm = this
  },
  mounted() {
    // 确保input元素在DOM中正确渲染
    this.$nextTick(async () => {
      if (!this.$refs.files) {
        console.error('文件上传输入框未正确渲染')
      }

      // 初始化图片查看器
      this.initImageViewer()

      // 确认所有数据是否加载完成
      await this.ensureClassList()

      // 确保数据初始化完成
      this.$nextTick(() => {
        // 最后一次强制更新视图
        this.$forceUpdate()
      })
    })
  },
  beforeDestroy() {
    // 销毁图片查看器
    if (this.mobileViewer) {
      this.mobileViewer.destroy()
    }
    // 销毁toast
    if (this.$toast) {
      this.$toast.destroy()
    }
  },
  methods: {
    // 获取组织的
    getUserInfo() {
      return new Promise((resolve, reject) => {
        const url = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN
        this.$request({
          url: `${url}fnd/crmUser/getUserInfo`,
          method: 'GET',
          disableErrorMsg: true,
          disableSuccessMsg: true,
          params: {
            errorShowFlag: 'N'
          }
        })
          .asyncThen((res) => {
            const userType = res.data && res.data.userType
            this.userType = userType
            this.station = userType && userType.includes('station')
            this.userInfo = res.data
            resolve(res)
          })
          .asyncErrorCatch(() => {})
      })
    },
    showDel(item) {
      if (this.isIncludeRole) {
        return item.uploadUser === this.account
      }

      return this.isEdit
    },
    // 根据code返回uuid
    getUuidByCode(code) {
      let component = this.allTileFormItemList.find(
        (item) => item.modelField && item.modelField.split('.')[1] === code
      )
      return component ? component.uuid : ''
    },
    getFileType(fileName) {
      let suffix = ''
      let result = ''
      if (fileName) {
        const flieArr = fileName.split('.')
        suffix = flieArr[flieArr.length - 1]
      }
      if (!suffix) return false
      suffix = suffix.toLocaleLowerCase()
      const imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
      result = imgList.find((item) => item === suffix)
      if (result) return 'image'
      const txtList = ['txt']
      result = txtList.find((item) => item === suffix)
      if (result) return 'txt'
      const excelList = ['xls', 'xlsx', 'xlsm']
      result = excelList.find((item) => item === suffix)
      if (result) return 'excel'
      const wordList = ['doc', 'docx']
      result = wordList.find((item) => item === suffix)
      if (result) return 'word'
      const pdfList = ['pdf']
      result = pdfList.find((item) => item === suffix)
      if (result) return 'pdf'
      const pptList = ['ppt', 'pptx']
      result = pptList.find((item) => item === suffix)
      if (result) return 'ppt'
      const zipList = ['rar', 'zip', '7z', 'gz', 'jar']
      result = zipList.find((item) => item === suffix)
      if (result) return 'zip'
      const videoList = ['mp4', 'mp3', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
      result = videoList.find((item) => item === suffix)
      if (result) return 'video'
      return 'other'
    },
    // 选择文件上传
    fileUpload() {
      try {
        // console.log('开始文件上传流程')
        this.uploadFileCount = 0
        // 确保使用ref获取文件输入元素
        const fileInput = this.$refs.files
        const files = fileInput.files
        this.uploadFileCount = files.length
        // console.log('选中文件数量:', this.uploadFileCount)

        if (this.uploadFileCount === 0) {
          // console.log('未选择文件')
          return
        }

        // 设置上传中状态
        this.uploadLoading = true

        // 处理单个或多个文件上传
        for (let i = 0; i < files.length; i++) {
          console.log(`开始上传第${i + 1}个文件: ${files[i].name}`)
          this.singleUpload([files[i]])
        }

        // 所有文件上传完成后，自动调用fileDialogOk
        this.$nextTick(() => {
          // 延迟执行以确保所有文件上传完成
          setTimeout(() => {
            // console.log('所有文件上传完成，调用fileDialogOk')
            this.fileDialogOk()
          }, 1500) // 增加延迟时间，确保所有上传完成
        })
      } catch (error) {
        console.error('文件上传过程出错:', error)
        this.uploadLoading = false
        this.$message.error('文件上传失败，请重试')
      }
    },
    // 判断一下图片大小，进行压缩
    singleUpload(fileObj) {
      // 限制 100M  =  104857600字节
      if (fileObj[0].size > 104857600) {
        return this.$message({
          message: '附件上传限制100M提示：' + fileObj[0].name + '文件过大！',
          type: 'warning',
          duration: 3000
        })
      }
      this.spinning = true
      let form = new FormData()
      form.append('file', fileObj[0])
      let that = this
      if (fileObj.length !== 0) {
        var i = fileObj.length
        this.counts = i
        // console.log(fileObj)
        // 判断是否是图片
        if (fileObj[0].type.includes('image')) {
          // 1兆等于 1048576 字节
          // 大于 4M 并且小于5M 压缩清晰度
          // 大于 5M 压缩宽高和清晰度
          let size = fileObj[0].size
          if (size > 4194304 && size < 5242880) {
            let config = {
              w: null,
              h: null,
              quality: 0.5
            }
            compressImage(fileObj[0], config).then((res) => {
              form.append('file', res)
              that.beforeUpload(form, fileObj[0].name, res)
            })
          } else {
            if (size > 5242880) {
              let config = {
                w: 800,
                h: 600,
                quality: 0.5
              }
              compressImage(fileObj[0], config).then((res) => {
                form.append('file', res)
                that.beforeUpload(form, fileObj[0].name, res)
              })
            } else {
              form.append('file', fileObj[0])
              that.beforeUpload(form, fileObj[0].name, fileObj[0])
            }
          }
        } else {
          form.append('file', fileObj[0])
          that.beforeUpload(form, fileObj[0].name, fileObj[0])
        }
      }
    },
    beforeUpload(form, name, file) {
      let uploadPath = this.uploadPath
      const companyCodeUuid = this.getUuidByCode('company_product')
      const companyCode = this.getUuidByCode('company_code')
      const companySettlement = this.getUuidByCode('company_settlement')
      // 根据不同的公司编码，取不同的路径
      if (
        companyCodeUuid &&
        this.formData[companyCodeUuid] &&
        this.customEnv['VUE_APP_UPLOAD_PATH_' + this.formData[companyCodeUuid]]
      ) {
        uploadPath = this.customEnv['VUE_APP_UPLOAD_PATH_' + this.formData[companyCodeUuid]]
      } else if (
        companyCode &&
        this.formData[companyCode] &&
        this.customEnv['VUE_APP_UPLOAD_PATH_' + this.formData[companyCode]]
      ) {
        uploadPath = this.customEnv['VUE_APP_UPLOAD_PATH_' + this.formData[companyCode]]
      } else if (
        companySettlement &&
        this.formData[companySettlement] &&
        this.customEnv['VUE_APP_UPLOAD_PATH_' + this.formData[companySettlement]]
      ) {
        uploadPath = this.customEnv['VUE_APP_UPLOAD_PATH_' + this.formData[companySettlement]]
      }
      let option = {
        file: file,
        appCode: this.appCode,
        businessId: '',
        businessModel: this.globalData ? this.globalData.formId : '',
        contentType: file.type,
        expireDate: 30,
        fileEncryptionKey: this.fileEncryptionKey,
        partTotalNumber: 0,
        sourceCode: this.sourceCode, // 华为云
        uploadPath: uploadPath,
        userCode: this.userNumber ? this.userNumber : 'yc90055362',
        userName: this.userName ? this.userName : '系统管理员'
      }
      // 参数处理
      uploadHandler(option)
      // 文件切片
      let fileList = createPart(option.file, option.partSize)
      fileList = fileList.map(({ file }, index) => ({
        file,
        size: file.size,
        progress: 0,
        chunkName: `${option.file.name}-${index}`,
        fileName: option.file.name,
        index
      }))
      option.$fileList = fileList
      option.partTotalNumber = fileList.length

      // 拿到文件，这个时候先去查询一次性上传的链接 （该动作相当于：获取到文件的上传许可）
      this.getUploadUrl(option)
    },
    // 根据返回的一次性链接上传文件
    getUploadUrl(option) {
      let param = this.$lodash.cloneDeep(option)
      delete param.file
      delete param.$fileList

      try {
        // console.log('准备获取上传URL, 参数:', JSON.stringify(param))
        const sessToken = JSON.parse(
          sessionStorage.getItem(`__vuex__${this.getGlobalEnv.VUE_APP_APP_ID}__session`)
        )

        let requestParams = {
          url: '/xdap-app/yctp-file/upload/shard/url',
          disableSuccessMsg: true,
          method: 'post',
          params: param
        }

        if (sessToken?.tenantModule?.publicFormConfig?.shareToken) {
          requestParams.headers = {
            xdaptoken: sessToken?.tenantModule?.publicFormConfig?.shareToken
          }
        }

        console.log('发送获取上传URL请求')
        this.$request(requestParams)
          .asyncThen(
            async (resp) => {
              console.log('获取上传URL响应:', resp)
              if (resp.data) {
                // 获取到文件的上传资格后，再通过一次性链接上传接口
                if (resp.data.fileShardParts && resp.data.fileShardParts.length > 0) {
                  console.log('获取到上传分片链接, 分片数量:', resp.data.fileShardParts.length)
                  let allUploadedSuccess = true // 默认上传成功
                  for (let i = 0; i < resp.data.fileShardParts.length; i++) {
                    console.log(`上传第${i + 1}个分片`)
                    allUploadedSuccess = await this.fileUploadDoing(
                      resp.data.fileShardParts[i],
                      option.$fileList[i]
                    )
                    if (!allUploadedSuccess) {
                      console.error(`第${i + 1}个分片上传失败`)
                      break
                    }
                  }

                  // 所有的上传都执行完成，执行回调接口
                  // console.log(
                  //     '所有分片上传完成, 状态:',
                  //     allUploadedSuccess ? '成功' : '失败'
                  // )
                  this.uploadLoading = true
                  const callbackDo = await this.callbackDo({
                    fileId: resp.data.fileId,
                    uploadId: resp.data.uploadId,
                    status: allUploadedSuccess ? '上传成功' : '上传失败',
                    userCode: option.userCode
                  })

                  this.uploadLoading = false
                  if (callbackDo && allUploadedSuccess) {
                    console.log('文件上传成功, 添加到表格数据')
                    let rowData = {
                      fileName: option.file.name,
                      fileClass: [],
                      // sourceCode: 'T06',
                      sourceCode: this.newSourceCode,
                      uploadTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                      uploadUser: option.userCode,
                      uploadUserName: option.userName,
                      fileId: resp.data.fileId,
                      fileType: this.getFileType(option.file.name),
                      type: option.contentType
                    }

                    // 确保表格数据更新
                    this.tableData.push(rowData)

                    // 更新文件URL以便显示
                    this.setFileUrl().then(() => {
                      this.$forceUpdate()
                    })

                    // 更新fromValueList，确保数据一致
                    this.fromValueList = this.$lodash.cloneDeep(this.tableData)

                    this.formValue = JSON.stringify(this.tableData)
                  } else {
                    console.error('回调处理失败或上传未成功')
                    this.$message.error('文件上传失败，请重试')
                  }
                } else {
                  console.error('未获取到文件分片信息')
                  this.uploadLoading = false
                  this.$message.error('获取上传链接失败，请重试')
                }
              } else {
                console.error('响应数据为空')
                this.uploadLoading = false
                this.$message.error('获取上传链接失败，请重试')
              }
            },
            (err) => {
              console.error('获取上传URL失败:', err)
              this.uploadLoading = false
              this.$message.error('获取上传链接失败，请重试')
            }
          )
          .asyncErrorCatch((err) => {
            console.error('获取上传URL异常:', err)
            this.uploadLoading = false
            this.$message.error('获取上传链接发生异常，请重试')
          })
      } catch (error) {
        console.error('获取上传URL过程出错:', error)
        this.uploadLoading = false
        this.$message.error('获取上传链接失败，请重试')
      }
    },
    // 执行一次性链接上传动作
    fileUploadDoing(fileShardParts, file) {
      // console.log(fileShardParts, file)
      return new Promise((resolve, reject) => {
        // let params = new FormData()
        // params.append('file', file.file)
        const request = {
          url: fileShardParts.url,
          method: 'PUT',
          withCredentials: false,
          headers: {
            'Content-Type': fileShardParts.actualSignedRequestHeaders['Content-Type'],
            Host: fileShardParts.actualSignedRequestHeaders.Host
          },
          data: file.file
        }
        requestCustom(request)
          .asyncThen(
            (resp) => {
              console.log(resp)
              resolve(true)
            },
            (err) => {
              console.log(err)
              resolve(false)
            }
          )
          .asyncErrorCatch((err) => {
            console.log(err)
            resolve(false)
          })
      })
    },
    // 上传完成后的回调
    callbackDo(param) {
      return new Promise((resolve, reject) => {
        this.$request({
          url: '/xdap-app/yctp-file/callback',
          disableSuccessMsg: true,
          method: 'post',
          params: param
        })
          .asyncThen(
            (resp) => {
              // 只有在所有文件都上传完成后才调用fileDialogOk
              // 单个文件上传成功后不再自动调用fileDialogOk
              resolve(true)
            },
            (err) => {
              console.log(err)
              resolve(false)
            }
          )
          .asyncErrorCatch((err) => {
            console.log(err)
            resolve(false)
          })
      })
    },

    // 下载
    async downloadBlob(item) {
      const res = await downloadFile(item)
      if (!res) {
        this.$createToast({
          txt: '下载失败，请稍后重试',
          type: 'txt'
        }).show()
      }
      // try {
      //   const params = {
      //     url: '/xdap-app/yctp-file/getDownloadUrl/' + item.fileId,
      //     method: 'GET',
      //     params: {
      //       userId: item?.uploadUser
      //     },
      //     disableSuccessMsg: true,
      //     disableErrorMsg: true
      //   }
      //   const [res, err] = await trackRequestError(this.$request(params, false))
      //   if (err) {
      //     this.$createToast({
      //       txt: '下载失败，请稍后重试',
      //       type: 'txt'
      //     }).show()
      //     return
      //   }

      //   const bolbData = await fetch(res.data)
      //   const blob = await bolbData.blob()
      //   const blobUrl = window.URL.createObjectURL(blob)
      //   const link = document.createElement('a')
      //   link.href = blobUrl
      //   link.download = item.fileName
      //   document.body.appendChild(link)
      //   link.click()
      //   setTimeout(() => {
      //     document.body.removeChild(link)
      //     window.URL.revokeObjectURL(blobUrl)
      //   }, 100)
      // } catch (error) {
      //   console.error('下载处理出错:', error)
      //   this.$createToast({
      //     txt: '下载处理出错',
      //     type: 'txt'
      //   }).show()
      // }
    },
    // 删除
    deleteFiles(item) {
      this.currentDeleteItem = item
      this.deleteDialogVisible = true
    },
    confirmDelete() {
      this.deleteFileOk(this.currentDeleteItem)
      this.deleteDialogVisible = false
    },
    deleteFileOk(item) {
      if (item) {
        this.tableData = this.tableData.filter((i) => i.fileId !== item.fileId)
        this.fromValueList = this.fromValueList.filter((i) => i.fileId !== item.fileId)
        this.fileIds.push(item.fileId)
      } else {
        this.fileIds.push(...this.tableData.map((i) => i?.fileId))
        this.tableData = []
      }
      this.formValue = JSON.stringify(this.tableData)
      this.saveTableData()
      setTimeout(() => {
        this.setTableData()
      }, 1000)
      this.setFileClassData()
      this.setRequiredText()
      this.$bus.$emit('update-form-item', {
        data: this.formValue,
        prop: 'attachmentUpload',
        formName: 'attachmentUploadData',
        type: 'componentProps'
      })
    },
    // 勾选
    selectData(value) {
      this.selectDataList = value
      this.$forceUpdate()
    },
    // 弹框关闭按钮
    handleClose(done) {
      done()
    },
    setRequiredText() {
      const ucName = this.widget.titleDescription.split('<')
      if (!ucName) {
        return
      }
      const ucid = this.getUuidByCode(ucName[0])
      if (!ucid) {
        return
      }
      this.requiredList = []
      this.requiredInfoList = []
      this.setDataCascader(this.buildUploadConfigTree)
      this.tableData.map((e) => {
        if (e.fileClass && e.fileClass[0]) {
          if (this.requiredList.indexOf(e.fileClass[0]) !== -1) {
            this.requiredInfoList[this.requiredList.indexOf(e.fileClass[0])].isNull = false
          }
        }
        if (e.fileClass && e.fileClass[1]) {
          if (this.requiredList.indexOf(e.fileClass[1]) !== -1) {
            this.requiredInfoList[this.requiredList.indexOf(e.fileClass[1])].isNull = false
          }
        }
      })
      const requiredArr = []
      this.requiredInfoList.map((w) => {
        if (w.isNull) {
          requiredArr.push(w.label)
        }
      })
      this.formData[ucid] = requiredArr.join(',')
    },
    setDataCascader(list) {
      let data = []
      let valueList = []
      list.forEach((item) => {
        let info = {
          ...item,
          label: item.photoClassification,
          value: item.photoClassificationCode
        }
        if (item.mandatoryFillFlag) {
          let man = JSON.parse(item.mandatoryFillFlag)
          if (
            man &&
            man[0] &&
            man[0] === 'Y' &&
            this.requiredList.indexOf(item.photoClassificationCode) === -1
          ) {
            this.requiredList.push(item.photoClassificationCode)
            this.requiredInfoList.push({
              label: item.photoClassification,
              value: item.photoClassificationCode,
              isNull: true
            })
          }
        }
        if (info.children && info.children.length > 0) {
          info.children = this.setDataCascader(info.children)
        } else {
          info.children = null
        }
        if (valueList.indexOf(item.photoClassificationCode) === -1) {
          valueList.push(item.photoClassificationCode)
          data.push(info)
        }
      })
      return data
    },
    getDataCictionary(dicCode) {
      return new Promise((resolve, reject) => {
        let data = []
        const url = 'common/querySysDict'
        this.$request({
          method: 'get',
          disableSuccessMsg: true,
          url: this.domin + url,
          params: { dicCode: dicCode }
        })
          .asyncThen((resp) => {
            if (resp.code === 'ok') {
              if (resp.table && resp.table.length > 0) {
                resp.table.forEach((item) => {
                  if (item.valueStatus === 'ENABLE') {
                    data.push({
                      label: item.valueName,
                      value: item.valueCode
                    })
                  }
                })
              }
            }
            resolve(data)
          })
          .asyncErrorCatch(() => {
            reject(data)
          })
      })
    },
    getClassList(params) {
      return new Promise((resolve, reject) => {
        let data = []
        const url = 'attachment/buildUploadConfigTree'
        console.log('获取分类列表请求参数:', params)

        this.$request({
          method: 'get',
          disableSuccessMsg: true,
          url: this.domin + url,
          params: params
        })
          .asyncThen((resp) => {
            if (resp.code === 'ok' && resp.table && resp.table.length > 0) {
              this.requiredList = []
              this.requiredInfoList = []
              this.buildUploadConfigTree = resp.table
              data = this.setDataCascader(resp.table)
              this.setRequiredText()
            } else {
              console.log('未获取到分类数据或返回空数据')
            }
            resolve(data)
          })
          .asyncErrorCatch((err) => {
            console.error('获取分类数据出错:', err)
            resolve(data) // 即使出错也要resolve
          })
      })
    },
    // 判断当前入参字符串是否是Json字符串
    isJsonString(str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    },
    // 确保分类选择器数据正确加载
    ensureClassList() {
      return new Promise((resolve) => {
        if (this.classList.length === 0) {
          console.log('分类列表为空，重新加载')
          this.fileDialogShow(false).then(() => {
            console.log('分类列表加载完成，长度:', this.classList.length)
            resolve()
          })
        } else {
          console.log('分类列表已存在，长度:', this.classList.length)
          resolve()
        }
      })
    },
    // 修改fileDialogShow返回Promise
    fileDialogShow(visible) {
      this.dialogVisible = visible
      let params = {
        companyCode: this.company,
        docType: null
      }
      // file_group 字段是后端给的配置，，需求取出来判断
      const fileGroupUuid = this.getUuidByCode('file_group')
      const docTypeUuid = this.getUuidByCode('doc_type_number')
      const companyUuid = this.getUuidByCode('company_product')
      if (fileGroupUuid) {
        const fileGroupValue = this.formData[fileGroupUuid]
        if (fileGroupValue) {
          let fInfo = null
          // 判断是否是可转换的字符串
          const isJson = this.isJsonString(fileGroupValue)
          // 如果可以转换，走新方法
          if (isJson) {
            fInfo = JSON.parse(fileGroupValue)
            if (fInfo.companyCode) {
              params.companyCode = fInfo.companyCode
            }
            if (fInfo.docType) {
              params.docType = fInfo.docType
            }
            if (fInfo.responseUser) {
              this.isConstraint = fInfo.responseUser.includes(this.account)
            }
          } else {
            // 如果不可以转换，走原来的方法
            fInfo = fileGroupValue.split(',')
            if (fInfo[0]) {
              params.companyCode = fInfo[0]
            }
            if (fInfo[1]) {
              params.docType = fInfo[1]
            }
          }
        }
      } else {
        if (docTypeUuid) {
          const docTypeValue = this.formData[docTypeUuid]
          if (docTypeValue) {
            params.docType = docTypeValue
          }
          if (docTypeValue && ['YG53'].includes(docTypeValue)) {
            const sourceOrderType =
              this.formData[this.getUuidByCode('source_order_type')] ||
              this.formData[this.getUuidByCode('source_doc_type')]
            params.docType = sourceOrderType
          }
        }
        if (companyUuid) {
          const companyValue = this.formData[companyUuid]
          if (companyValue && companyValue[0]) {
            params.companyCode = companyValue[0]
          }
        }
      }
      if (this.getformData('sta_station_info.source_order_type') === 'service') {
        params.docType = 'service'
      }
      return new Promise((resolve) => {
        this.getClassList(params).then((data) => {
          this.classList = data
          this.selectDataList = []
          this.$forceUpdate()
          resolve()
        })
      })
    },
    setTableData() {
      const docType = this.getUuidByCode('doc_type_number')
      if (docType) {
        const docTypeName = this.formData[docType]
        if (docTypeName && ['N1', 'YG53'].includes(docTypeName)) {
          this.docYGNumber =
            this.getUuidByCode('source_order_number') || this.getUuidByCode('service_doc_number')
          if (this.docYGNumber && this.formData[this.docYGNumber]) {
            this.getTableData(this.formData[this.docYGNumber])
          }
        }
      }
    },
    getTableData(docNumber) {
      const url = 'attachment/queryAttachment'
      const params = { docNumber: docNumber }
      this.$request({
        method: 'post',
        disableSuccessMsg: true,
        url: this.domin + url,
        params: params
      })
        .asyncThen((resp) => {
          if (resp.data && resp.data.attachmentUpload) {
            this.formValue = resp.data.attachmentUpload
          }
        })
        .asyncErrorCatch(() => {})
    },
    saveTableData() {
      let docNumber = this.formData[this.getUuidByCode('doc_number')]
      const docType = this.getUuidByCode('doc_type_number')
      if (docType) {
        const docTypeName = this.formData[docType]
        if (docTypeName && ['N1', 'YG53'].includes(docTypeName)) {
          this.docYGNumber =
            this.getUuidByCode('source_order_number') || this.getUuidByCode('service_doc_number')
          if (this.docYGNumber && this.formData[this.docYGNumber]) {
            docNumber = this.formData[this.docYGNumber]
          }
        }
      }
      const url = 'attachment/saveAttachmentPublic'
      const params = {
        docNumber: docNumber,
        attachmentUpload: this.formValue,
        fileIds: this.fileIds
      }
      this.$request({
        method: 'post',
        disableSuccessMsg: true,
        url: this.domin + url,
        params: params
      })
        .asyncThen(() => {})
        .asyncErrorCatch(() => {})
      this.fileIds = []
    },
    fileDialogOk() {
      this.tableData.forEach((item) => {
        if (item.fileClass && item.fileClass.length > 0) {
          if (!item.parentName) {
            this.classList.forEach((classItem) => {
              if (classItem.value === item.fileClass[0]) {
                this.$set(item, 'parentName', classItem.label)
                this.$set(item, 'docSort', classItem.docSort || 0)

                if (item.fileClass.length > 1 && classItem.children) {
                  classItem.children.forEach((childItem) => {
                    if (childItem.value === item.fileClass[1]) {
                      this.$set(item, 'fileClassName', childItem.label)
                    }
                  })
                }
              }
            })
          }
        }
      })

      this.formValue = JSON.stringify(this.tableData)

      this.saveTableData()

      this.dialogVisible = false
      this.uploading = false
      this.isUploadEnd = true

      this.fromValueList = this.$lodash.cloneDeep(this.tableData)

      console.info('this.tableData', this.tableData)
      this.$forceUpdate()

      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    getIconImageList(item, index) {
      this.images = [this.getImageList(item)]
      this.$nextTick(() => {
        this.$refs[`image_file${index}`][0].clickHandler()
      })
    },
    // 获取图片地址
    getImageFileUrl(fileId) {
      return new Promise((resolve, reject) => {
        // 检查fileId是否有效
        if (!fileId) {
          console.warn('获取文件URL失败: 文件ID为空')
          resolve('')
          return
        }

        this.$request({
          url: `/xdap-app/yctp-file/getDownloadUrl/${fileId}`,
          disableSuccessMsg: true,
          method: 'GET',
          params: { userId: this.account }
        })
          .asyncThen(
            (resp) => {
              if (resp && resp.data) {
                // 确保URL是字符串格式且不为空
                if (typeof resp.data === 'string' && resp.data.trim() !== '') {
                  resolve(resp.data)
                } else {
                  console.warn(`文件URL格式不正确: ${fileId}`)
                  resolve('')
                }
              } else {
                console.warn(`文件URL获取失败，服务器返回空数据: ${fileId}`)
                resolve('')
              }
            },
            (err) => {
              console.error(`文件URL获取失败: ${fileId}`, err)
              resolve('')
            }
          )
          .asyncErrorCatch((err) => {
            console.error(`文件URL请求异常: ${fileId}`, err)
            resolve('')
          })
      })
    },
    setFileUrl() {
      return new Promise((resolve, reject) => {
        // 使用Promise.all等待所有图片URL获取完成
        const promises = this.tableData.map((item) => {
          return new Promise(async (itemResolve) => {
            try {
              if (item.fileId) {
                const url = await this.getImageFileUrl(item.fileId)
                // 使用$set确保视图更新
                this.$set(item, 'fileUrl', url)

                // 检查URL是否获取成功
                if (!url) {
                  console.warn(`文件URL获取失败: ${item.fileName}, fileId: ${item.fileId}`)
                }
              } else {
                console.warn(`文件项缺少fileId: ${item.fileName}`)
              }
            } catch (error) {
              console.error(`获取文件URL出错: ${item.fileName}`, error)
            }
            itemResolve()
          })
        })

        // 所有URL获取完成后解析主Promise
        Promise.all(promises)
          .then(() => {
            console.log('所有文件URL获取完成，总数:', this.tableData.length)

            // 检查获取结果
            const imageItems = this.tableData.filter((item) => item.fileType === 'image')
            const successCount = imageItems.filter((item) => item.fileUrl).length
            console.log(`图片文件: ${imageItems.length}个, 成功获取URL: ${successCount}个`)

            resolve()
          })
          .catch((err) => {
            console.error('文件URL获取过程出错:', err)
            resolve() // 即使有错误也解析Promise，避免阻塞
          })
      })
    },
    getImageList(item) {
      // 检查item及fileUrl是否存在且有效
      if (!item) {
        console.warn('getImageList: 文件项为空')
        return ''
      }

      return item.fileUrl || ''
    },
    setDocSort(a, b) {
      return a.docSort - b.docSort
    },
    setFileClassData() {
      this.fileClassData = []
      let fileClassList = []
      let classArr = []
      this.tableData.map((e) => {
        if (e.parentName) {
          let index = classArr.indexOf(e.parentName)
          if (index === -1) {
            classArr.push(e.parentName)
            fileClassList.push({
              parentName: e.parentName,
              docSort: e.docSort,
              fileList: [e]
            })
          } else {
            fileClassList[index].fileList.push(e)
          }
        }
      })
      this.fileClassData = fileClassList.sort(this.setDocSort)
    },
    fileClassUpdate(e, row) {
      // Prevent unnecessary updates if there's no change
      if (!e || e.length === 0) return

      console.log('选择的分类值:', e, row)

      // Find the index of the row in tableData
      const rowIndex = this.tableData.findIndex((item) => item.fileId === row.fileId)
      if (rowIndex === -1) return

      // Store the selected value - 直接修改原始对象
      this.tableData[rowIndex].fileClass = e

      // Find the classification info
      let parentName = ''
      let fileClassName = ''
      let docSort = 0

      // Get the label information from the classList
      this.classList.forEach((w) => {
        if (e[0] === w.value) {
          parentName = w.label
          docSort = w.docSort || 0

          if (w.children && e[1]) {
            w.children.forEach((i) => {
              if (e[1] === i.value) {
                fileClassName = i.label
              }
            })
          }
        }
      })

      // Update the row with the found information - 直接修改原始对象
      this.tableData[rowIndex].parentName = parentName
      this.tableData[rowIndex].docSort = docSort
      this.tableData[rowIndex].fileClassName = fileClassName

      // Force update to ensure UI reflects changes
      this.$forceUpdate()

      // Debounce the save operation to prevent multiple rapid saves
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout)
      }

      this.saveTimeout = setTimeout(() => {
        // Update the form value
        this.formValue = JSON.stringify(this.tableData)

        // Update fromValueList to keep it in sync
        this.fromValueList = this.$lodash.cloneDeep(this.tableData)

        // Save the data
        this.saveTableData()

        // Update the file class data
        this.setFileClassData()
        this.setRequiredText()
      }, 300)
    },
    viewPicture() {
      // 使用v-viewer的$viewer方法查看所有图片
      if (this.previewImages.length === 0) {
        this.$createToast({
          txt: '没有可预览的图片',
          type: 'txt'
        }).show()
        return
      }

      // 过滤掉没有有效URL的图片
      const validImages = this.previewImages.filter((item) => item.fileUrl)

      if (validImages.length === 0) {
        this.$createToast({
          txt: '图片链接无效，正在重新获取',
          type: 'loading',
          time: 3000
        }).show()

        // 尝试重新加载所有图片URL
        this.setFileUrl().then(() => {
          this.$createToast({
            txt: '图片链接已更新，请再次点击预览',
            type: 'correct',
            time: 2000
          }).show()
        })
        return
      }

      // 准备图片URL数组
      const images = validImages.map((item) => this.getImageList(item))

      // 使用$viewer方法显示图片
      this.$viewerApi({
        images: images
      })
    },
    viewImg(item) {
      window.open(item.fileUrl)
    },
    preview(item) {
      if (item.fileType === 'image') {
        // 检查图片是否有URL
        if (!item.fileUrl) {
          this.refreshImageUrl(item)
          return
        }

        // 图片类型，使用v-viewer预览
        this.$viewerApi({
          images: [item.fileUrl]
        })
      } else {
        // 检查文件是否有URL
        if (!item.fileUrl) {
          this.$createToast({
            txt: '文件链接无效，正在重新获取',
            type: 'txt'
          }).show()

          this.refreshImageUrl(item)
          return
        }

        // 非图片类型，使用默认预览方式
        let fileUrl = item.fileUrl
        console.info('预览', item.fileName, fileUrl)
        if (!isChinese(item?.fileName)) {
          fileUrl = encodeURI(fileUrl)
        }
        const bs64 = Base64.encode(fileUrl)
        window.open(this.onlinePreview + bs64 + '&watermarkTxt=', '_blank')
      }
    },

    // 刷新图片URL
    refreshImageUrl(item) {
      // 显示加载提示
      const toast = this.$createToast({
        txt: '正在重新获取文件链接',
        type: 'loading',
        time: 0
      })

      toast?.show()

      // 重新获取URL
      this.getImageFileUrl(item.fileId)
        .then((url) => {
          toast?.hide()

          if (url) {
            // 使用$set确保视图更新
            this.$set(item, 'fileUrl', url)

            this.$createToast({
              txt: '链接已更新，请再次点击查看',
              type: 'correct',
              time: 2000
            }).show()

            // 强制更新视图
            this.$forceUpdate()
          } else {
            this.$createToast({
              txt: '获取链接失败，请稍后重试',
              type: 'warn',
              time: 2000
            }).show()
          }
        })
        .catch((err) => {
          toast.hide()
          console.error('刷新URL出错', err)

          this.$createToast({
            txt: '获取链接出错，请稍后重试',
            type: 'warn',
            time: 2000
          }).show()
        })
    },

    // 处理移动端图片内联预览
    inlinePreview(item, index) {
      try {
        if (item.fileType !== 'image') {
          // 非图片类型直接使用默认预览
          this.preview(item)
          return
        }

        // 检查图片是否有URL
        if (!item.fileUrl) {
          this.$createToast({
            txt: '图片链接无效，正在重新获取',
            type: 'txt'
          }).show()

          this.refreshImageUrl(item)
          return
        }

        // 使用v-viewer直接预览
        this.$viewerApi({
          images: [item.fileUrl]
        })
      } catch (error) {
        console.error('预览出错:', error)
        this.$createToast({
          txt: '预览失败，请稍后重试',
          type: 'txt'
        }).show()
      }
    },

    handleDownload(item) {
      this.downloadBlob(item)
    },

    // 格式化日期显示
    formatDate(dateString) {
      if (!dateString) return ''
      return moment(dateString).format('YYYY-MM-DD HH:mm')
    },

    // 获取文件类型对应的图标
    getFileIconClass(fileType) {
      switch (fileType) {
        case 'image':
          return 'x-lib-image'
        case 'pdf':
          return 'x-lib-pdf'
        case 'word':
          return 'x-lib-file-word'
        case 'excel':
          return 'x-lib-file-excel'
        case 'ppt':
          return 'x-lib-file-ppt'
        case 'zip':
          return 'x-lib-file-zip'
        default:
          return 'x-lib-file'
      }
    },

    // 初始化移动端图片查看器
    initImageViewer() {
      this.$nextTick(() => {
        if (this.$refs.mobilePreviewContainer) {
          // 隐藏容器，等点击时显示
          this.$refs.mobilePreviewContainer.style.display = 'none'

          // 确保容器中有图片
          if (this.tableData.filter((item) => item.fileType === 'image').length > 0) {
            // 使用v-viewer初始化
            this.$nextTick(() => {
              // 初始化v-viewer
              this.mobileViewer = this.$viewerApi({
                options: {
                  ...this.viewerOptions,
                  initialViewIndex: 0,
                  backdrop: true,
                  fullscreen: true,
                  modal: true,
                  zIndex: 10000,
                  hidden: () => {
                    // 隐藏时重新隐藏容器
                    if (this.$refs.mobilePreviewContainer) {
                      this.$refs.mobilePreviewContainer.style.display = 'none'
                    }
                  }
                }
              })
            })
          }
        }
      })
    },

    // 执行预览逻辑 - 不再需要这个方法，保留为空以防其他地方调用
    doInlinePreview(item) {
      // 直接调用新的inlinePreview方法
      this.preview(item)
    },

    formatClassListOptions(classList) {
      if (!classList || !classList.length) return []

      const formatOptions = (items) => {
        return items.map((item) => {
          const option = {
            text: item.label || item.photoClassification,
            value: item.value || item.photoClassificationCode
          }

          if (item.children && item.children.length) {
            option.children = formatOptions(item.children)
          }

          return option
        })
      }

      return formatOptions(classList)
    },
    showToast(message, type = 'txt') {
      if (this.$createToast) {
        this.$createToast({
          txt: message,
          type: type
        }).show()
      }
    },
    handleDownloadComplete() {
      this.showToast('下载完成', 'correct')
    },
    handleDownloadError(error) {
      this.showToast('下载失败：' + error, 'error')
    },
    // 处理图片加载错误
    handleImageError(item) {
      // console.error(`图片加载失败: ${item.fileName}, fileId: ${item.fileId}`)
      // 标记图片URL无效，这样下次渲染时会显示错误提示
      this.$set(item, 'fileUrl', '')

      // this.$createToast({
      //   txt: '图片加载失败，请刷新',
      //   type: 'warn',
      //   time: 2000
      // }).show()
    },
    setSupplierInvisible() {
      this.supplierInvisible = true
      // 重置选择状态
      this.selectedImages = []
    },
    // 切换图片选择状态
    toggleImageSelection(item) {
      const index = this.selectedImages.findIndex(img => img.fileId === item.fileId)
      if (index > -1) {
        // 已选择，取消选择
        this.selectedImages.splice(index, 1)
      } else {
        // 未选择，添加到选择列表
        this.selectedImages.push(item)
      }
    },
    // 检查图片是否被选择
    isImageSelected(item) {
      return this.selectedImages.some(img => img.fileId === item.fileId)
    },
    // 清空选择
    clearSelection() {
      this.selectedImages = []
    },
    // 批量隐藏选中的图片
    batchHideSelectedImages() {
      if (this.selectedImages.length === 0) {
        this.$createToast({
          txt: '请先选择要隐藏的图片',
          type: 'txt',
          time: 2000
        }).show()
        return
      }

      let updatedCount = 0
      this.selectedImages.forEach(selectedItem => {
        const index = this.tableData.findIndex(item => item.fileId === selectedItem.fileId)
        if (index !== -1 && !this.tableData[index].hidden) {
          this.$set(this.tableData[index], 'hidden', true)
          updatedCount++
        }
      })

      if (updatedCount > 0) {
        this.updateFormValue(`已将 ${updatedCount} 张图片设置为供应商不可见`)
        this.clearSelection()
      } else {
        this.$createToast({
          txt: '选中的图片已经是隐藏状态',
          type: 'txt',
          time: 2000
        }).show()
      }
    },
    // 批量显示选中的图片
    batchShowSelectedImages() {
      if (this.selectedImages.length === 0) {
        this.$createToast({
          txt: '请先选择要显示的图片',
          type: 'txt',
          time: 2000
        }).show()
        return
      }

      let updatedCount = 0
      this.selectedImages.forEach(selectedItem => {
        const index = this.tableData.findIndex(item => item.fileId === selectedItem.fileId)
        if (index !== -1 && this.tableData[index].hidden) {
          this.$set(this.tableData[index], 'hidden', false)
          updatedCount++
        }
      })

      if (updatedCount > 0) {
        this.updateFormValue(`已将 ${updatedCount} 张图片设置为供应商可见`)
        this.clearSelection()
      } else {
        this.$createToast({
          txt: '选中的图片已经是显示状态',
          type: 'txt',
          time: 2000
        }).show()
      }
    },
    // 设置单张图片供应商不可见
    setImageSupplierInvisible(item) {
      const index = this.tableData.findIndex(file => file.fileId === item.fileId)
      if (index !== -1) {
        this.$set(this.tableData[index], 'hidden', true)
        this.updateFormValue('图片已设置为供应商不可见')
      }
    },
    // 设置单张图片供应商可见
    setImageSupplierVisible(item) {
      const index = this.tableData.findIndex(file => file.fileId === item.fileId)
      if (index !== -1) {
        this.$set(this.tableData[index], 'hidden', false)
        this.updateFormValue('图片已设置为供应商可见')
      }
    },
    // 批量设置分类下所有图片供应商可见
    setCategoryImagesVisible(categoryCode) {
      let updatedCount = 0
      this.tableData.forEach((item, index) => {
        if (item.fileType === 'image' && item.fileClass && item.fileClass[0] === categoryCode && item.hidden) {
          this.$set(this.tableData[index], 'hidden', false)
          updatedCount++
        }
      })
      if (updatedCount > 0) {
        this.updateFormValue(`已将 ${updatedCount} 张图片设置为供应商可见`)
      } else {
        this.$createToast({
          txt: '该分类下没有需要显示的图片',
          type: 'txt',
          time: 2000
        }).show()
      }
    },
    // 批量设置分类下所有图片供应商不可见
    setCategoryImagesInvisible(categoryCode) {
      let updatedCount = 0
      this.tableData.forEach((item, index) => {
        if (item.fileType === 'image' && item.fileClass && item.fileClass[0] === categoryCode && !item.hidden) {
          this.$set(this.tableData[index], 'hidden', true)
          updatedCount++
        }
      })
      if (updatedCount > 0) {
        this.updateFormValue(`已将 ${updatedCount} 张图片设置为供应商不可见`)
      } else {
        this.$createToast({
          txt: '该分类下没有需要隐藏的图片',
          type: 'txt',
          time: 2000
        }).show()
      }
    },
    // 更新表单值并保存
    updateFormValue(successMessage) {
      this.formValue = JSON.stringify(this.tableData)
      this.saveTableData()
      this.$createToast({
        txt: successMessage,
        type: 'correct',
        time: 2000
      }).show()
      // 强制更新视图
      this.$forceUpdate()
    },
    setSupplierInvisibleForCategory(fileClass) {
      this.updateSupplierVisibility({
        hideSelected: false,
        fileClass,
        successMessage: '操作成功！'
      })
    },
    setSupplierVisible(fileClass) {
      console.info('设置供应商可见，分类代码:', fileClass, this.tableData)
      this.updateSupplierVisibility({
        hideSelected: true,
        fileClass,
        successMessage: '操作成功！'
      })
    },
    updateSupplierVisibility(options = {}) {
      const { hideSelected = true, fileClass, successMessage = '操作成功！' } = options
      const hiddenList = []

      console.info('this.tableData==?>', this.tableData)

      // 更新 fileClassData
      const tableData = this.tableData.map((item) => {
        console.info('item===>', item)
        const hidden = item?.fileClass === fileClass && hideSelected

        return {
          ...item,
          hidden
        }
      })

      this.formValue = JSON.stringify(tableData)
      console.info('updateSupplierVisibility==>', this.formValue, this.tableData)
      // return
      this.saveTableData()
      this.$createToast({
        txt: successMessage,
        type: 'correct',
        time: 2000
      }).show()
    },
    toggleVisable() {
      this.updateSupplierVisibility({
        hideSelected: true,
        successMessage: '设置成功！'
      })
    },
    isSupplierVisible(fileClass) {
      return this.tableData.some((item) => item.fileClass?.[0] === fileClass && item.hidden)
    },
    isSupplierInvisible(fileClass) {
      return this.tableData.some((item) => item.fileClass?.[0] === fileClass && !item.hidden)
    }
  }
}
</script>

<style>
.cube-btn {
  margin: 0 5px 5px 0;
  padding: 8px 12px;
  border-radius: 4px;
}

.cube-btn[disabled] {
  opacity: 0.6;
}

.cube-btn.disabled-danger {
  color: #fff;
  background-color: #fab6b6;
  border-color: #fab6b6;
}

.cube-btn.danger {
  color: #fff;
  background-color: var(--color-danger, #f56c6c);
  border-color: var(--color-danger, #f56c6c);
}

.cube-popup {
  border-radius: 8px;
}
</style>
<style scoped lang="scss">
.form-custom-file-class {
  padding: 0;
  width: 100%;
  min-width: 100%;
}

.mobile-card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.action-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;

  .cube-btn {
    width: 100%;
    margin: 4px 0;
    height: 40px;
    font-size: 15px;
    border-radius: 20px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
    }
  }
}

.empty-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 25px 15px;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;

  .cubeic-warn {
    font-size: 48px;
    color: #dcdfe6;
    margin-bottom: 10px;
  }

  .empty-text {
    margin-top: 8px;
    font-size: 15px;
    color: #909399;
    font-weight: 500;
  }
}

.mobile-card {
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  overflow: hidden;
  border: none;
  position: relative;
  padding-top: 2px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:active {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(1px);
  }
}

.mobile-card * {
  box-sizing: border-box;
}

.mobile-card-footer {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.mobile-card-header {
  display: none;
}

.mobile-card-title {
  display: none;
}

.mobile-card-title::before {
  display: none;
}

/* 分类选择区域样式 */
.mobile-card-category-select {
  padding: 12px 15px 0px 15px;
  background-color: #fff;
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 18px;
    width: 4px;
    height: 18px;
    background: linear-gradient(to bottom, #3a8ee6, #6cb5f8);
    border-radius: 0 2px 2px 0;
  }
}

.mobile-card-content {
  padding: 5px 15px 12px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
}

.mobile-card-image {
  width: 100%;
  text-align: center;
  margin: 8px 0 10px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail {
  width: 100%;
  height: auto;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.mobile-card-info {
  width: 100%;
  padding: 10px 0 8px;
  box-sizing: border-box;
}

.mobile-card-filename {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
  word-break: break-all;
  font-weight: 600;
  position: relative;
  padding-left: 0px;
  line-height: 1.4;
}

.mobile-card-meta {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.mobile-card-upload-info {
  margin-bottom: 8px;
  background-color: #f8f9fc;
  padding: 8px 10px;
  border-radius: 6px;
}

.mobile-card-actions {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 8px;
  gap: 10px;
}

.mobile-action-btn {
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f5ff;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
    background-color: #e0ebff;
  }
}

.mobile-card-footer {
  display: none;
}

.select-container {
  width: 100%;
  position: relative;
  margin-bottom: 5px;
}

.isEdit .select-container-edit::before {
  content: '选择分类';
  display: block;
  font-size: 14px;
  color: #303133;
  margin-bottom: 6px;
  font-weight: 600;
  padding-left: 10px;
}

.select-container-edit::before {
  content: '选择分类';
  display: block;
  font-size: 14px;
  color: #303133;
  margin-bottom: 6px;
  font-weight: 600;
  padding-left: 10px;
}

.mobile-card-category {
  font-size: 15px;
  color: #606266;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  background-color: #f8f9fc;
  border-radius: 8px;
  margin-top: 5px;
}

.category-label {
  color: #606266;
  margin-right: 5px;
  font-weight: 500;
}

.category-value {
  color: #303133;
  font-weight: 600;
}

/* 修复cube-select样式 */
.mobile-card ::v-deep .cube-select {
  width: 100%;

  .cube-select-wrapper {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 10px 12px;
    background-color: #fff;
    font-size: 14px;
    color: #303133;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;

    &:active {
      border-color: #3a8ee6;
      box-shadow: 0 0 0 2px rgba(58, 142, 230, 0.1);
    }
  }

  .cube-select-placeholder {
    color: #c0c4cc;
  }

  .cube-select-text {
    color: #303133;
    font-weight: 500;
  }
}

/* 移动端内联预览容器 */
.mobile-preview-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.mobile-gallery {
  display: none; /* 使用viewer.js自己的容器显示，这里隐藏原始图片 */
}

.mobile-gallery-img {
  display: none;
}

/* cube-ui 样式覆盖 */
.image-preview-popup {
  width: 90%;
  max-width: 800px;
  max-height: 80%;
  border-radius: 16px;
  overflow: hidden;
}

.fullscreen-popup {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  border-radius: 0 !important;
  margin: 0 !important;
  top: 0 !important;
  left: 0 !important;
  position: fixed !important;
  z-index: 10000 !important;
  background-color: #000 !important;
}

.fullscreen-popup::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: -1;
}

.popup-title {
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
}

.preview-title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.image-category-name {
  color: #fff;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.popup-content {
  height: calc(100vh - 120px);
  overflow-y: auto;
  background-color: #000;
  padding-bottom: 70px;
}

.cube-popup-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10001;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
    background-color: rgba(255, 255, 255, 0.3);
  }

  i {
    font-size: 20px;
    color: #fff;
  }
}

.viewAll {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
}

.image-item {
  margin: 8px;
  width: calc(50% - 16px);
  max-width: 350px;
}

@media (max-width: 768px) {
  .image-item {
    width: 100%;
    max-width: 100%;
  }
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 16px;
  background-color: rgba(50, 50, 50, 0.5);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preview-image:active {
  transform: scale(0.98);
}

.image-actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
  gap: 10px;
}

.image-actions .cube-btn {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
  flex: 1;
  border-radius: 20px !important;
  height: 36px !important;
  font-weight: 500 !important;
}

.image-actions .cube-btn.cube-btn-primary {
  background: linear-gradient(to right, #3a8ee6, #5ca9f5) !important;
  border-color: #3a8ee6 !important;
}

.mobile-card-file-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  padding: 20px;
  cursor: pointer;
  background-color: #f8f9fc;
  border-radius: 12px;
  width: 100%;

  .file-icon {
    font-size: 60px;
    color: #3a8ee6;
  }
}

.delete-button-container {
  width: 100%;
  padding: 5px 0 5px;
  box-sizing: border-box;
}

.delete-button {
  width: 100%;
  background: linear-gradient(to right, #ff5a5f, #ff7e82) !important;
  color: white !important;
  border-color: #ff5a5f !important;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  font-size: 15px;
  text-align: center;
  padding: 0;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(255, 90, 95, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 5px rgba(255, 90, 95, 0.2);
  }
}

.mobile-card-info {
  width: 100%;
  padding: 8px 0;
  box-sizing: border-box;
}

.delete-button::before {
  border-color: #ff5a5f !important;
}

/* 修改cube-button样式 */
.mobile-card ::v-deep .cube-button {
  &.delete-button {
    background: linear-gradient(to right, #ff5a5f, #ff7e82);
    color: white;
    border-color: #ff5a5f;
  }
}

.big-close-button {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, rgba(80, 80, 80, 0.8), rgba(40, 40, 40, 0.8));
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10002;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &:active {
    transform: translateX(-50%) scale(0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
}

/* 全局样式修复 */
.cube-btn.cube-btn-normal {
  padding: 0 12px;
}

.cube-btn {
  height: 36px;
}

/* 删除不再使用的旧样式 */
.table-header,
.table-header-left,
.table-empty,
.mobile-card-view {
  display: none;
}

/* 弹窗内容样式 */
.supplier-setting-content {
  padding: 12px;
  // max-height: 70vh;
  overflow-y: auto;
  // background-color: #f5f7fa;
}

.popup-category-section {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.popup-category-header {
  // background: linear-gradient(135deg, #f8f9fc 0%, #e8f4fd 100%);
  padding: 10px 6px;
  border-bottom: 1px solid #e4e7ed;
}

.popup-category-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.popup-category-name {
  color: #303133;
}

.popup-file-count {
  color: #909399;
  font-size: 12px;
  font-weight: 400;
}

.popup-category-files {
  padding: 12px;
}

.popup-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.popup-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.popup-image-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 4px;
  position: relative;

  &:active {
    transform: scale(0.95);
  }
}

.popup-image-status {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.popup-image-controls {
  margin-top: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.popup-image-btn {
  font-size: 10px !important;
  height: 20px !important;
  line-height: 20px !important;
  padding: 0 6px !important;
  border-radius: 10px !important;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }
}

.popup-hide-btn {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
  color: #fff !important;

  &:hover {
    background-color: #f78989 !important;
    border-color: #f78989 !important;
  }
}

.popup-show-btn {
  background-color: #67c23a !important;
  border-color: #67c23a !important;
  color: #fff !important;

  &:hover {
    background-color: #85ce61 !important;
    border-color: #85ce61 !important;
  }
}

.popup-image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fef0f0;
  color: #f56c6c;
}

.popup-error-text {
  font-size: 10px;
  margin-top: 2px;
}

.popup-image-name {
  font-size: 10px;
  color: #606266;
  word-break: break-all;
  line-height: 1.2;
  max-width: 80px;
}

.popup-no-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #909399;
  font-size: 12px;
  gap: 6px;
}

.popup-category-footer {
  padding: 10px 12px;
  background-color: #fafbfc;
  border-top: 1px solid #f0f0f0;
}

.popup-visibility-controls {
  display: flex;
  gap: 8px;
  width: 100%;
}

.popup-visibility-btn {
  flex: 1;
  height: 32px;
  font-size: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.popup-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #909399;
}

.popup-empty-text {
  margin-top: 8px;
  font-size: 14px;
  color: #909399;
}

/* 弹窗工具栏样式 */
.popup-toolbar {
  padding: 12px;
  background-color: #f8f9fc;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 12px;
}

.popup-batch-actions {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #e4e7ed;
}

.selected-info {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 500;
}

.batch-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.batch-btn {
  flex: 1;
  min-width: 70px;
  height: 32px;
  font-size: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.batch-hide-btn {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
  color: #fff !important;
}

.batch-show-btn {
  background-color: #67c23a !important;
  border-color: #67c23a !important;
  color: #fff !important;
}

.batch-clear-btn {
  background-color: #909399 !important;
  border-color: #909399 !important;
  color: #fff !important;
}

/* 图片选择样式 */
.popup-image-wrapper {
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &.selected {
    border-color: #3a8ee6;
    box-shadow: 0 0 0 2px rgba(58, 142, 230, 0.2);
  }

  &:hover {
    border-color: #c0c4cc;
  }

  &.selected:hover {
    border-color: #3a8ee6;
  }
}

.popup-image-checkbox {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 3;
}

.checkbox-wrapper {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  transition: all 0.3s ease;
}

.popup-image-wrapper.selected .checkbox-wrapper {
  background-color: #3a8ee6;
  border-color: #3a8ee6;
}
</style>

<!-- 不使用scoped，确保图标样式全局生效 -->
<!-- <style>
.image-error-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  background-color: #fef0f0;
  border-radius: 8px;
  color: #f56c6c;
  padding: 15px 0;
}
.image-error-text {
  margin: 10px 0;
  font-size: 14px;
  color: #f56c6c;
}
.preview-image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  background-color: #fef0f0;
  border-radius: 8px;
  color: #f56c6c;
  margin-bottom: 10px;
}
</style> -->
