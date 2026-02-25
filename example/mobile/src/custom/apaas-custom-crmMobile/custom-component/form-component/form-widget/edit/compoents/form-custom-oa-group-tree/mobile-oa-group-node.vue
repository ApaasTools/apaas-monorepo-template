<template>
  <div class="mobile-oa-group-node">
    <!-- 节点内容 -->
    <div
      class="node-content"
      :class="{
        'has-children': !isLeaf,
        'node-checked': isChecked,
        'node-indeterminate': isIndeterminate
      }"
      @click="handleNodeClick"
    >
      <!-- 选中背景层 -->
      <div
        v-if="isChecked || isIndeterminate"
        class="selection-background"
        :style="selectionBackgroundStyle"
      ></div>

      <!-- 内容容器 -->
      <div class="content-wrapper" :style="indentStyle">
      <!-- 展开/收起图标 -->
      <div class="expand-icon" @click.stop="toggle" v-if="!isLeaf">
        <i :class="expanded ? 'cubeic-select' : 'cubeic-arrow'"></i>
      </div>
      <div class="placeholder" v-else></div>

        <!-- 复选框 -->
        <div class="checkbox-container" @click.stop="handleCheckboxClick">
          <div
            class="custom-checkbox"
            :class="{
              'checked': isChecked,
              'indeterminate': isIndeterminate
            }"
          >
            <i v-if="isChecked && !isIndeterminate" class="cubeic-right"></i>
            <i v-else-if="isIndeterminate" class="cubeic-minus"></i>
          </div>
        </div>

      <!-- 节点图标 -->
      <div class="node-icon">
        <i class="cubeic-group" v-if="!isLeaf"></i>
        <i class="cubeic-person" v-else></i>
      </div>

        <!-- 节点名称 -->
        <div class="node-label" v-if="keyword">
          <span v-html="highlightKeyword(node.unitName, keyword)"></span>
        </div>
        <div class="node-label" v-else>{{ node.unitName }}</div>
      </div>
    </div>

    <!-- 子节点容器 -->
    <div class="children-container" v-if="expanded">
      <!-- 加载中提示 -->
      <div v-if="loading && !children.length" class="loading-tip">
        <cube-loading :size="16"></cube-loading>
        <span>加载中...</span>
      </div>

      <!-- 子节点列表 -->
      <mobile-oa-group-node
        v-for="(child, index) in children"
        :key="child.unitId || index"
        :node="child"
        :level="level + 1"
        :keyword="keyword"
        :checked-keys="checkedKeys"
        @check="$emit('check', $event)"
        @toggle="$emit('toggle', $event)"
      ></mobile-oa-group-node>
    </div>
  </div>
</template>

<script>
import { Loading } from 'cube-ui/lib'

