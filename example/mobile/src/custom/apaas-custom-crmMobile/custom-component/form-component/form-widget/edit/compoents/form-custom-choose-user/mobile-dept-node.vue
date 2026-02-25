<template>
  <div class="dept-node">
    <!-- 节点内容 -->
    <div
      class="node-content"
      :class="{ selected: isSelected, 'has-children': !isLeaf }"
      :style="indentStyle"
      @click="select"
    >
      <!-- 展开/收起图标 -->
      <div class="expand-icon" @click.stop="toggle" v-if="!isLeaf">
        <i :class="expanded ? 'cubeic-select' : 'cubeic-arrow'"></i>
      </div>
      <div class="placeholder" v-else></div>

      <!-- 节点图标 -->
      <div class="node-icon">
        <i class="cubeic-folder" v-if="!isLeaf"></i>
        <i class="cubeic-document" v-else></i>
      </div>

      <!-- 节点名称 -->
      <div class="node-label">{{ node.name }}</div>
    </div>

    <!-- 子节点容器 -->
    <div class="children-container" v-if="expanded">
      <!-- 加载中提示 -->
      <div v-if="loading && !children.length" class="loading-tip">
        <cube-loading :size="16"></cube-loading>
        <span>加载中...</span>
      </div>

      <!-- 子节点列表 -->
      <mobile-dept-node
        v-for="(child, index) in children"
        :key="child.id || index"
        :node="child"
        :level="level + 1"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
      ></mobile-dept-node>
    </div>
  </div>
</template>

<script>
import { Loading } from 'cube-ui/lib'

export default {
  name: 'MobileDeptNode',
  components: {
    CubeLoading: Loading,
    // 递归引用自身组件
    MobileDeptNode: () => import('./mobile-dept-node.vue')
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
    selectedId: {
      type: String,
      default: ''
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
      return this.node.leafNodeFlag === true
    },

    // 是否有子节点
    hasChildren() {
      return this.children && this.children.length > 0
    },

    // 是否被选中
    isSelected() {
      return this.selectedId === this.node.id
    },

    // 缩进样式
    indentStyle() {
      return {
        paddingLeft: `${this.level * 16 + 16}px`
      }
    }
  },
  methods: {
    // 切换展开/收起状态
    toggle() {
      if (this.isLeaf) return

      this.expanded = !this.expanded

      // 通知父组件
      this.$emit('toggle', {
        id: this.node.id,
        expanded: this.expanded
      })

      // 如果展开且没有加载过子节点，则加载子节点
      if (this.expanded && !this.children.length) {
        this.loadChildren()
      }
    },

    // 加载子节点
    loadChildren() {
      if (this.loading || this.isLeaf) return

      this.loading = true

      this.$request({
        url: '/xdap-app/user/select/queryChildDept',
        method: 'GET',
        disableSuccessMsg: true,
        disableErrorMsg: true,
        params: {
          deptId: this.node.id,
          keyword: ''
        }
      })
        .asyncThen(
          (resp) => {
            this.children = resp.table || []
            this.loading = false
          },
          () => {
            this.loading = false
          }
        )
        .asyncErrorCatch(() => {
          this.loading = false
        })
    },

    // 选择节点
    select() {
      this.$emit('select', this.node)
    }
  }
}
</script>

<style lang="scss" scoped>
.dept-node {
  .node-content {
    display: flex;
    align-items: center;
    padding: 6px 0;
    position: relative;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.2s ease;

    &.selected {
      color: #2979ff;
      background-color: #ecf5ff;
      font-weight: 500;
    }

    &:active {
      background-color: #f5f5f5;
    }

    &.has-children {
      font-weight: 500;
    }

    .expand-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 4px;

      i {
        font-size: 16px;
        color: #666;
        transition: transform 0.3s;
      }
    }

    .placeholder {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }

    .node-icon {
      // width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-right: 8px;

      i {
        font-size: 16px;
        color: #2979ff;

        &.cubeic-document {
          color: #78c6f2;
        }
      }
    }

    .node-label {
      flex: 1;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .children-container {
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 27px;
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
      padding: 10px 0 10px 40px;
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
