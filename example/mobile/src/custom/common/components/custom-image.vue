<!--
 * @Author: your name
 * @Date: 2025-01-16 10:00:00
 * @LastEditTime: 2025-01-16 10:00:00
 * @LastEditors: Please set LastEditors
 * @Description: 图片组件，支持鼠标悬停效果
 * @FilePath: /Users/macos/Desktop/workspace/yc/apaas-custom-attachment/src/custom/common/components/image.vue
-->
<template>
  <div class="custom-image-container">
    <div class="image-wrapper" @mouseenter="showOverlay = true" @mouseleave="showOverlay = false">
      <img
        :src="src"
        :alt="alt"
        :style="imageStyle"
        class="custom-image"
        @load="onImageLoad"
        @error="onImageError"
      />

      <!-- 悬停遮罩层 -->
      <div class="image-overlay" :class="{ show: showOverlay }">
        <div class="overlay-actions">
          <div class="action-btn" @click="handlePreview" title="预览">
            <i class="el-icon-view"></i>
          </div>
          <div class="action-btn" @click="handleDownload" title="下载">
            <i class="el-icon-download"></i>
          </div>
        </div>
      </div>
    </div>
    <x-ellipsis mode="origin" :label="filename"></x-ellipsis>

    <!-- 预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="80%"
      append-to-body
      custom-class="image-preview-dialog"
    >
      <div class="preview-container">
        <img :src="src" :alt="alt" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CustomImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: '图片'
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    borderRadius: {
      type: [String, Number],
      default: '4px'
    },
    enablePreview: {
      type: Boolean,
      default: true
    },
    enableDownload: {
      type: Boolean,
      default: true
    },
    filename: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showOverlay: false,
      previewVisible: false,
      imageLoaded: false,
      imageError: false
    }
  },
  computed: {
    imageStyle() {
      console.info('imageStyle', typeof this.width)
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height,
        borderRadius:
          typeof this.borderRadius === 'number' ? `${this.borderRadius}px` : this.borderRadius
      }
    }
  },
  methods: {
    handlePreview() {
      if (this.enablePreview) {
        this.$emit('preview')
      }
    },
    handleDownload() {
      if (this.enableDownload) {
        this.downloadImage()
        // 不需要传递参数，因为父组件已经通过模板传递了 data.row
        this.$emit('download')
      }
    },
    async downloadImage() {
      // trackRequestError
      // // 对于跨域图片，需要先转换为blob再下载
      // if (this.isCrossOrigin(this.src)) {
      //   this.downloadImageAsBlob()
      // } else {
      //   const link = document.createElement('a')
      //   link.href = this.src
      //   link.download = this.filename || this.getFilenameFromUrl(this.src)
      //   document.body.appendChild(link)
      //   link.click()
      //   document.body.removeChild(link)
      // }
    },
    onImageLoad() {
      this.imageLoaded = true
      this.imageError = false
      this.$emit('load')
    },
    onImageError() {
      this.imageError = true
      this.imageLoaded = false
      this.$emit('error')
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-image-container {
  display: inline-block;
  position: relative;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  overflow: hidden;
  cursor: pointer;

  .image-content {
    display: flex;
    flex-direction: column;
  }

  .custom-image {
    display: block;
    max-width: 100%;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.show {
    opacity: 1;
  }
}

.overlay-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffffff;
    transform: scale(1.1);
  }

  i {
    font-size: 18px;
    color: #333;
  }
}

.preview-container {
  text-align: center;

  .preview-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }
}

:deep(.mobile-card-category-select) {
  background: #fff;
}

// 对话框样式覆盖
:deep(.image-preview-dialog) {
  .el-dialog__body {
    padding: 20px;
  }
}
</style>
