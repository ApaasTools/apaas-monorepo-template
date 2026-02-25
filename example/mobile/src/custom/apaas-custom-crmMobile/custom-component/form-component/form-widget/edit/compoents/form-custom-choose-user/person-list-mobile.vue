<template>
  <div class="person-list-mobile">
    <div class="persons-container" ref="scrollWrapper" @scroll="handleScroll">
      <!-- 加载中提示 -->
      <div v-if="loading && personData.length === 0" class="loading-container">
        <cube-loading></cube-loading>
        <span>加载中...</span>
      </div>
      
      <!-- 用户列表 -->
      <div class="person-list-content">
        <div 
          v-for="item in personData" 
          :key="item.id" 
          class="person-item"
          :class="{'selected': item.checked}"
          @click="checkedPerson(item)"
        >
          <div class="person-avatar">
            <span>{{ item.username ? item.username.substr(0, 1) : '用' }}</span>
          </div>
          <div class="person-info">
            <div class="person-name">{{ item.username }}</div>
            <div class="person-account">{{ item.account }}</div>
            <div class="person-dept">{{ item.deptName }}</div>
          </div>
          <div class="checkbox" :class="{'checked': item.checked}">
            <i v-if="item.checked" class="cubeic-right"></i>
          </div>
        </div>
        
        <!-- 底部加载状态 -->
        <div class="pull-up-container" v-if="personData.length > 0">
          <div v-if="loading" class="loading-more">
            <cube-loading :size="18"></cube-loading>
            <span>加载中...</span>
          </div>
          <div v-else-if="!hasMore" class="no-more">
            <span>没有更多数据了</span>
          </div>
          <div v-else class="load-more" @click="onPullUp">
            <span>点击加载更多</span>
          </div>
        </div>
        
        <!-- 无数据提示 -->
        <div v-if="personData.length === 0 && !loading" class="no-data">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from 'cube-ui/lib'

export default {
  name: 'PersonListMobile',
  components: {
    CubeLoading: Loading
  },
  props: {
    keyWord: {
      type: String,
      default: ''
    },
    selectedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      personData: [],
      page: 1,
      loading: false,
      hasMore: true,
      scrollThreshold: 30, // 滚动触发阈值
      lastScrollTop: 0, // 记录上次滚动位置
      isScrollingDown: false // 是否正在向下滚动
    }
  },
  watch: {
    keyWord() {
      // 关键字变化时重置数据
      this.reset()
      this.userLoad()
    }
  },
  mounted() {
    this.userLoad()
  },
  methods: {
    reset() {
      this.personData = []
      this.page = 1
      this.hasMore = true
      this.lastScrollTop = 0
      this.isScrollingDown = false
    },
    
    synchronousData(arr) {
      if (!arr || !this.personData) return
      
      this.personData.forEach((item) => {
        item.checked = arr.some((i) => i.id === item.id)
      })
      this.personData = [...this.personData]
    },
    
    // 处理滚动事件，检测是否需要加载更多
    handleScroll(e) {
      if (this.loading || !this.hasMore) return
      
      const scrollEl = this.$refs.scrollWrapper
      if (!scrollEl) return
      
      // 检查是否正在向下滚动
      const currentScrollTop = scrollEl.scrollTop
      this.isScrollingDown = currentScrollTop > this.lastScrollTop
      this.lastScrollTop = currentScrollTop
      
      // 只有在向下滚动时才检查是否需要加载更多
      if (!this.isScrollingDown) return
      
      // 计算滚动距离底部的距离
      const scrollDistance = scrollEl.scrollHeight - currentScrollTop - scrollEl.clientHeight
      
      // 当距离底部小于阈值时，触发加载更多
      if (scrollDistance < this.scrollThreshold && this.isScrollingDown) {
        this.onPullUp()
      }
    },
    
    // 上拉加载更多
    onPullUp() {
      if (this.loading || !this.hasMore) return
      
      // 加载数据
      this.userLoad()
    },
    
    // 用户选择
    userLoad() {
      if (this.loading || !this.hasMore) return
      
      this.loading = true
      
      // 打印日志帮助调试
      console.log('正在加载更多数据，当前页码：', this.page)
      
      this.$request({
        url: '/xdap-app/user/select/queryAllUsers',
        method: 'post',
        disableSuccessMsg: true,
        disableErrorMsg: true,
        params: {
          keyWord: this.keyWord,
          page: this.page,
          pageSize: 20 // 移动端减少每页数量
        }
      }).asyncThen(
        (resp) => {
          const newData = resp.table || []
          
          // 打印日志帮助调试
          console.log('加载到新数据：', newData.length)
          
          // 标记已选状态
          newData.forEach((item) => {
            item.checked = this.selectedData.some((i) => i.id === item.id)
          })
          
          this.personData = [...this.personData, ...newData]
          
          // 判断是否还有更多数据
          if (newData.length < 20) {
            this.hasMore = false
          } else {
            ++this.page
          }
          
          this.loading = false
        },
        (err) => {
          console.error('加载失败:', err)
          this.loading = false
          this.hasMore = false
        }
      ).asyncErrorCatch((err) => {
        console.error('加载异常:', err)
        this.loading = false
        this.hasMore = false
      })
    },
    
    // 选择人员
    checkedPerson(person) {
      person.checked = !person.checked
      this.$emit('personChange', person)
    }
  }
}
</script>

<style lang="scss" scoped>
.person-list-mobile {
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;

  .persons-container {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 80px;
    touch-action: pan-y; // 允许垂直平移
    user-select: none; // 防止文本选择干扰滚动
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    
    span {
      margin-top: 10px;
      font-size: 14px;
      color: #999;
    }
  }
  
  .person-list-content {
    padding: 0 0 20px;
    
    .person-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background-color: #fff;
      margin-bottom: 1px;
      position: relative;
      
      &.selected {
        background-color: #f0f9ff;
      }
      
      &:active {
        background-color: #f2f2f2;
      }
      
      .person-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #78c6f2;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
      }
      
      .person-info {
        flex: 1;
        margin-left: 12px;
        overflow: hidden;
        
        .person-name {
          font-size: 15px;
          color: #333;
          margin-bottom: 2px;
          font-weight: 500;
          @include text-overflow;
        }
        
        .person-account {
          font-size: 13px;
          color: #999;
          margin-bottom: 2px;
          @include text-overflow;
        }
        
        .person-dept {
          font-size: 12px;
          color: #999;
          @include text-overflow;
        }
      }
      
      .checkbox {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        margin-left: 10px;
        
        &.checked {
          border-color: #78c6f2;
          color: #78c6f2;
        }
        
        i {
          font-size: 14px;
        }
      }
    }
  }
  
  .pull-up-container {
    padding: 15px 0;
    text-align: center;
    
    .loading-more,
    .no-more,
    .load-more {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 13px;
      
      span {
        margin-left: 8px;
      }
    }
    
    .load-more {
      color: #78c6f2;
      cursor: pointer;
      padding: 8px 0;
      
      &:active {
        opacity: 0.8;
      }
      
      span {
        margin-left: 0;
      }
    }
  }
  
  .no-data {
    text-align: center;
    padding: 30px 0;
    color: #999;
    font-size: 14px;
  }
}

@mixin text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 