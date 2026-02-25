<!--
 * @Author: 瞿灿
 * @Date: 2024-01-03 15:06:48
 * @LastEditors: junfa
 * @LastEditTime: 2025-07-15 17:24:14
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmApaasProject\custom-component\form-component\form-widget\edit\components\UploadCrm.vue
-->
<template>
  <div class="form-widget form-custom-file-class">
    <div
      v-if="row[uuidObj.project] !== '总分' && !column.readOnly"
      class="form-custom-file-class-btns tw-rounded tw-border tw-border-solid tw-border-gray-200 tw-py-2 tw-px-3"
      :class="fromValueList.length === 0 && isReadonly ? 'tw-bg-gray-50' : ''"
    >
      <span
        v-if="!fromValueList.length && !isReadonly"
        class="form-custom-file-class-btns-placeholder tw-text-blue-400"
        @click="dialogVisible = true"
      >
        请上传
      </span>
      <div v-else class="form-custom-file-class-files tw-w-full">
        <span
          v-if="fromValueList.length > 0"
          class="tw-text-blue-400 tw-block tw-w-full"
          @click="dialogVisible = true"
        >
          {{ fromValueList.length }} 个文件
        </span>
        <span v-else>
          -
        </span>
      </div>
      <!-- <span v-if="!isReadonly" class="form-custom-file-class-btns-icon">
        <i class="el-icon-upload2"></i>
      </span> -->
    </div>

    <div v-else class="tw-py-2 tw-px-3"></div>

    <mobile-detail-popup
      v-model="dialogVisible"
      title="附件上传"
      :show-footer="!isReadonly"
      ok-btn-text="确认"
      :z-index="500"
      v-teleport="'body'"
      customClass="upload-popup-ios-fix"
      @confirm="confirm"
    >
      <div class="upload-container">
        <!-- 上传按钮区域 -->
        <div class="upload-header">
          <div class="upload-btn-group">
            <button
              v-if="!isReadonly"
              class="upload-btn primary"
              :disabled="uploadLoading || isReadonly"
              @click="triggerFileInput"
            >
              <span class="upload-icon">📁</span>
              {{ uploadLoading ? '上传中...' : '选择文件' }}
            </button>
            <button
              class="upload-btn info"
              :disabled="previewImages.length === 0"
              @click="viewAllImages"
            >
              <span class="view-icon">👁️</span>
              查看全部图片
            </button>
            <button
              v-if="!isReadonly"
              class="upload-btn danger"
              :disabled="isReadonly || selectDataList.length === 0"
              @click="deleteFiles(null)"
            >
              <span class="delete-icon">🗑️</span>
              删除选中
            </button>
          </div>
          <input
            :id="'file' + uuid"
            ref="files"
            type="file"
            style="display: none;"
            multiple="multiple"
            accept="*/*"
            @change="fileUpload"
            @click="resetFileInput"
            capture="environment"
          />
        </div>

        <!-- 文件列表区域 -->
        <div class="file-list-container">
          <div v-if="tableData.length === 0" class="empty-state">
            <div class="empty-icon">
              <span class="folder-icon">📂</span>
            </div>
            <p class="empty-text">
              {{ isReadonly ? '暂无文件' : '点击上方图标，选择需要上传的附件' }}
            </p>
          </div>

          <div v-else class="file-list">
            <div
              v-for="(item, index) in tableData"
              :key="item.fileId || index"
              class="file-item"
              :class="{ selected: isFileSelected(item) }"
              @click="!isReadonly && toggleFileSelection(item)"
            >
              <!-- 文件图标 -->
              <div class="file-icon">
                <div v-if="item.fileType === 'image'" class="image-preview">
                  <img
                    v-if="item.fileUrl"
                    :src="item.fileUrl"
                    :alt="item.fileName"
                    class="preview-img"
                    @error="handleImageError($event, item)"
                    @load="handleImageLoad"
                  />
                  <span v-else class="file-type-icon">🖼️</span>
                </div>
                <div v-else class="file-type-icon-wrapper">
                  <span :class="'file-type-icon'" v-html="getFileTypeIcon(item.fileType)"></span>
                </div>
              </div>

              <!-- 文件信息 -->
              <div class="file-info">
                <div class="file-name" :title="item.fileName">
                  {{ item.fileName }}
                </div>
                <div class="file-meta">
                  <span class="upload-time">{{ formatTime(item.uploadTime) }}</span>
                  <span class="upload-user">{{ item.uploadUserName }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="file-actions">
                <button
                  v-if="item.fileType === 'image'"
                  class="action-btn preview"
                  @click.stop="previewFile(item)"
                  title="预览"
                >
                  <span>👁️</span>
                </button>
                <button class="action-btn download" @click.stop="downloadBlob(item)" title="下载">
                  <span>⬇️</span>
                </button>
                <button
                  v-if="!isReadonly && showDel(item)"
                  class="action-btn delete"
                  @click.stop="deleteFiles(item)"
                  title="删除"
                >
                  <span>❌</span>
                </button>
              </div>

              <!-- 选择框 -->
              <div v-if="!isReadonly" class="file-checkbox">
                <span :class="isFileSelected(item) ? 'checked' : 'unchecked'" class="checkbox-icon">
                  {{ isFileSelected(item) ? '✅' : '⭕' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 上传进度提示 -->
        <div v-if="uploadLoading" class="upload-progress">
          <div class="progress-content">
            <span class="loading-icon">⏳</span>
            <span>文件上传中，请稍候...</span>
          </div>
        </div>
      </div>
    </mobile-detail-popup>
  </div>
</template>

<script>
import { compressImage } from '@/custom/common/utils/compress-img'
import { createPart, uploadHandler } from '@/custom/common/file-upload-js/core'
import requestCustom from '@/custom/common/file-upload-utils/request'
import { mapState } from 'vuex'
import moment from 'moment'
import { downloadFile } from '@/custom/common/utils/upload'
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup/index.vue'

export default {
  name: 'UploadCrm',
  components: {
    MobileDetailPopup
  },
  model: {
    prop: 'value',
    event: 'update'
  },

  props: {
    value: {
      type: [String, Array, Object, Date],
      default: null
    },
    renderScene: {
      type: String,
      default: 'read'
    },
    uuid: {
      type: String,
      default: ''
    },
    uuidObj: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    },
    column: {
      type: Object,
      default: () => {}
    },
    propKey: {
      type: String,
      default: ''
    }
  },

  //   mixins: [FormWidgetConfigMixin],
  data() {
    return {
      uploadLoading: false,
      dialogVisible: false,
      tableData: [],
      uploadFileCount: 0,
      selectDataList: [],
      fromValueList: [],
      // 组件引擎,可以获取当前页面所有的表单数据
      formEngineVue: null,
      tableEl: null
    }
  },
  computed: {
    ...mapState({
      userNumber: (state) => state.authModule.userInfo?.userNumber,
      xdaptoken: (state) => state.authModule.token,
      userName: (state) => state.authModule.userInfo?.username,
      account: (state) => state.authModule.userInfo?.account
    }),
    formValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update', val)
      }
    },
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
      this.tableData.map((e) => {
        if (e.fileType === 'image') {
          list.push(e)
        }
      })
      return list
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
    getGlobalEnv() {
      if (window.APaaSSDK && window.APaaSSDK.context.globalEnv) {
        return window.APaaSSDK.context.globalEnv
      }
      return {}
    },
    isReadonly() {
      return this.renderScene === 'read'
    }
  },
  watch: {
    formValue: {
      async handler(newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          console.info('formValue ==> ', newValue)
          try {
            const tableData = JSON.parse(newValue)
            this.tableData = this.$lodash.cloneDeep(tableData)
            this.fromValueList = this.$lodash.cloneDeep(tableData)
            await this.setFileUrl()
          } catch (error) {
            console.error('解析 formValue 失败:', error)
            this.tableData = []
            this.fromValueList = []
          }
        } else if (!newValue) {
          this.tableData = []
          this.fromValueList = []
        }
        this.$emit('change', newValue)
      },
      deep: true,
      immediate: true
    },
    //！防止样式被覆盖
    dialogVisible(val) {
      if (this.tableEl) {
        this.tableEl.style.zIndex = val ? 201 : 4
      }
    }
  },
  async created() {
    // window._rateVm = this
  },
  mounted() {
    // 当组件在子表中获取的 formData 不全
    const formEngine = document.querySelectorAll(
      `[data-form-id="${this.globalData?.formId}"] .x-form-build-render`
    )
    if (formEngine && formEngine.length > 0) {
      const customForm = Array.from(formEngine).at(-1)
      this.formEngineVue = customForm?.__vue__ ?? this
      // console.info('this.formEngine', this.formEngineVue)
    }
    this.$nextTick(() => {
      this.tableEl = document.querySelector(
        `.x-mobile-son-table .table-content .s-table-scroll-${this.propKey}`
      )
    })
  },
  methods: {
    showDel(item) {
      if (this.isIncludeRole) {
        return item.uploadUser === this.account
      }
      return true
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
    async fileUpload(e) {
      console.info('fileUpload ==> ', e)
      this.uploadFileCount = 0
      await this.$nextTick()
      console.info('fileUpload nextTick ==> ', e)
      
      // 延迟获取文件对象，确保移动端浏览器已完成文件选择
      setTimeout(() => {
        let files = null
        
        // 尝试多种方式获取文件对象，提高移动端兼容性
        if (e && e.target && e.target.files) {
          files = e.target.files
        } else if (this.$refs.files && this.$refs.files.files) {
          files = this.$refs.files.files
        } else {
          // 直接通过DOM获取
          const fileInput = document.getElementById('file' + this.uuid)
          if (fileInput && fileInput.files) {
            files = fileInput.files
          }
        }

        // 验证文件对象
        if (!files || files.length === 0) {
          console.warn('未获取到有效文件对象，尝试重新获取')
          // 移动端兼容性处理：延迟再次尝试
          setTimeout(() => {
            this.retryFileUpload()
          }, 100)
          return
        }

        // 转换为数组并验证每个文件
        const fileArray = Array.from(files)
        const validFiles = fileArray.filter(file => {
          return file && file.name && file.size !== undefined
        })

        if (validFiles.length === 0) {
          console.error('没有找到有效的文件')
          this.$message({
            message: '文件选择失败，请重试',
            type: 'warn',
            duration: 3000
          })
          return
        }

        this.uploadFileCount = validFiles.length
        console.info('成功获取文件:', this.uploadFileCount, validFiles)

        // 处理文件上传
        if (this.uploadFileCount === 1) {
          this.singleUpload([validFiles[0]])
        } else {
          validFiles.forEach((item) => {
            this.singleUpload([item])
          })
        }

        // 清空 input，允许重复选择同一文件
        if (this.$refs.files) {
          this.$refs.files.value = ''
        }
      }, 50) // 短暂延迟确保文件选择完成
    },

    // 重试文件上传（移动端兼容性处理）
    retryFileUpload() {
      const fileInput = document.getElementById('file' + this.uuid)
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        console.error('重试失败：仍无法获取文件')
        return
      }

      const files = fileInput.files
      const fileArray = Array.from(files)
      const validFiles = fileArray.filter(file => file && file.name && file.size !== undefined)

      if (validFiles.length > 0) {
        this.uploadFileCount = validFiles.length
        console.info('重试成功获取文件:', this.uploadFileCount, validFiles)
        
        if (this.uploadFileCount === 1) {
          this.singleUpload([validFiles[0]])
        } else {
          validFiles.forEach((item) => {
            this.singleUpload([item])
          })
        }
      }

      // 清空 input
      if (this.$refs.files) {
        this.$refs.files.value = ''
      }
    },

    // 重置文件输入框（移动端兼容性处理）
    resetFileInput(e) {
      // 移动端兼容性：在点击时清空value，确保可以重复选择同一文件
      if (e && e.target) {
        e.target.value = ''
      }
    },
    // 判断一下图片大小，进行压缩
    singleUpload(fileObj) {
      // 限制 100M  =  104857600字节
      if (fileObj[0].size > 104857600) {
        // return this.$createToast({
        //   time: 3000,
        //   txt: '附件上传限制100M提示：' + fileObj[0].name + '文件过大！'
        // })
        return this.$message({
          message: '附件上传限制100M提示：' + fileObj[0].name + '文件过大！',
          type: 'warn',
          type: 'txt',
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
        console.log(fileObj)
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
      this.$request(requestParams)
        .asyncThen(
          async (resp) => {
            if (resp.data) {
              // 获取到文件的上传资格后，再通过一次性链接上传接口
              if (resp.data.fileShardParts && resp.data.fileShardParts.length > 0) {
                console.log(resp)
                let allUploadedSuccess = true // 默认上传成功
                for (let i = 0; i < resp.data.fileShardParts.length; i++) {
                  allUploadedSuccess = await this.fileUploadDoing(
                    resp.data.fileShardParts[i],
                    option.$fileList[i]
                  )
                }
                // 所有的上传都执行完成，执行回调接口
                this.uploadLoading = true
                const callbackDo = await this.callbackDo({
                  fileId: resp.data.fileId,
                  uploadId: resp.data.uploadId,
                  status: allUploadedSuccess ? '上传成功' : '上传失败',
                  userCode: option.userCode
                })
                this.uploadLoading = false
                if (callbackDo && allUploadedSuccess) {
                  let rowData = {
                    fileName: option.file.name,
                    fileClass: null,
                    sourceCode: 'T06',
                    uploadTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    uploadUser: option.userCode,
                    uploadUserName: option.userName,
                    fileId: resp.data.fileId,
                    fileType: this.getFileType(option.file.name),
                    type: option.contentType
                  }

                  // 添加到表格数据
                  this.$set(this.tableData, this.tableData.length, rowData)

                  // 同步更新 fromValueList 和 formValue
                  this.fromValueList.push(rowData)
                  this.formValue = JSON.stringify(this.tableData)

                  // 获取文件URL用于预览
                  this.setFileUrl()

                  console.info('文件上传成功:', rowData)
                  this.$message({
                    message: `文件 ${option.file.name} 上传成功`,
                    type: 'txt'
                    // onTimeout: () => {
                  })
                  // const toast = this.$createToast({
                  //   txt: '上传成功'

                  this.$forceUpdate()
                }
              }
            }
          },
          (err) => {
            console.log(err)
          }
        )
        .asyncErrorCatch((err) => {
          console.log(err)
        })
    },
    // 执行一次性链接上传动作
    fileUploadDoing(fileShardParts, file) {
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
        this.$message({
          message: '下载失败，请稍后重试',
          type: 'txt'
        })
      }
      // console.info('ppp', props, fileName, fileId)
      // this.$request(
      //   {
      //     url: '/xdap-app/yctp-file/getDownloadUrl/' + fileId,
      //     method: 'GET',
      //     params: {
      //       userId: this.userNumber
      //     },
      //     disableSuccessMsg: true,
      //     disableErrorMsg: true
      //   },
      //   false
      // )
      //   .asyncThen(
      //     (resp) => {
      //       if (resp && resp.data) {
      //         let fileUrl = resp.data

      //         if (isChinese(fileName)) {
      //           const domain = this.getGlobalEnv.VUE_APP_BASE_DOMAIN
      //             ? this.getGlobalEnv.VUE_APP_BASE_DOMAIN + '/'
      //             : ''

      //           const directUrl =
      //             domain +
      //             'xdap-app/yctp-file/download/' +
      //             fileId +
      //             '?userId=' +
      //             this.userNumber +
      //             '&fullfilename=' +
      //             encodeURIComponent(fileName)

      //           this.createDownloadLink(directUrl, fileName)
      //         } else {
      //           this.createDownloadLink(fileUrl, fileName)
      //         }
      //         // this.$createToast({
      //         //   txt: '文件下载成功'
      //         // }).show()
      //         this.$message({
      //           message: '文件下载成功',
      //           type: 'txt'
      //         })
      //       } else {
      //         this.$message({
      //           message: '下载失败',
      //           type: 'txt'
      //         })
      //       }
      //     },
      //     (err) => {
      //       this.$message({
      //         message: '下载文件失败',
      //         type: 'txt'
      //       })
      //       console.log(err)
      //     }
      //   )
      //   .asyncErrorCatch((err) => {
      //     this.$message({
      //       message: '下载文件失败',
      //       type: 'txt'
      //     })
      //     console.log(err)
      //   })
    },
    // 删除
    deleteFiles(item) {
      // 使用原生确认对话框，简单可靠
      if (confirm('是否确认删除选中的文件？')) {
        this.deleteFileOk(item)
      }
    },
    deleteFileOk(item) {
      if (this.renderScene === 'read') return
      if (item) {
        this.tableData = this.tableData.filter((i) => i.fileId !== item.fileId)
        this.fromValueList = this.fromValueList.filter((i) => i.fileId !== item.fileId)
        this.formValue = JSON.stringify(this.tableData)
        this.saveTableData()
        setTimeout(() => {
          this.setTableData()
        }, 1000)
        // this.setFileClassData()
        return
      }
      const fileIdList = this.selectDataList.map((i) => i.fileId)
      this.tableData = this.tableData.filter((i) => !fileIdList.includes(i.fileId))
      this.fromValueList = this.fromValueList.filter((i) => !fileIdList.includes(i.fileId))
    },
    saveTableData() {
      const url = 'attachment/saveAttachmentPublic'
      const params = {
        docNumber: 'YG88202506100001',
        attachmentUpload: this.formValue
      }
      this.$request({
        method: 'post',
        disableSuccessMsg: true,
        url: this.domin + url,
        params: params
      })
        .asyncThen(() => {})
        .asyncErrorCatch(() => {})
    },
    fileDialogOk() {
      if (this.docYGNumber && this.tableData.length && this.fromValueList.length) {
        this.tableData.forEach((item, index) => {
          const a = this.tableData[index]
          const b = this.fromValueList[index]
          if (!a.parentName && b && b[index] && b[index].parentName) {
            item.parentName = b[index].parentName
          }
          if (!a.fileClassName && b && b[index] && b[index].fileClassName) {
            item.fileClassName = b[index].parentName
          }
        })
      }

      this.formValue = JSON.stringify(this.tableData)
      this.saveTableData()
      this.dialogVisible = false
    },
    // 获取图片地址
    getImageFileUrl(fileId) {
      return new Promise((resolve, reject) => {
        this.$request({
          url: `/xdap-app/yctp-file/getDownloadUrl/${fileId}`,
          disableSuccessMsg: true,
          method: 'GET',
          params: { userId: this.account }
        })
          .asyncThen(
            (resp) => {
              resolve(resp.data)
            },
            () => {
              resolve('')
            }
          )
          .asyncErrorCatch(() => {
            resolve('')
          })
      })
    },
    setFileUrl() {
      return new Promise((resolve, reject) => {
        this.tableData.forEach(async (e, i) => {
          e.fileUrl = await this.getImageFileUrl(e.fileId)
          if (this.tableData.length === i + 1) {
            resolve()
          }
        })
      })
    },
    preview(item) {
      this.$request(
        {
          url: '/xdap-app/yctp-file/getDownloadUrl/' + item.fileId,
          method: 'GET',
          params: {
            userId: item?.uploadUser
          },
          disableSuccessMsg: true,
          disableErrorMsg: true
        },
        false
      ).asyncThen(
        (resp) => {
          // encodeURI
          let fileUrl = resp?.data ?? ''
          window.APaaSSDK.context.globalVueContext.$root.$previewImagesEvent.showImages([fileUrl])
        },
        (err) => {
          this.$message({
            message: '获取预览地址失败',
            type: 'txt'
          })
          console.log(err)
        }
      )
    },
    showImageList() {
      console.info('this.fromValueList', this.fromValueList)
    },

    // 查看全部图片
    viewAllImages() {
      if (this.previewImages.length === 0) {
        this.$message({
          message: '暂无图片可预览',
          type: 'txt'
        })
        return
      }

      // 获取所有图片的URL
      const imageUrls = this.previewImages.map((item) => item.fileUrl).filter((url) => url)

      if (imageUrls.length === 0) {
        this.$message({
          message: '图片加载中，请稍后再试',
          type: 'txt'
        })
        return
      }

      // 使用全局预览组件显示所有图片
      if (window.APaaSSDK && window.APaaSSDK.context.globalVueContext.$root.$previewImagesEvent) {
        window.APaaSSDK.context.globalVueContext.$root.$previewImagesEvent.showImages(imageUrls)
      } else {
        // 备用方案：打开第一张图片
        if (imageUrls[0]) {
          window.open(imageUrls[0])
        }
      }
    },

    // 触发文件选择
    triggerFileInput() {
      // 移动端兼容性处理：确保点击事件正常触发
      try {
        if (this.$refs.files) {
          // 创建一个新的点击事件，确保在移动端也能正常触发
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          })
          this.$refs.files.dispatchEvent(clickEvent)
        } else {
          console.error('文件输入框引用不存在')
          this.$message({
            message: '文件选择功能异常，请刷新页面重试',
            type: 'error',
            duration: 3000
          })
        }
      } catch (error) {
        console.error('触发文件选择失败:', error)
        // 备用方案：直接调用click方法
        if (this.$refs.files) {
          this.$refs.files.click()
        }
      }
    },

    // 切换文件选择状态
    toggleFileSelection(item) {
      const index = this.selectDataList.findIndex((file) => file.fileId === item.fileId)
      if (index > -1) {
        this.selectDataList.splice(index, 1)
      } else {
        this.selectDataList.push(item)
      }
    },

    // 判断文件是否被选中
    isFileSelected(item) {
      return this.selectDataList.some((file) => file.fileId === item.fileId)
    },

    // 获取文件类型图标
    // 获取文件类型图标
    getFileTypeIcon(fileType) {
      const iconMap = {
        image: '🖼️',
        pdf: '📄',
        word: '📝',
        excel: '📊',
        ppt: '📋',
        zip: '📦',
        video: '🎥',
        txt: '📄',
        other: '📄'
      }
      return iconMap[fileType] || iconMap.other
    },

    // 格式化时间
    formatTime(time) {
      if (!time) return ''
      return moment(time).format('MM-DD HH:mm')
    },

    // 预览文件
    previewFile(item) {
      if (item.fileType === 'image') {
        this.preview(item)
      } else {
        this.downloadBlob(item)
      }
    },

    // 图片加载错误处理
    handleImageError(event, item) {
      console.log('图片加载失败:', item.fileName, item.fileUrl)
      event.target.style.display = 'none'
      event.target.parentNode.innerHTML = '<span class="file-type-icon">🖼️</span>'
    },

    // 图片加载成功处理
    handleImageLoad(event) {
      console.log('图片加载成功:', event.target.src)
    },

    // 确认按钮处理
    confirm() {
      this.fileDialogOk()
    }
  }
}
</script>

