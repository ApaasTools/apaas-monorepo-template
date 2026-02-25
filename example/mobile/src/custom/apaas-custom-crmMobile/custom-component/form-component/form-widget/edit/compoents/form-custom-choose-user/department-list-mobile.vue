<template>
  <div class="department-list-mobile">
    <!-- 部门树容器 -->
    <div class="dept-tree-container">
      <mobile-dept-tree
        ref="deptTree"
        v-model="deptId"
        :keyword="keyword"
        :show-search="true"
        @select="handleDeptSelect"
      ></mobile-dept-tree>
    </div>
    
    <!-- 分割线 -->
    <div class="divider"></div>
    
    <!-- 部门用户容器 -->
    <div class="dept-user-container">
      <!-- 部门用户选项 -->
      <div class="dept-user-options">
        <div class="include-sub">
          <cube-checkbox v-model="showSubordinate" @input="showSubordinateChange">
            <span class="checkbox-label">显示下级部门员工</span>
          </cube-checkbox>
        </div>
        <div class="select-all">
          <cube-checkbox 
            v-model="allChecked"
            :indeterminate="halfChecked"
            @input="allCheckedChange"
          >
            <span class="checkbox-label">全选</span>
          </cube-checkbox>
        </div>
      </div>
      
      <!-- 用户列表 -->
      <div class="user-list">
        <cube-scroll 
          ref="userScroll" 
          :options="scrollOptions"
          @pulling-up="userLoad"
        >
          <!-- 加载中提示 -->
          <div v-if="loading && personData.length === 0" class="loading-container">
            <cube-loading></cube-loading>
            <span>加载中...</span>
          </div>
          
          <!-- 用户列表 -->
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
          
          <!-- 无数据提示 -->
          <div v-if="personData.length === 0 && !loading" class="empty-tip">
            <span>暂无人员数据</span>
          </div>
          
          <!-- 上拉加载提示 -->
          <div v-if="!hasMore && personData.length > 0" class="pull-up-tip">
            <span>没有更多数据了</span>
          </div>
        </cube-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox, Loading, Scroll } from 'cube-ui/lib'
import MobileDeptTree from './mobile-dept-tree.vue'

export default {
  name: 'DepartmentListMobile',
  components: {
    CubeCheckbox: Checkbox,
    CubeLoading: Loading,
    CubeScroll: Scroll,
    MobileDeptTree
  },
  props: {
    selectedData: {
      type: Array,
      default: () => []
    },
    keyWord: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: this.keyWord,
      personData: [],
      deptId: '',
      showSubordinate: false,
      loading: false,
      page: 1,
      hasMore: true,
      scrollOptions: {
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多数据了'
      }
    }
  },
  computed: {
    halfChecked() {
      return this.personData.some(i => !i.checked) && this.personData.some(i => i.checked)
    },
    allChecked: {
      get() {
        return this.personData.length > 0 && this.personData.every(i => i.checked)
      },
      set(val) {
        return val
      }
    }
  },
  methods: {
    // 处理部门选择
    handleDeptSelect(dept) {
      if (!dept || !dept.id) return
      
      this.resetUserList()
      this.userLoad()
    },
    
    // 重置用户列表
    resetUserList() {
      this.personData = []
      this.page = 1
      this.hasMore = true
      
      if (this.$refs.userScroll) {
        this.$refs.userScroll.scrollTo(0, 0, 0)
        this.$refs.userScroll.forceUpdate(true)
      }
    },
    
    // 显示下级部门员工变化
    showSubordinateChange() {
      this.resetUserList()
      this.userLoad()
    },
    
    // 加载用户数据
    userLoad() {
      if (this.loading || !this.deptId || !this.hasMore) return
      
      this.loading = true
      
      this.$request({
        url: '/xdap-app/user/select/queryUsersByDept',
        method: 'post',
        disableSuccessMsg: true,
        disableErrorMsg: true,
        params: {
          deptId: this.deptId,
          includeSubdepartments: this.showSubordinate,
          page: this.page,
          pageSize: 20
        }
      })
      .asyncThen(
        (resp) => {
          if (resp.table && resp.table.length > 0) {
            // 标记选中状态
            resp.table.forEach(item => {
              if (item) {
                item.checked = this.selectedData.some(i => i && i.id === item.id)
              }
            })
            
            // 追加数据
            this.personData = [...this.personData, ...resp.table]
            
            // 判断是否有更多数据
            if (resp.table.length < 20) {
              this.hasMore = false
            } else {
              this.page++
            }
          } else {
            this.hasMore = false
          }
          
          this.loading = false
          
          // 更新滚动组件
          if (this.$refs.userScroll) {
            this.$nextTick(() => {
              this.$refs.userScroll.forceUpdate(true)
            })
          }
        },
        () => {
          this.loading = false
          if (this.$refs.userScroll) {
            this.$nextTick(() => {
              this.$refs.userScroll.forceUpdate(true)
            })
          }
        }
      )
      .asyncErrorCatch(() => {
        this.loading = false
        if (this.$refs.userScroll) {
          this.$nextTick(() => {
            this.$refs.userScroll.forceUpdate(true)
          })
        }
      })
    },
    
    // 同步选中数据
    synchronousData(arr) {
      if (!arr) arr = []
      
      this.personData.forEach(item => {
        item.checked = arr.some(i => i && i.id === item.id)
      })
      
      this.personData = [...this.personData]
    },
    
    // 选中/取消选中人员
    checkedPerson(person) {
      person.checked = !person.checked
      this.$emit('personChange', person)
    },
    
    // 全选/取消全选
    allCheckedChange(val) {
      if (!this.personData || this.personData.length === 0) return
      
      this.personData.forEach(item => {
        if (item && item.checked !== val) {
          item.checked = val
          this.$emit('personChange', item)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-list-mobile {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  
  .dept-tree-container {
    height: 280px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin: 8px;
    overflow: hidden;
  }
  
  .divider {
    height: 1px;
    background-color: #f0f0f0;
    margin: 0 8px;
  }
  
  .dept-user-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 8px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    
    .dept-user-options {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #f5f5f5;
      
      .checkbox-label {
        font-size: 14px;
        color: #666;
      }
      
      ::v-deep .cube-checkbox {
        .cube-checkbox-wrap {
          padding: 0;
        }
      }
    }
    
    .user-list {
      flex: 1;
      overflow: hidden;
      
      .person-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #f5f5f5;
        position: relative;
        
        &:active {
          background-color: #f9f9f9;
        }
        
        &.selected {
          background-color: #f0f7ff;
        }
        
        .person-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #2979ff;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          margin-right: 12px;
          flex-shrink: 0;
        }
        
        .person-info {
          flex: 1;
          overflow: hidden;
          
          .person-name {
            font-size: 15px;
            color: #333;
            margin-bottom: 2px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .person-account {
            font-size: 13px;
            color: #999;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .person-dept {
            font-size: 12px;
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
            background-color: #2979ff;
            border-color: #2979ff;
            color: #fff;
          }
          
          i {
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    color: #999;
    
    span {
      margin-top: 8px;
      font-size: 13px;
    }
  }
  
  .empty-tip {
    text-align: center;
    padding: 20px 0;
    color: #999;
    font-size: 14px;
  }
  
  .pull-up-tip {
    text-align: center;
    padding: 15px 0;
    color: #999;
    font-size: 14px;
  }
}
</style> 