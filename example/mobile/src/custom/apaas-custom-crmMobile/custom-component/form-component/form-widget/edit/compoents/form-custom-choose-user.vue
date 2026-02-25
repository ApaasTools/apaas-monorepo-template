<template>
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
    <!-- 移动端选人组件输入区域 -->
    <div class="select-person-input-mobile">
      <div class="input-container" @click="focusInput">
        <div class="render-data-container">
          <!-- 简洁模式：只显示数量和已选人员 -->
          <div v-if="confirmData && confirmData.length > 0" class="compact-display">
            <span class="selected-count">已选择 {{ confirmData.length }} 人</span>
            <span class="first-item-name">{{ confirmData[0]?.username }}</span>
            <span v-if="confirmData.length > 1" class="more-indicator" @click.stop="showAllSelected"
              >查看全部 ({{ confirmData.length }})</span
            >
          </div>
          <!-- 无选择时的提示 -->
          <div v-else class="empty-tip">
            请选择发文人员
          </div>
        </div>
        <!-- 图标 -->
        <i 
          class="input-icon" 
          :class="confirmData && confirmData.length > 0 && isEdit ? 'cubeic-close' : 'cubeic-person'"
          @click.stop="isEdit && confirmData?.length ? clearAll($event) : null"
        ></i>
      </div>
    </div>

    <!-- 全部已选项预览弹窗 -->
    <cube-popup
      v-model="showAllPopup"
      position="center"
      :mask-closable="true"
      class="all-selected-popup"
      :z-index="100"
    >
      <div class="popup-header">
        <div class="back-icon" @click="showAllPopup = false"><i class="cubeic-back"></i></div>
        <div class="popup-title">已选择人员 ({{ (confirmData && confirmData.length) || 0 }})</div>
      </div>
      <div class="preview-scroll">
        <div v-if="!confirmData || confirmData.length === 0" class="no-selected-items">
          <i class="cubeic-warn"></i>
          <span>暂无选择项</span>
        </div>
        <div class="preview-item" v-for="(item, index) in confirmData || []" :key="index">
          <div class="item-content">
            <div class="item-name">{{ item?.username }}</div>
            <div class="item-account" v-if="item.account">{{ item.account }}</div>
          </div>
          <div v-if="isEdit" class="item-remove" @click="closePerson(item, 'out')">
            <i class="cubeic-close"></i>
          </div>
        </div>
      </div>
      <div class="popup-footer">
        <cube-button
          :outline="true"
          v-if="isEdit && confirmData && confirmData.length > 0"
          @click="clearAll"
          >清空全部</cube-button
        >
        <cube-button :primary="true" @click="showAllPopup = false">确定</cube-button>
      </div>
    </cube-popup>

    <!-- 人员选择弹窗 -->
    <cube-popup
      v-model="personModal"
      position="bottom"
      :mask-closable="false"
      class="person-select-popup"
    >
      <div class="popup-container">
        <!-- 固定头部区域 -->
        <div class="popup-fixed-header">
          <div class="popup-header">
            <div class="popup-title">选择用户</div>
            <i class="cubeic-close" @click="cancel"></i>
          </div>
          
          <!-- 搜索区域 -->
          <div class="search-form">
            <cube-input 
              v-model="keyWord" 
              placeholder="请输入内容" 
              clearable
              class="search-input"
              @input="showTabEvent"
              @keypress.enter.native="getUsers"
            >
              <i slot="append" class="cubeic-search" @click="getUsers"></i>
            </cube-input>
          </div>

          <!-- 选项卡切换 -->
          <cube-tab-bar 
            v-if="showTab || !keyWord" 
            v-model="activeName" 
            :data="tabsList"
            @change="tabsChange"
            class="tabs-bar"
            showSlider 
          >
          </cube-tab-bar>
        </div>

        <!-- 滚动内容区域 -->
        <div class="popup-scroll-content">
          <!-- 动态组件区域 -->
          <div class="component-container">
            <component
              :is="activeName"
              :ref="activeName"
              :selectedData="selectedData"
              :keyWord="keyWord"
              @personChange="personChange"
            />
          </div>
        </div>

        <!-- 底部操作区域 -->
        <div class="popup-fixed-footer">
          <div class="selected-info" v-if="selectedData.length > 0">
            已选择 <span class="count">{{ selectedData.length }}</span> 人
          </div>
          
          <!-- 已选人员标签区域，可滚动 -->
          <div class="selected-tags-wrapper" v-if="selectedData.length > 0">
            <div class="selected-tags">
              <div 
                v-for="item in selectedData"
                :key="item.id"
                class="selected-tag"
              >
                <span class="tag-name">{{ item.username }}</span>
                <i class="cubeic-close" @click="closePerson(item, 'in')"></i>
              </div>
            </div>
          </div>
          
          <div class="footer-btns">
            <cube-button :outline="true" :light="true" @click="cancel">
              取消
            </cube-button>
            <cube-button 
              :primary="true" 
              :disabled="selectedData.length === 0"
              @click="confirm"
            >
              确认
            </cube-button>
          </div>
        </div>
      </div>
    </cube-popup>
  </x-proxy-form-item>