<style>
.el-select-dropdown__item.selected {
  font-weight: var(--base-font-bold) !important;
}
</style>

<style scoped lang="scss">
::v-deep .el-image-viewer__mask {
  opacity: 0.8 !important;
}

::v-deep .el-icon-circle-close {
  display: none !important;
}

::v-deep .el-dialog__wrapper {
  background-color: #01010187 !important;
}

.form-custom-file-class {
  .form-custom-file-class-btns {
    display: flex;
    justify-content: space-between;
    // padding: 0 12px;
    box-sizing: border-box;

    .form-custom-file-class-btns-placeholder {
      // color: #b2b2b2;
      font-size: var(--base-font-size);
    }

    .form-custom-file-class-files {
      display: flex;
      align-items: center;
      column-gap: 10px;

      .form-custom-file-class-files-icon {
        width: 14px;
        height: 14px;
      }
    }

    .form-custom-file-class-btns-icon {
      color: #999;
      font-size: 16px;
    }

    &:hover {
      .form-custom-file-class-btns-icon {
        color: #333;
      }
    }
  }
}

.popper-class .form-custom-file-class-content {
  height: 200px;

  .popover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: var(--font-size-body-3);
      color: var(--base-font-color);
      font-weight: var(--base-font-bold);
    }
  }

  .popover-content {
    padding-top: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    max-height: 150px;

    .popover-content-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      column-gap: 10px;
      padding: 5px 20px 5px 0px;

      .popover-content-item-filename {
        font-size: 16px;
        color: #333;
        display: block;
        max-width: 150px;
        font-size: 14px;
      }

      .popover-content-item-btns {
        display: flex;
        align-items: center;
        column-gap: 10px;

        .disableDel {
          color: #ccc;
        }

        .popover-content-item-btns-icon {
          width: 14px;
          height: 14px;
          color: var(--color-svg-default-aux);
          cursor: pointer;

          &:hover {
            color: #333;
          }
        }
      }
    }
  }
}

