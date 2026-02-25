<template>
  <div class="role-list-mobile">
    <div class="role-panel">
      <!-- 角色搜索 -->
      <div class="search-wrap">
        <cube-input 
          v-model="keyword" 
          placeholder="请输入角色名称" 
          clearable
          @input="keywordChange"
        >
          <i slot="append" class="cubeic-search"></i>
        </cube-input>
      </div>
      
      <!-- 角色列表 -->
      <div class="role-scroll">
        <cube-scroll ref="roleScroll">
          <div class="role-list">
            <template v-if="loading && roleList.length === 0">
              <div class="loading-container">
                <cube-loading></cube-loading>
                <span>加载中...</span>
              </div>
            </template>
            <template v-else-if="showRoleList.length === 0">
              <div class="empty-tip">暂无角色数据</div>
            </template>
            <template v-else>
              <div 
                v-for="role in showRoleList" 
                :key="role.id"
                class="role-item"
                :class="{'active': roleId === role.id}"
                @click="selectRole(role)"
              >
                <div class="role-type-tag">{{ role.roleTypeMeaning }}</div>
                <div class="role-name">{{ role.roleName }}</div>
              </div>
            </template>
          </div>
        </cube-scroll>
      </div>
    </div>
    
    <div class="role-user-panel">
      <!-- 全选选项 -->
      <div class="select-all-bar">
        <cube-checkbox 
          v-model="allChecked"
          :indeterminate="halfChecked"
          @input="allCheckedChange"
        >
          <span class="checkbox-label">全选</span>
        </cube-checkbox>
      </div>
      
      <!-- 用户列表 -->
      <div class="user-scroll">
        <template v-if="!roleId">
          <div class="select-role-tip">请选择左侧角色</div>
        </template>
        <template v-else>
          <cube-scroll ref="userScroll" :options="{pullUpLoad: true}" @pulling-up="userLoad">
            <!-- 加载中提示 -->
            <template v-if="userLoading && personData.length === 0">
              <div class="loading-container">
                <cube-loading></cube-loading>
                <span>加载中...</span>
              </div>
            </template>
            
            <!-- 用户列表 -->
            <template v-else-if="personData.length > 0">
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
              
              <!-- 上拉加载提示 -->
              <div v-if="!hasMore" class="pull-up-tip">
                <span>没有更多数据了</span>
              </div>
            </template>
            
            <!-- 无数据提示 -->
            <template v-else>
              <div class="empty-tip">该角色下暂无人员</div>
            </template>
          </cube-scroll>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading, Input, Checkbox, Scroll } from 'cube-ui/lib'

