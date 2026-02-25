<!--
 * @Author: 瞿灿
 * @Date: 2024-03-16 15:31:37
 * @LastEditors: 瞿灿
 * @LastEditTime: 2024-05-11 09:25:57
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmApaasProject\custom-component\form-component\form-widget\edit\form-custom-oa-group-tree.vue
-->
<template>
  <div class="form-custom-oa-group-tree">
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
      <!-- 编辑模式 -->
      <div v-if="canEditable" class="mobile-select-input" @click="refreshData">
        <cube-input :value="truncatedText" readonly placeholder="请选择群组" class="mobile-input">
          <i slot="append" class="cubeic-select-more input-icon"></i>
        </cube-input>

        <!-- 清空按钮 -->
        <div v-if="formValText" class="clear-button" @click.stop="clearAll">
          <i class="cubeic-wrong"></i>
        </div>

        <!-- 展开按钮（当内容被截断时显示） -->
        <div v-if="isTextTruncated" class="expand-button" @click.stop="showDetailView">
          <i class="cubeic-more"></i>
        </div>
      </div>

      <!-- 只读模式 -->
      <div v-else class="mobile-readonly-input" @click="showDetailView">
        <div class="readonly-content">
          <span class="readonly-text">{{ truncatedText || '未选择' }}</span>
          <i v-if="isTextTruncated" class="cubeic-more expand-icon"></i>
        </div>
      </div>
    </x-proxy-form-item>

    <!-- 移动端弹出层 -->
    <mobile-detail-popup
      v-model="dialogVisible"
      title="群组选择"
      :show-footer="true"
      ok-btn-text="确认"
      :z-index="200"
      @confirm="confirm"
      @close="handleClose"
    >
      <div class="mobile-tree-container">
        <mobile-oa-group-tree
          ref="mobileOaGroupTree"
          v-model="selectDataList"
          :keyword="keyword"
          :show-search="true"
          @change="handleSelectionChange"
        ></mobile-oa-group-tree>
      </div>
    </mobile-detail-popup>

    <!-- 详情查看弹窗 -->
    <mobile-detail-popup
      v-model="detailVisible"
      title="已选择的群组"
      :show-footer="false"
      :z-index="300"
      @close="handleDetailClose"
    >
      <div class="detail-content">
        <div v-if="selectedItemsList.length === 0" class="empty-state">
          <i class="cubeic-folder"></i>
          <p>暂未选择任何群组</p>
        </div>
        <div v-else class="selected-items-list">
          <div
            v-for="(item, index) in selectedItemsList"
            :key="item.unitId || index"
            class="selected-item"
          >
            <div class="item-icon">
              <i class="cubeic-group"></i>
            </div>
            <div class="item-content">
              <div class="item-name">{{ item.unitName }}</div>
              <div class="item-id">ID: {{ item.unitId }}</div>
            </div>
            <div v-if="canEditable" class="item-action" @click="removeItem(index)">
              <i class="cubeic-wrong"></i>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮（编辑模式） -->
        <div v-if="canEditable && selectedItemsList.length > 0" class="detail-actions">
          <cube-button :outline="true" class="clear-all-btn" @click="clearAllFromDetail">
            清空全部
          </cube-button>
        </div>
      </div>
    </mobile-detail-popup>
  </div>
</template>

<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
import { Input, Button } from 'cube-ui/lib'
import MobileDetailPopup from '@/custom/common/components/mobile-detail-popup/index.vue'
import MobileOaGroupTree from './form-custom-oa-group-tree/mobile-oa-group-tree.vue'

