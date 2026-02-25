<!--
 * @Description: 移动端导入步骤组件
 * @Date: 2025-07-01
 * @FilePath: src/custom/common/components/mobile-import-steps/index.vue
-->
<template>
  <div class="mobile-import-steps">
    <div class="custom-detail-loading" v-if="loading">
      <cube-loading></cube-loading>
      <p class="custom-loading-text">{{ loadingText }}</p>
    </div>
    <div v-else class="custom-detail-section">
      <!-- 步骤1: 下载模板 -->
      <div class="custom-import-step">
        <div class="step-header">
          <div class="step-num">1</div>
          <div class="step-name">下载模板</div>
        </div>
        <div class="step-content">
          <div class="step-desc">{{ downloadDesc || '下载Excel模板文件' }}</div>
          <div class="step-action">
            <cube-button :primary="true" @click="handleDownload">下载模板</cube-button>
          </div>
        </div>
      </div>

      <!-- 步骤2: 整理数据 -->
      <div class="custom-import-step">
        <div class="step-header">
          <div class="step-num">2</div>
          <div class="step-name">整理数据</div>
        </div>
        <div class="step-content">
          <div class="step-desc">{{
            organizeDesc || '请按照模板格式填写数据，确保数据格式正确'
          }}</div>
        </div>
      </div>

      <!-- 步骤3: 上传文件 -->
      <div class="custom-import-step">
        <div class="step-header">
          <div class="step-num">3</div>
          <div class="step-name">上传文件</div>
        </div>
        <div class="step-content">
          <div class="upload-area" @click="triggerFileUpload">
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              :accept="acceptTypes"
              @change="handleFileChange"
            />
            <i class="cubeic-add"></i>
            <div class="upload-text">点击选择文件</div>
          </div>
          <div v-if="selectedFile" class="selected-file">
            <div class="file-name">{{ selectedFile.name }}</div>
            <div class="step-action">
              <cube-button :primary="true" @click="handleUpload">上传</cube-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading, Button } from 'cube-ui/lib'

export default {
  name: 'MobileImportSteps',
  components: {
    CubeLoading: Loading,
    CubeButton: Button
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    downloadDesc: {
      type: String,
      default: ''
    },
    organizeDesc: {
      type: String,
      default: ''
    },
    acceptTypes: {
      type: String,
      default: '.xlsx, .xls, .XLSX, .XLS'
    }
  },
  data() {
    return {
      selectedFile: null
    }
  },
  methods: {
    handleDownload() {
      this.$emit('download')
    },
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0]
      this.$emit('file-selected', this.selectedFile)
    },
    handleUpload() {
      if (!this.selectedFile) {
        this.$emit('error', '请先选择文件')
        return
      }
      this.$emit('upload', this.selectedFile)
    },
    // 清空选择的文件，供父组件调用
    clearFile() {
      this.selectedFile = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-import-steps {
  .custom-detail-loading {
    padding: 40px 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .custom-loading-text {
      margin-top: 10px;
      color: #999;
    }
  }

  .custom-detail-section {
    padding: 0 15px;

    .custom-import-step {
      padding: 16px 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .step-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #409eff;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 10px;
          font-size: 14px;
        }

        .step-name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
      }

      .step-content {
        padding-left: 34px;

        .step-desc {
          color: #606266;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.5;
        }

        .step-action {
          margin-top: 15px;
        }

        .upload-area {
          width: 100%;
          height: 100px;
          border: 1px dashed #dcdfe6;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 15px 0;

          i {
            font-size: 32px;
            color: #c0c4cc;
            margin-bottom: 8px;
          }

          .upload-text {
            font-size: 14px;
            color: #909399;
          }
        }

        .selected-file {
          border-radius: 4px;
          margin-top: 15px;

          .file-name {
            font-size: 14px;
            color: #303133;
            margin-bottom: 12px;
            word-break: break-all;
            background-color: #f5f7fa;
            padding: 8px 10px;
          }
        }
      }
    }
  }
}
</style>
