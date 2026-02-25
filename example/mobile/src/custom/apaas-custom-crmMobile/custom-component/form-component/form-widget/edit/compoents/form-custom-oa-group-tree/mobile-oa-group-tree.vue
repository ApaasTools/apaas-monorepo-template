<template>
  <div class="mobile-oa-group-tree">
    <!-- 搜索框 -->
    <div class="search-box" v-if="showSearch">
      <cube-input 
        v-model="searchKeyword" 
        placeholder="请输入群组名称" 
        clearable
        @input="handleSearch"
      >
        <i slot="append" class="cubeic-search"></i>
      </cube-input>
    </div>
    
    <!-- 树形结构容器 -->
    <div class="tree-container">
      <cube-scroll ref="scroll" :options="scrollOptions" @scroll="handleScroll">
        <!-- 加载中状态 -->
        <div v-if="loading && !treeData.length" class="loading-container">
          <cube-loading></cube-loading>
          <span>加载中...</span>
        </div>
        
        <!-- 树形结构 -->
        <div v-else class="tree-content">
          <!-- 群组节点 -->
          <mobile-oa-group-node 
            v-for="(item, index) in displayTreeData" 
            :key="item.unitId || index"
            :node="item"
            :level="0"
            :keyword="keyword"
            :checked-keys="checkedKeys"
            @check="handleNodeCheck"
            @toggle="handleNodeToggle"
          ></mobile-oa-group-node>
          
          <!-- 无数据提示 -->
          <div v-if="!loading && !treeData.length" class="empty-tip">
            <i class="cubeic-folder"></i>
            <span>暂无群组数据</span>
          </div>
          
          <!-- 加载更多提示 -->
          <div v-if="hasMore && !loading" class="load-more-tip">
            <span>向下滑动加载更多...</span>
          </div>
          
          <!-- 底部加载中 -->
          <div v-if="loadingMore" class="loading-more">
            <cube-loading :size="16"></cube-loading>
            <span>加载更多中...</span>
          </div>
        </div>
      </cube-scroll>
    </div>
    
    <!-- 已选择信息 -->
    <div class="selected-info" v-if="selectedText">
      <div class="selected-text">
        已选择：{{ selectedText }}
      </div>
      <div class="clear-btn" @click="clearSelection">
        <span>清空</span>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { Scroll, Input, Loading } from 'cube-ui/lib'
import MobileOaGroupNode from './mobile-oa-group-node.vue'