export default {
  name: 'RoleListMobile',
  components: {
    CubeLoading: Loading,
    CubeInput: Input,
    CubeCheckbox: Checkbox,
    CubeScroll: Scroll
  },
  props: {
    selectedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleList: [],
      showRoleList: [],
      keyword: '',
      personData: [],
      page: 1,
      loading: false,
      userLoading: false,
      roleId: '',
      hasMore: true
    }
  },
  computed: {
    halfChecked() {
      return this.personData.some((i) => !i.checked) && this.personData.some((i) => i.checked)
    },
    allChecked: {
      get() {
        return this.personData.length > 0 && this.personData.every((i) => i.checked)
      },
      set(val) {
        return val
      }
    }
  },
  mounted() {
    this.queryRoleList()
  },
  methods: {
    // 同步选中状态
    synchronousData(arr) {
      if (!arr || !this.personData) return
      
      this.personData.forEach((item) => {
        item.checked = arr.some((i) => i.id === item.id)
      })
      this.personData = [...this.personData]
    },
    
    // 查询角色列表
    queryRoleList() {
      this.loading = true
      return this.$request({
        url: '/xdap-app/user/select/queryRoleList',
        method: 'GET',
        disableSuccessMsg: true,
        disableErrorMsg: true,
        params: {
          appId: window.APaaSSDK?.context?.globalEnv.VUE_APP_APP_ID || '380282099304759296'
        }
      })
      .asyncThen(
        (resp) => {
          this.roleList = resp.table || []
          this.showRoleList = this.roleList
          
          // 自动选择第一个角色
          if (this.showRoleList.length > 0) {
            this.roleId = this.showRoleList[0].id
            this.userLoad()
          }
          
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
    
    // 关键字变化
    keywordChange() {
      this.showRoleList = this.roleList.filter((i) => i.roleName.includes(this.keyword))
      
      if (this.showRoleList.length > 0) {
        // 如果筛选后列表不为空，自动选择第一个角色
        const firstRole = this.showRoleList[0]
        if (this.roleId !== firstRole.id) {
          this.selectRole(firstRole)
        }
      } else {
        // 如果筛选后列表为空，清空人员列表
        this.roleId = ''
        this.personData = []
      }
    },
    
    // 选择角色
    selectRole(role) {
      if (this.roleId === role.id) return
      
      this.roleId = role.id
      this.resetUserList()
      this.userLoad()
    },
    
    // 重置用户列表
    resetUserList() {
      this.personData = []
      this.page = 1
      this.hasMore = true
      
      // 重置滚动位置
      if (this.$refs.userScroll) {
        this.$refs.userScroll.scrollTo(0, 0, 0)
      }
    },
    
    // 加载角色下的用户列表
    userLoad() {
      if (!this.roleId || this.userLoading || !this.hasMore) {
        // 如果没有选择角色或正在加载或没有更多数据，结束加载
        if (this.$refs.userScroll) {
          this.$refs.userScroll.forceUpdate()
        }
        return
      }
      
      this.userLoading = true
      this.$request({
        url: '/xdap-app/user/select/queryUsersByRole',
        method: 'post',
        disableSuccessMsg: true,
        disableErrorMsg: true,
        params: {
          roleId: this.roleId,
          page: this.page,
          pageSize: 20 // 移动端减少每页数量
        }
      })
      .asyncThen(
        (resp) => {
          const newData = resp.table || []
          
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
          
          this.userLoading = false
          
          // 通知滚动组件更新状态
          if (this.$refs.userScroll) {
            this.$refs.userScroll.forceUpdate()
          }
        },
        () => {
          this.userLoading = false
          if (this.$refs.userScroll) {
            this.$refs.userScroll.forceUpdate()
          }
        }
      )
      .asyncErrorCatch(() => {
        this.userLoading = false
        if (this.$refs.userScroll) {
          this.$refs.userScroll.forceUpdate()
        }
      })
    },
    
    // 选择人员
    checkedPerson(person) {
      person.checked = !person.checked
      this.$emit('personChange', person)
    },
    
    // 全选/取消全选
    allCheckedChange(val) {
      this.personData.forEach((i) => {
        i.checked = val
        this.$emit('personChange', i)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.role-list-mobile {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
  
  .role-panel {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 8px;
    border-bottom: 1px solid #eee;
  
    .search-wrap {
      padding-bottom: 10px;
    }
    
    .role-scroll {
      height: 120px;
      border-top: 1px solid #f0f0f0;
      padding-top: 10px;
      
      .role-list {
        .role-item {
          padding: 10px 0;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f8f8f8;
          
          &.active {
            background-color: #f0f9ff;
          }
          
          &:active {
            background-color: #f5f5f5;
          }
          
          .role-type-tag {
            padding: 2px 8px;
            font-size: 12px;
            color: #3370ff;
            background-color: #f2f5ff;
            border: 1px solid #b8c9ff;
            border-radius: 2px;
          }
          
          .role-name {
            margin-left: 10px;
            font-size: 14px;
            color: #333;
            flex: 1;
            @include text-overflow;
          }
        }
      }
    }
  }
  
  .role-user-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .select-all-bar {
      padding: 8px 15px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      
      .checkbox-label {
        font-size: 14px;
        color: #666;
      }
    }
    
    .user-scroll {
      flex: 1;
      overflow: hidden;
      
      .select-role-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #999;
        font-size: 15px;
      }
      
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

@mixin text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 