<template>
  <div class="copy-list-mobile">
    <div class="input-panel">
      <cube-textarea 
        v-model="usernames" 
        :placeholder="'请输入名称，用逗号或空格分隔'"
        :maxlength="500"
        :autoExpand="true"
      ></cube-textarea>
      <div class="query-btn">
        <cube-button :primary="true" @click="userLoad('but')">查询复制名称</cube-button>
      </div>
      <div class="notice-tip">
        <i class="cubeic-warn"></i>
        <span>名字与名字之间使用中英文逗号、空格、回车、英文分号、小数点和句号分隔</span>
      </div>
    </div>
    
    <div class="users-panel">
      <div class="panel-header">
        <cube-checkbox 
          v-model="allChecked"
          :indeterminate="halfChecked"
          @input="allCheckedChange"
        >
          <span class="checkbox-label">全选</span>
        </cube-checkbox>
      </div>
      
      <div class="users-content">
        <!-- 查询结果用户列表 -->
        <div class="users-list">
          <h4 class="section-title">查询结果</h4>
          <template v-if="loading">
            <div class="loading-container">
              <cube-loading></cube-loading>
              <span>加载中...</span>
            </div>
          </template>
          <template v-else-if="personData.length === 0">
            <div class="empty-tip">暂无数据</div>
          </template>
          <template v-else>
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
          </template>
        </div>
        
        <!-- 重名用户列表 -->
        <div v-if="repeatPersonData.length > 0" class="repeat-users-list">
          <h4 class="section-title">重名用户</h4>
          <div 
            v-for="item in repeatPersonData" 
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading, Textarea, Button, Checkbox } from 'cube-ui/lib'

export default {
  name: 'CopyListMobile',
  components: {
    CubeLoading: Loading,
    CubeTextarea: Textarea,
    CubeButton: Button,
    CubeCheckbox: Checkbox
  },
  props: {
    selectedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      usernames: '',
      personData: [],
      repeatPersonData: [],
      loading: false
    }
  },
  computed: {
    standardGateway() {
      const url = window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN
      return url || 'http://gateway.yctp.yuchaidev.com/crm-standard-service/'
    },
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
  methods: {
    // 同步选中状态
    synchronousData(arr) {
      if (!arr || !this.personData) return
      
      this.personData.forEach((item) => {
        item.checked = arr.some((i) => i.id === item.id)
      })
      this.personData = [...this.personData]
      
      // 同步重名人员选中状态
      if (this.repeatPersonData.length > 0) {
        this.repeatPersonData.forEach((item) => {
          item.checked = arr.some((i) => i.id === item.id)
        })
        this.repeatPersonData = [...this.repeatPersonData]
      }
    },
    
    // 加载用户数据
    userLoad() {
      if (!this.usernames.trim()) {
        this.$createToast({
          txt: '请输入用户名',
          type: 'warn',
          time: 2000
        }).show()
        return
      }
      
      this.loading = true
      this.$request({
        url: this.standardGateway + '/userDept/query/byUsernames',
        method: 'post',
        disableSuccessMsg: true,
        disableErrorMsg: true,
        params: {
          usernames: this.usernames
        }
      })
      .asyncThen(
        (resp) => {
          const userList = resp.table || []
          
          // 标记已选状态
          userList.forEach((item) => {
            item.checked = this.selectedData.some((i) => i.id === item.id)
          })

          // 处理用户名重复的情况
          let nameArray = userList.map((i) => i.username)
          let repeatNames = this.findDuplicates(nameArray)
          
          // 分离普通用户和重名用户
          this.personData = userList.filter((i) => !repeatNames.includes(i.username))
          this.repeatPersonData = repeatNames.reduce((pre, cur) => {
            const arr = userList.filter((i) => i.username === cur)
            pre = [...pre, ...arr]
            return pre
          }, [])
          
          this.loading = false
          
          // 显示结果提示
          const total = this.personData.length + this.repeatPersonData.length
          this.$createToast({
            txt: `查询到${total}个用户${repeatNames.length > 0 ? `，含${repeatNames.length}个重名` : ''}`,
            type: 'success',
            time: 2000
          }).show()
        },
        () => {
          this.loading = false
          this.$createToast({
            txt: '查询失败',
            type: 'error',
            time: 2000
          }).show()
        }
      )
      .asyncErrorCatch(() => {
        this.loading = false
        this.$createToast({
          txt: '查询出错',
          type: 'error',
          time: 2000
        }).show()
      })
    },
    
    // 查找重复名称
    findDuplicates(arr) {
      let count = {}
      let res = []
      arr.forEach((num) => {
        count[num] = (count[num] || 0) + 1
      })
      for (let num in count) {
        if (count[num] > 1) {
          res.push(num)
        }
      }
      return res
    },
    
    // 选择人员
    checkedPerson(person) {
      person.checked = !person.checked
      this.$emit('personChange', person)
    },
    
    // 全选/取消全选
    allCheckedChange(val) {
      // 处理普通用户列表
      this.personData.forEach((i) => {
        i.checked = val
        this.$emit('personChange', i)
      })
      
      // 处理重名用户列表
      this.repeatPersonData.forEach((i) => {
        i.checked = val
        this.$emit('personChange', i)
      })
    }
  },
  created() {
    // 创建Toast实例的方法
    this.$createToast =
      this.$createToast ||
      function(options) {
        return Toast.$create(options)
      }
  }
}
</script>

<style lang="scss" scoped>
.copy-list-mobile {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
  
  .input-panel {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 10px;
    
    ::v-deep .cube-textarea-wrapper {
      margin-bottom: 15px;
      
      textarea {
        // height: 80px;
        font-size: 14px;
        padding: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }
    
    .query-btn {
      text-align: center;
      margin-bottom: 15px;
      
      ::v-deep .cube-btn {
        width: 100%;
        height: 40px;
        font-size: 15px;
        background-color: #78c6f2;
        border-color: #78c6f2;
      }
    }
    
    .notice-tip {
      display: flex;
      align-items: flex-start;
      font-size: 12px;
      color: #ff6b6b;
      line-height: 1.5;
      
      i {
        margin-right: 5px;
        margin-top: 2px;
        font-size: 14px;
      }
    }
  }
  
  .users-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .panel-header {
      padding: 10px 15px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      
      .checkbox-label {
        font-size: 14px;
        color: #666;
      }
    }
    
    .users-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      
      .section-title {
        margin: 0;
        padding: 10px 15px;
        font-size: 14px;
        color: #666;
        background-color: #f0f0f0;
        font-weight: normal;
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
      
      .person-item {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        background-color: #fff;
        border-bottom: 1px solid #f5f5f5;
        
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
}

@mixin text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