export default {
  name: 'MobileOaGroupNode',
  components: {
    CubeLoading: Loading,
    // 递归引用自身组件
    MobileOaGroupNode: () => import('./mobile-oa-group-node.vue')
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    keyword: {
      type: String,
      default: ''
    },
    checkedKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      expanded: false,
      loading: false,
      children: []
    }
  },
  computed: {
    // 是否是叶子节点
    isLeaf() {
      return !this.node.children || this.node.children.length === 0
    },

    // 是否被选中
    isChecked() {
      return this.checkedKeys.includes(this.node.unitId)
    },

    // 是否半选状态（子节点部分选中）
    isIndeterminate() {
      if (this.isLeaf) return false

      const childNodes = this.children.length > 0 ? this.children : this.node.children || []
      if (childNodes.length === 0) return false

      const checkedChildren = childNodes.filter((child) => this.checkedKeys.includes(child.unitId))

      return checkedChildren.length > 0 && checkedChildren.length < childNodes.length
    },

    // 缩进样式
    indentStyle() {
      return {
        paddingLeft: `${this.level * 20 + 16}px`
      }
    },

    // 选中背景样式
    selectionBackgroundStyle() {
      return {
        left: `${this.level * 20}px`
      }
    }
  },
  watch: {
    // 监听节点数据变化，初始化子节点
    'node.children': {
      handler(newChildren) {
        if (newChildren && newChildren.length > 0) {
          this.children = [...newChildren]
        }
      },
      immediate: true
    }
  },
  methods: {
    // 切换展开/收起状态
    toggle() {
      if (this.isLeaf) return

      this.expanded = !this.expanded

      // 通知父组件
      this.$emit('toggle', {
        unitId: this.node.unitId,
        expanded: this.expanded
      })

      // 如果展开且没有加载过子节点，则使用现有的子节点数据
      if (this.expanded && this.children.length === 0 && this.node.children) {
        this.children = [...this.node.children]
      }
    },

    // 处理节点点击
    handleNodeClick() {
      // 移动端点击节点时展开/收起
      if (!this.isLeaf) {
        this.toggle()
      }
    },

    // 处理复选框点击
    handleCheckboxClick() {
      const newChecked = !this.isChecked
      this.$emit('check', {
        node: this.node,
        checked: newChecked,
        checkedNodes: newChecked ? [this.node] : []
      })
    },

    // 高亮关键字
    highlightKeyword(text, keyword) {
      if (!keyword || !text) return text

      const regex = new RegExp(`(${keyword})`, 'gi')
      return text.replace(regex, '<span class="highlight">$1</span>')
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-oa-group-node {
  .node-content {
    position: relative;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.2s ease;
    min-height: 48px; // 确保触摸友好的最小高度

    &:active {
      background-color: #f5f5f5;
    }

    // 选中背景层
    .selection-background {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: #ecf5ff;
      z-index: 0;

      .node-content.node-indeterminate & {
        background-color: #f0f9ff;
      }
    }

    // 内容容器
    .content-wrapper {
      display: flex;
      align-items: center;
      padding: 8px 0;
      position: relative;
      z-index: 1;

      &.has-children {
        font-weight: 500;
      }
    }

    .expand-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 4px;
      border-radius: 6px;
      transition: all 0.2s ease;

      // 增加触摸区域
      &:before {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: transparent;
      }

      &:active {
        background-color: #e6f7ff;
        transform: scale(0.95);
      }

      i {
        font-size: 18px;
        color: #666;
        transition: transform 0.3s ease;

        &.cubeic-select {
          transform: rotate(90deg);
        }
      }
    }

    .placeholder {
      width: 32px;
      height: 32px;
      margin-right: 4px;
    }

    .checkbox-container {
      margin-right: 8px;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.2s ease;
      position: relative;

      // 增加触摸区域
      &:before {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: transparent;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &:active {
        background-color: #e6f7ff;
        transform: scale(0.95);
      }

      .custom-checkbox {
        width: 22px;
        height: 22px;
        border: 2px solid #ddd;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        transition: all 0.2s ease;

        &.checked {
          background-color: #2979ff;
          border-color: #2979ff;

          i {
            color: #fff;
            font-size: 14px;
          }
        }

        &.indeterminate {
          background-color: #2979ff;
          border-color: #2979ff;

          i {
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }

    .node-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;

      i {
        font-size: 16px;
        color: #2979ff;

        &.cubeic-person {
          color: #52c41a;
        }
      }
    }

    .node-label {
      flex: 1;
      font-size: 14px;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #333;

      ::v-deep .highlight {
        color: #ff4d4f;
        background-color: #fff2f0;
        padding: 1px 2px;
        border-radius: 2px;
        font-weight: 500;
      }
    }
  }

  .children-container {
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 35px;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #eee;
      z-index: 1;
    }

    .loading-tip {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 12px 0 12px 48px;
      font-size: 12px;
      color: #999;
      position: relative;
      z-index: 2;

      span {
        margin-left: 8px;
      }
    }
  }
}
</style>
