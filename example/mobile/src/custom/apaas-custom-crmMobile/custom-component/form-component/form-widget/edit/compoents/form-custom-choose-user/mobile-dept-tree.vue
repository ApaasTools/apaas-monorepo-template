<template>
  <div class="mobile-dept-tree">
    <!-- 搜索框 -->
    <div class="search-box" v-if="showSearch">
      <cube-input 
        v-model="searchKeyword" 
        placeholder="请输入部门名称" 
        clearable
        @input="handleSearch"
      >
        <i slot="append" class="cubeic-search"></i>
      </cube-input>
    </div>
    
    <!-- 树形结构容器 -->
    <div class="tree-container">
      <cube-scroll ref="scroll" :options="scrollOptions">
        <!-- 加载中状态 -->
        <div v-if="loading && !treeData.length" class="loading-container">
          <cube-loading></cube-loading>
          <span>加载中...</span>
        </div>
        
        <!-- 树形结构 -->
        <div v-else class="tree-content">
          <!-- 部门节点 -->
          <mobile-dept-node 
            v-for="(item, index) in treeData" 
            :key="item.id || index"
            :node="item"
            :level="0"
            :selected-id="selectedId"
            @select="handleSelect"
            @toggle="handleToggle"
          ></mobile-dept-node>
          
          <!-- 无数据提示 -->
          <div v-if="!loading && !treeData.length" class="empty-tip">
            <span>暂无部门数据</span>
          </div>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { Scroll, Input, Loading } from 'cube-ui/lib'
import MobileDeptNode from './mobile-dept-node.vue'

export default {
  name: 'MobileDeptTree',
  components: {
    CubeScroll: Scroll,
    CubeInput: Input,
    CubeLoading: Loading,
    MobileDeptNode
  },
  props: {
    // 是否显示搜索框
    showSearch: {
      type: Boolean,
      default: true
    },
    // 初始选中的部门ID
    value: {
      type: String,
      default: ''
    },
    // 初始关键字
    keyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      treeData: [], // 树形数据
      searchKeyword: this.keyword, // 搜索关键字
      selectedId: this.value, // 当前选中的部门ID
      loading: false, // 加载状态
      expandedNodes: new Set(), // 已展开的节点ID集合
      scrollOptions: {
        scrollbar: true,
        scrollbarFade: true
      }
    }
  },
  watch: {
    // 监听value变化，更新选中节点
    value(newVal) {
      this.selectedId = newVal
    }
  },
  created() {
    // 创建防抖搜索函数
    this.handleSearch = debounce(this.search, 300)
    
    // 初始加载数据
    this.loadRootNodes()
  },
  methods: {
    // 加载根节点
    loadRootNodes() {
      this.loading = true
      
      this.$request({
        url: '/xdap-app/user/select/queryChildDept',
        method: 'GET',
        disableSuccessMsg: true,
        disableErrorMsg: true,
        params: {
          deptId: '',
          keyword: this.searchKeyword
        }
      })
      .asyncThen(
        (resp) => {
          this.treeData = resp.table || []
          this.loading = false
          
          // 如果有初始选中值，尝试展开到该节点
          if (this.selectedId) {
            this.$nextTick(() => {
              this.expandToNode(this.selectedId)
            })
          } else if (this.treeData.length > 0) {
            // 默认选中第一个节点
            this.handleSelect(this.treeData[0])
          }
        },
        () => {
          this.loading = false
        }
      )
      .asyncErrorCatch(() => {
        this.loading = false
      })
    },
    
    // 搜索
    search() {
      this.loadRootNodes()
    },
    
    // 处理节点选择
    handleSelect(node) {
      if (!node) return
      
      this.selectedId = node.id
      this.$emit('input', node.id)
      this.$emit('select', node)
    },
    
    // 处理节点展开/收起
    handleToggle(data) {
      if (!data || !data.id) return
      
      if (data.expanded) {
        this.expandedNodes.add(data.id)
      } else {
        this.expandedNodes.delete(data.id)
      }
    },
    
    // 展开到指定节点（待实现，需要知道节点的路径）
    expandToNode(nodeId) {
      // 这里需要知道节点的父节点路径，可能需要后端提供API
      console.log('展开到节点:', nodeId)
    },
    
    // 刷新树
    refresh() {
      this.loadRootNodes()
    },
    
    // 重置选择
    reset() {
      this.selectedId = ''
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-dept-tree {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  
  .search-box {
    padding: 12px;
    background-color: #f5f5f5;
    
    ::v-deep .cube-input {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      
      input {
        height: 36px;
        padding: 0 12px;
        font-size: 14px;
      }
      
      .cube-input-append {
        color: #2979ff;
      }
    }
  }
  
  .tree-container {
    flex: 1;
    overflow: hidden;
    
    .tree-content {
      padding-bottom: 20px;
    }
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    
    span {
      margin-top: 10px;
      font-size: 14px;
      color: #999;
    }
  }
  
  .empty-tip {
    text-align: center;
    padding: 30px 0;
    color: #999;
    font-size: 14px;
  }
}
</style> 