</template>

<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
import { getJsonParse } from '@/util/apaas.js'
import { Popup, Input, Button, TabBar, Dialog, Toast } from 'cube-ui/lib'

// 导入移动端组件
import PersonListMobile from './form-custom-choose-user/person-list-mobile.vue'
import DepartmentListMobile from './form-custom-choose-user/department-list-mobile.vue'
import RoleListMobile from './form-custom-choose-user/role-list-mobile.vue'
import CopyListMobile from './form-custom-choose-user/copy-list-mobile.vue'

export default {
  name: 'Form_Custom_Choose_User2_Mobile',
  components: {
    CubePopup: Popup,
    CubeInput: Input,
    CubeButton: Button,
    CubeTabBar: TabBar,
    PersonList: PersonListMobile,
    DepartmentList: DepartmentListMobile,
    RoleList: RoleListMobile,
    CopyList: CopyListMobile
  },
  mixins: [FormWidgetConfigMixin],
  data() {
    return {
      editInputValue: '',
      activeName: 'PersonList',
      tabsList: [
        {
          label: '按用户',
          value: 'PersonList'
        },
        {
          label: '按部门',
          value: 'DepartmentList'
        },
        {
          label: '按角色',
          value: 'RoleList'
        },
        {
          label: '按复制',
          value: 'CopyList'
        }
      ].map(item => ({
        label: item.label,
        value: item.value
      })),
      keyWord: null,
      showTab: true,
      personModal: false,
      selectedData: [],
      showAllPopup: false // 控制全部已选项弹窗
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
    isEdit() {
      return !this.widget?.readOnly && this.renderScene === 'edit'
    },
    standardGateway() {
      const url = window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN
      return url || 'http://gateway.yctp.yuchaidev.com/crm-standard-service/'
    },
    assignmentUuid() {
      if (this.widget.titleDescription) {
        let str1 = this.widget.titleDescription.replace('</br>', '')
        return this.getHideUid(str1)
      }
      return ''
    },
    confirmData() {
      return getJsonParse(this.formValue) || []
    }
  },
  watch: {},
  created() {
    window.$formCustomChooseUser = this
    this.dynamicTags = []
  },
  methods: {
    // 显示所有已选项
    showAllSelected() {
      if (this.confirmData && this.confirmData.length > 0) {
        this.showAllPopup = true
      }
    },
    
    // 人员选择变化
    personChange(val) {
      if (val.checked) {
        if (this.selectedData.some((i) => i.id === val.id)) {
          return
        }
        this.selectedData.push({
          ...val,
          tooltip: val.username + '-' + val.account
        })
      } else {
        this.selectedData = this.selectedData.filter((i) => i.id !== val.id)
      }
    },
    
    // 关闭人员标签
    closePerson(tag, type) {
      if (this.selectedData.length === 0) {
        this.selectedData = this.confirmData
      }
      this.selectedData = this.selectedData.filter((i) => i.id !== tag.id)
      if (type === 'out') {
        this.formValue = JSON.stringify(this.selectedData)
      } else {
        this.$refs[this.activeName].synchronousData(this.selectedData)
      }
    },
    
    // 点击输入框
    focusInput() {
      if (this.isEdit) {
        this.personModal = true
        this.selectedData = this.confirmData
        this.$nextTick(() => {
          if (this.$refs[this.activeName] && this.$refs[this.activeName].synchronousData) {
            this.$refs[this.activeName].synchronousData(this.selectedData)
          }
        })
      }
    },
    
    // 获取用户
    getUsers() {
      this.activeName = ''
      this.$nextTick(() => {
        this.activeName = 'PersonList'
      })
      this.showTab = false
    },
    
    // 显示选项卡事件
    showTabEvent() {
      if (!this.keyWord) {
        this.showTab = true
      }
    },
    
    // 选项卡切换
    tabsChange() {},
    
    // 取消选择
    cancel() {
      // 如果有未保存的选择，询问用户是否确认放弃
      const currentSelected = this.selectedData.map((i) => i.id).sort()
      const formValueIds = this.confirmData.map((i) => i.id).sort()

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
            this.personModal = false
          }
        }).show()
      } else {
        this.personModal = false
      }
    },
    
    // 确认选择
    confirm() {
      this.personModal = false
      this.formValue = JSON.stringify(this.selectedData)
      if (this.assignmentUuid) {
        this.formData[this.assignmentUuid] = this.confirmData
      }
      
      // 显示成功提示
      this.$createToast({
        txt: `已选择${this.selectedData.length}人`,
        type: 'success',
        time: 1500
      }).show()
    },
    
    // 清空全部
    clearAll(event) {
      // 阻止事件冒泡
      if (event && event.stopPropagation) {
        event.stopPropagation()
      }

      if (!this.confirmData || this.confirmData.length === 0) return

      // 询问用户是否确认清空
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确定要清空所有已选人员吗？',
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
          this.selectedData = []
          this.formValue = JSON.stringify([])
          if (this.assignmentUuid) {
            this.formData[this.assignmentUuid] = []
          }
          
          this.$createToast({
            txt: '已清空所有已选人员',
            type: 'success',
            time: 1500
          }).show()
        }
      }).show()
    }
  },
  mounted() {
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
// 移动端选人组件样式
.select-person-input-mobile {
  width: 100%;
}

// 输入框容器样式
.input-container {
  width: 100%;
  display: flex;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 4px;
  min-height: 48px; /* 增大点击区域 */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  &:active {
    border-color: #409eff;
  }
}

// 渲染数据容器样式
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
      // border-radius: 4px;
      // background-color: #fff;
      // border: 1px solid #409eff;
      // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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

// 输入框图标样式
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
    background-color: #f5f5f5;
    border-bottom: 1px solid #eee;
    position: relative;

    .back-icon {
      position: absolute;
      left: 16px;
      color: #666;
      font-size: 18px;
      padding: 4px;
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

      .item-account {
        font-size: 12px;
        color: #999;
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

.all-selected-popup {
  ::v-deep .cube-popup-content {
    height: 100vh;
  }
  
  ::v-deep .cube-popup-mask {
    background-color: #fff;
  }
}

// 人员选择弹窗样式
.person-select-popup {
  height: 100%;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .popup-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .popup-fixed-header {
      flex: 0 0 auto;
      padding: 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #eee;

      .popup-header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        position: relative;

        .popup-title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .cubeic-close {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: #999;
          padding: 8px;
        }
      }

      .search-form {
        padding: 12px 0px;
        background-color: #f5f5f5;

        .search-input {
          height: 40px;
          padding: 0 10px;
          box-sizing: border-box;
        }
      }

      .tabs-bar {
        background-color: #f5f5f5;
        border-bottom: 1px solid #eee;
      }
    }

    .popup-scroll-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background-color: #f5f5f5;
      height: 50vh;
      max-height: 50vh;

      .component-container {
        padding: 16px;
      }
    }

    .popup-fixed-footer {
      flex: 0 0 auto;
      padding: 16px;
      background-color: #fff;
      border-top: 1px solid #eee;
      
      .selected-info {
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;
        
        .count {
          color: #409eff;
          font-weight: bold;
        }
      }
      
      .selected-tags-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: 100px;
        overflow-y: auto;
        margin-bottom: 10px;
        
        .selected-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .selected-tag {
            display: flex;
            align-items: center;
            background-color: #ecf5ff;
            border-radius: 4px;
            padding: 4px 8px;
            
            .tag-name {
              font-size: 13px;
              color: #409eff;
              margin-right: 4px;
            }
            
            .cubeic-close {
              font-size: 12px;
              color: #409eff;
            }
          }
        }
      }
      
      .footer-btns {
        display: flex;
        gap: 12px;
        
        ::v-deep .cube-btn {
          flex: 1;
          height: 40px;
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
</style>