export default {
  name: 'FORM_CUSTOM_OA_GROUP_TREE',
  components: {
    CubeInput: Input,
    CubeButton: Button,
    MobileDetailPopup,
    MobileOaGroupTree
  },
  mixins: [FormWidgetConfigMixin],
  data() {
    return {
      keyword: null,
      selectDataList: [],
      dialogVisible: false,
      detailVisible: false,
      maxDisplayLength: 30 // 最大显示字符数
    }
  },
  computed: {
    webFormSettings() {
      if (this.renderScene === 'edit') {
        return {
          widgetStyle: this.widget.widgetStyle || {},
          border: this.widget.border || {}
        }
      }
      return {
        widgetStyle: {},
        border: {}
      }
    },
    canEditable() {
      return this.renderScene === 'edit'
    },
    allTileFormItemList() {
      if (!this.formEngine) return []
      return this.formEngine.formDataControl.allTileFormItemList || []
    },
    formCodeText() {
      if (!this.formValue) {
        return ''
      }
      const list = JSON.parse(this.formValue)
      let codes = []
      if (Array.isArray(list) && list.length) {
        codes = list.map((e) => {
          return e.unitId
        })
        return JSON.stringify(codes)
      }
      return ''
    },
    formValText() {
      if (!this.formValue) {
        return ''
      }
      const list = JSON.parse(this.formValue)
      let names = []
      if (Array.isArray(list) && list.length) {
        names = list.map((e) => {
          return e.unitName
        })
        return names.join('，')
      }
      return ''
    },

    // 截断后的文本
    truncatedText() {
      if (!this.formValText) {
        return ''
      }
      if (this.formValText.length <= this.maxDisplayLength) {
        return this.formValText
      }
      return this.formValText.substring(0, this.maxDisplayLength) + '...'
    },

    // 是否文本被截断
    isTextTruncated() {
      return this.formValText && this.formValText.length > this.maxDisplayLength
    },

    // 已选择的项目列表
    selectedItemsList() {
      if (!this.formValue) {
        return []
      }
      try {
        const list = JSON.parse(this.formValue)
        return Array.isArray(list) ? list : []
      } catch (e) {
        return []
      }
    }
  },
  watch: {
    formValue: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          const ucName = this.widget.titleDescription.split('<')
          if (!ucName) {
            return
          }
          const ucid = this.getUuidByCode(ucName[0])
          if (!ucid) {
            return
          }
          this.formData[ucid] = this.formCodeText
          this.$forceUpdate()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    window.$expandList = this
  },
  methods: {
    // 根据code返回uuid
    getUuidByCode(code) {
      let component = this.allTileFormItemList.find(
        (item) => item.modelField && item.modelField.split('.')[1] === code
      )
      return component ? component.uuid : ''
    },

    // 打开选择弹窗
    refreshData() {
      let list = []
      if (this.formValue) {
        list = JSON.parse(this.formValue)
      }
      this.selectDataList = []
      if (Array.isArray(list) && list.length) {
        this.selectDataList = [...list]
      }
      this.dialogVisible = true
    },

    // 处理选择变化
    handleSelectionChange(selectedNodes) {
      this.selectDataList = [...selectedNodes]
    },

    // 确认选择
    confirm() {
      this.formValue = JSON.stringify([])
      if (Array.isArray(this.selectDataList) && this.selectDataList.length) {
        this.formValue = JSON.stringify(this.selectDataList)
      }
      this.dialogVisible = false
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
    },

    // 清空选择
    dataClose() {
      this.formValue = null
    },

    // 清空所有选择
    clearAll() {
      this.formValue = null
      this.selectDataList = []
    },

    // 显示详情视图
    showDetailView() {
      this.detailVisible = true
    },

    // 关闭详情视图
    handleDetailClose() {
      this.detailVisible = false
    },

    // 从详情视图中移除单个项目
    removeItem(index) {
      const currentList = [...this.selectedItemsList]
      currentList.splice(index, 1)
      this.formValue = JSON.stringify(currentList)

      // 如果没有选中项了，关闭详情视图
      if (currentList.length === 0) {
        this.detailVisible = false
      }
    },

    // 从详情视图清空全部
    clearAllFromDetail() {
      this.$createDialog({
        type: 'confirm',
        title: '确认删除',
        content: '确定要清空所有已选择的群组吗？',
        zIndex: 500,
        onClose: () => {},
        onConfirm: () => {
          this.clearAll()
          this.detailVisible = false
        }
      }).show()
    }
  }
}
</script>

<style lang="scss" scoped>
.form-custom-oa-group-tree {
  .mobile-select-input {
    position: relative;

    .mobile-input {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      padding-right: 80px;

      ::v-deep .cube-input {
        background-color: #fff;
        overflow: hidden;

        input {
          height: 44px;
          padding: 0 85px 0 12px; // 调整右侧padding适应新的按钮位置
          font-size: 14px;
          color: #333;
          cursor: pointer;

          &::placeholder {
            color: #999;
          }
        }

        .cube-input-append {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          z-index: 1;
        }
      }
    }

    .clear-button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      //   background-color: #ff4d4f;
      border-radius: 50%;
      z-index: 2;
      transition: all 0.2s ease;

      &:active {
        // background-color: #d9363e;
        transform: translateY(-50%) scale(0.95);
      }

      i {
        font-size: 16px;
        // color: #fff;
      }
    }

    .expand-button {
      position: absolute;
      right: 45px;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      // background-color: #2979ff;
      border-radius: 50%;
      z-index: 2;
      transition: all 0.2s ease;

      &:active {
        // background-color: #1976d2;
        transform: translateY(-50%) scale(0.95);
      }

      i {
        font-size: 16px;
        // color: #fff;
      }
    }
  }

  .mobile-readonly-input {
    padding: 12px;
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      background-color: #f0f0f0;
    }

    .readonly-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 20px;

      .readonly-text {
        flex: 1;
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        word-break: break-all;
      }

      .expand-icon {
        margin-left: 8px;
        font-size: 16px;
        color: #2979ff;
        flex-shrink: 0;
      }
    }
  }

  .mobile-tree-container {
    height: calc(100vh - 120px);
    overflow: hidden;
  }

  // 详情视图样式
  .detail-content {
    padding: 0;

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #999;

      i {
        font-size: 48px;
        margin-bottom: 16px;
        color: #ddd;
      }

      p {
        font-size: 14px;
        margin: 0;
      }
    }

    .selected-items-list {
      .selected-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f5f5f5;
        transition: background-color 0.2s ease;

        &:last-child {
          border-bottom: none;
        }

        &:active {
          background-color: #f9f9f9;
        }

        .item-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e6f7ff;
          border-radius: 50%;
          margin-right: 12px;

          i {
            font-size: 18px;
            color: #2979ff;
          }
        }

        .item-content {
          flex: 1;
          min-width: 0;

          .item-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
            word-break: break-all;
          }

          .item-id {
            font-size: 12px;
            color: #999;
            word-break: break-all;
          }
        }

        .item-action {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          // background-color: #ff4d4f;
          border-radius: 50%;
          margin-left: 12px;
          transition: all 0.2s ease;

          &:active {
            // background-color: #d9363e;
            transform: scale(0.95);
          }

          i {
            font-size: 16px;
            // color: #fff;
          }
        }
      }
    }

    .detail-actions {
      padding: 20px 16px;
      border-top: 1px solid #f5f5f5;
      background-color: #fafafa;

      .clear-all-btn {
        width: 100%;
        height: 44px;
        border-radius: 22px;
        font-size: 16px; // 统一字体大小
        font-weight: 500;
        transition: all 0.2s ease;

        &:active {
          transform: scale(0.95); // 统一按压效果
        }
      }
    }
  }
}
</style>