.disabled-danger {
  color: #fff !important;
  background-color: #fab6b6 !important;
  border-color: #fab6b6 !important;
}

.disabled-danger:hover {
  color: #fff !important;
  background-color: #fab6b6 !important;
  border-color: #fab6b6 !important;
}

.danger {
  color: #fff;
  background-color: var(--color-danger);
  border-color: var(--color-danger);
}

.image_file {
  width: 80px;
  height: 60px;
}

/* 上传容器样式 */
.upload-container {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.upload-header {
  margin-bottom: 16px;
}

.upload-btn-group {
  display: flex;
  gap: 12px;
}

.upload-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.upload-btn.primary {
  background-color: #409eff;
  color: white;
}

.upload-btn.primary:hover:not(:disabled) {
  background-color: #66b1ff;
}

.upload-btn.danger {
  background-color: #f56c6c;
  color: white;
}

.upload-btn.danger:hover:not(:disabled) {
  background-color: #f78989;
}

.upload-btn.info {
  background-color: #909399;
  color: white;
}

.upload-btn.info:hover:not(:disabled) {
  background-color: #a6a9ad;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 文件列表容器 */
.file-list-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  margin: 0;
}

.file-list {
  padding: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.file-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

.file-item.selected {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.file-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.image-preview {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-type-icon-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-type-icon {
  font-size: 24px;
  color: #909399;
}

.file-info {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.file-actions {
  display: flex;
  gap: 8px;
  margin-right: 12px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background-color: #f5f7fa;
  color: #606266;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #409eff;
  color: white;
}

.action-btn.delete:hover {
  background-color: #f56c6c;
}

.action-btn.download:hover {
  background-color: #67c23a;
}

.file-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.file-item.selected .file-checkbox {
  border-color: #409eff;
  background-color: #409eff;
}

.checkbox-icon {
  color: white;
  font-size: 12px;
}

/* 上传进度指示器 */
.upload-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  z-index: 100001;
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.loading-icon {
  font-size: 16px;
  animation: rotate 1s linear infinite;
  display: inline-block;
}

.upload-icon,
.delete-icon {
  font-size: 14px;
  margin-right: 4px;
}

.folder-icon {
  font-size: 48px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .upload-container {
    padding: 12px;
  }

  .upload-btn-group {
    flex-direction: column;
    gap: 8px;
  }

  .upload-btn {
    justify-content: center;
  }

  .file-item {
    padding: 8px;
  }

  .file-meta {
    flex-direction: column;
    gap: 2px;
  }
}

.upload-popup-ios-fix {
  height: 100vh;
}
</style>