export default {
  name: 'MobileOaGroupTree',
  components: {
    CubeScroll: Scroll,
    CubeInput: Input,
    CubeLoading: Loading,
    MobileOaGroupNode
  },
  props: {
    // 是否显示搜索框
    showSearch: {
      type: Boolean,
      default: true
    },
    // 初始选中的节点
    value: {
      type: Array,
      default: () => []
    },
    // 初始关键字
    keyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      treeData: [], // 原始树形数据
      backupsData: [], // 备份数据用于搜索
      displayTreeData: [], // 当前显示的数据（分页）
      searchKeyword: this.keyword, // 搜索关键字
      checkedKeys: [], // 选中的节点ID数组
      selectedNodes: [], // 选中的节点对象数组
      loading: false, // 初始加载状态
      loadingMore: false, // 加载更多状态
      expandedNodes: new Set(), // 已展开的节点ID集合
      pageSize: 50, // 每页显示数量
      currentPage: 1, // 当前页码
      hasMore: true, // 是否还有更多数据
      scrollOptions: {
        scrollbar: true,
        scrollbarFade: true,
        bounce: true,
        momentum: true,
        mouseWheel: true,
        probeType: 3,
        click: true,
        tap: true
      }
    }
  },
  computed: {
    // 已选择文本
    selectedText() {
      if (!this.selectedNodes || this.selectedNodes.length === 0) {
        return ''
      }
      
      const names = this.selectedNodes.map(node => node.unitName)
      if (names.length <= 3) {
        return names.join('，')
      } else {
        return `${names.slice(0, 3).join('，')} 等${names.length}项`
      }
    }
  },
  watch: {
    // 监听value变化，更新选中节点
    value: {
      handler(newVal) {
        if (Array.isArray(newVal)) {
          this.selectedNodes = [...newVal]
          this.checkedKeys = newVal.map(node => node.unitId)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // 创建防抖搜索函数
    this.handleSearch = debounce(this.search, 300)
    
    // 初始加载数据
    this.loadTreeData()
  },
  methods: {
    // 加载树形数据
    loadTreeData() {
      this.loading = true
      
      const domain = window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN || 
                    'http://gateway.yctp.yuchaidev.com/crm-standard-service/'
      
      this.$request({
        url: domain + 'common/getOaGroupTree',
        method: 'GET',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          isAll: true
        }
      })
      .asyncThen(
        (res) => {
          this.backupsData = [...(res.data || [])]
          this.searchData({ searchStr: this.searchKeyword })
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
    
    // 搜索数据
    searchData(params) {
      const keyword = params.searchStr || ''
      this.keyword = keyword
      this.currentPage = 1
      this.hasMore = true
      
      let filteredData = []
      if (keyword) {
        filteredData = this.filterTree(this.backupsData, keyword)
      } else {
        filteredData = [...this.backupsData]
      }
      
      this.treeData = filteredData
      this.setTreeDataPage()
    },
    
    // 搜索
    search() {
      this.searchData({ searchStr: this.searchKeyword })
    },
    
    // 设置分页数据
    setTreeDataPage() {
      const startIndex = 0
      const endIndex = this.currentPage * this.pageSize
      this.displayTreeData = this.treeData.slice(startIndex, endIndex)
      
      // 判断是否还有更多数据
      this.hasMore = endIndex < this.treeData.length
    },
    
    // 处理滚动事件
    handleScroll(pos) {
      const { y } = pos
      const scrollHeight = this.$refs.scroll.scroll.scrollerHeight
      const containerHeight = this.$refs.scroll.scroll.wrapperHeight
      
      // 距离底部50px时加载更多
      if (Math.abs(y) + containerHeight >= scrollHeight - 50) {
        this.loadMore()
      }
    },
    
    // 加载更多数据
    loadMore() {
      if (!this.hasMore || this.loadingMore) return
      
      this.loadingMore = true
      this.currentPage++
      
      setTimeout(() => {
        this.setTreeDataPage()
        this.loadingMore = false
      }, 300)
    },
    
    // 树形查找
    filterTree(arr, keyword, first = true) {
      if (first) {
        arr = JSON.parse(JSON.stringify(arr))
      }
      
      let emptyArr = []
      for (let item of arr) {
        if (item.unitName && item.unitName.includes(keyword)) {
          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            item.children = this.filterTree(item.children, keyword, false)
          }
          emptyArr.push(item)
        } else if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          item.children = this.filterTree(item.children, keyword, false)
          if (item.children.length) {
            emptyArr.push(item)
          }
        }
      }
      return emptyArr
    },
    
    // 处理节点选中
    handleNodeCheck(data) {
      const { node, checked } = data
      
      if (checked) {
        // 添加到选中列表
        if (!this.checkedKeys.includes(node.unitId)) {
          this.checkedKeys.push(node.unitId)
          this.selectedNodes.push(node)
        }
      } else {
        // 从选中列表移除
        const index = this.checkedKeys.indexOf(node.unitId)
        if (index > -1) {
          this.checkedKeys.splice(index, 1)
          const nodeIndex = this.selectedNodes.findIndex(n => n.unitId === node.unitId)
          if (nodeIndex > -1) {
            this.selectedNodes.splice(nodeIndex, 1)
          }
        }
      }
      
      // 触发change事件
      this.$emit('input', [...this.selectedNodes])
      this.$emit('change', [...this.selectedNodes])
    },
    
    // 处理节点展开/收起
    handleNodeToggle(data) {
      if (!data || !data.unitId) return
      
      if (data.expanded) {
        this.expandedNodes.add(data.unitId)
      } else {
        this.expandedNodes.delete(data.unitId)
      }
    },
    
    // 清空选择
    clearSelection() {
      this.checkedKeys = []
      this.selectedNodes = []
      this.$emit('input', [])
      this.$emit('change', [])
    },
    
    // 刷新树
    refresh() {
      this.loadTreeData()
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-oa-group-tree {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  
  .search-box {
    padding: 12px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #eee;
    
    ::v-deep .cube-input {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      
      input {
        height: 40px;
        padding: 0 12px;
        font-size: 14px;
      }
      
      .cube-input-append {
        color: #2979ff;
        padding: 0 12px;
      }
    }
  }
  
  .tree-container {
    flex: 1;
    overflow: hidden;
    position: relative;

    // 优化移动端滚动性能
    ::v-deep .cube-scroll-wrapper {
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }

    .tree-content {
      padding-bottom: 20px;

      // 优化渲染性能
      will-change: transform;
      transform: translateZ(0);
    }
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    
    span {
      margin-top: 10px;
      font-size: 14px;
      color: #999;
    }
  }
  
  .empty-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #999;
    
    i {
      font-size: 32px;
      margin-bottom: 8px;
    }
    
    span {
      font-size: 14px;
    }
  }
  
  .load-more-tip {
    text-align: center;
    padding: 15px 0;
    color: #999;
    font-size: 12px;
  }
  
  .loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
    
    span {
      margin-left: 8px;
      font-size: 12px;
      color: #999;
    }
  }
  
  .selected-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background-color: #f0f9ff;
    border-top: 1px solid #e6f7ff;
    min-height: 60px;

    .selected-text {
      flex: 1;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      margin-right: 12px;
      word-break: break-all;
    }

    .clear-btn {
      padding: 8px 16px;
      background-color: #2979ff;
      color: #fff;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      min-width: 60px;
      text-align: center;
      transition: all 0.2s ease;

      &:active {
        background-color: #1976d2;
        transform: scale(0.95);
      }
    }
  }
}
</style>
