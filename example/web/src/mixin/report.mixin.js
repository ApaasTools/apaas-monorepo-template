/*
 * @Description: junfa
 * @Author: junfa
 * @Date: 2024-07-08 09:15:25
 * @FilePath: \apaas-custom-enginecode\src\mixin\report.mixin.js
 * @LastEditors: junfa
 * @LastEditTime: 2024-08-26 16:10:26
 */
import { getMenuByCustom, objectDeep } from '@/utils/apaas.js'
import reportTable from '@/custom/apaas-custom-crmCustomPage/custom-page/components/reportTable.vue'
import repostConfig from '@/custom/apaas-custom-crmCustomPage/custom-page/repost/config'
import SortButton from '@/custom/apaas-custom-crmCustomPage/custom-page/components/SortButton.vue'

const reportConfigMixin = {
  components: {
    reportTable,
    SortButton
  },
  data() {
    return {
      reportType: '',
      reportName: '',
      loading: false,
      tableLoading: false,
      tableColumns: [],
      tableData: [],
      tableHeight: 400,
      pagination: {
        pageSize: 30,
        currentPage: 1,
        total: 0
      },
      isAll: true,
      url: '',
      tableKey: 0,
      allColumnLength: 0
    }
  },
  props: {},
  inject: ['renderGlobal'],
  computed: {
    reportDomain() {
      return (
        window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.reportDomain ||
        'http://gateway.yctp.yuchaiqas.com/crm-report-service/'
      )
    },
    searchConfigs() {
      console.log(repostConfig)
      if (this.reportType) {
        return repostConfig[this.reportType]
      } else {
        return []
      }
    }
  },
  watch: {
    tableColumns: {
      handler() {
        console.log('watch', this.tableColumns)
        this.tableKey = Math.random()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableComponent.clientHeight - 185
    })
  },
  destroyed() {},
  methods: {
    // 请求表头
    getTableColumns() {
      return new Promise((resolve, reject) => {
        this.$request({
          url: `${this.reportDomain}/report/common/header/get`,
          method: 'GET',
          disableErrorMsg: true,
          disableSuccessMsg: true,
          params: {
            type: this.reportType
          }
        }).asyncThen(
          (res) => {
            const arr = res.data.filter((i) => i.isShow)
            arr.unshift({
              type: '',
              prop: 'index',
              label: '序号',
              width: '60',
              customSlot: 'index',
              align: 'center',
              // 是不是显示
              displayFlag: true,
              // 是不是隐藏
              fixedType: 'left'
            })
            this.allColumnLength = arr.length
            resolve(arr)
          },
          () => {
            resolve([])
          }
        )
      })
    },
    switchCondition() {
      this.isAll = !this.isAll
      this.$refs.baseSearchRef.searchFormVisibleEvent(this.isAll)
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      if (this.tableData.length < this.pagination.pageSize) {
        this.$message({
          type: 'warning',
          message: '已经是最后一页'
        })
      }
      this.pagination.currentPage = val
      this.getTableData()
    },
    reset() {
      this.$refs.baseSearchRef.resetData()
    },
    resetSearch(e) {
      this.searchInfo = e
      this.getTableData()
    },
    handleSearch(e) {
      this.searchInfo = e
      this.getTableData()
    },
    queryTableData() {
      this.pagination.pageSize = 30
      this.pagination.currentPage = 1
      this.$refs.baseSearchRef.handleQuery()
    },
    getTableData() {
      this.tableLoading = true
      let queryParam = objectDeep(this.searchInfo)
      if (!this.url) {
        this.url = `/report/query/${this.reportType}`
      }
      // console.log('getTableData ===> ', queryParam)

      // 处理查询参数
      if (this.formatQueryParam) {
        queryParam = this.formatQueryParam(queryParam)
      }

      this.$request({
        url: `${this.reportDomain}${this.url}`,
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          pageNum: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          queryParam: queryParam
        }
      })
        .asyncThen(
          (res) => {
            if (this.reportType === 'inletSummaryReport') {
              this.tableColumns = res.data || []
            }
            this.tableData = res.table || []
            this.pagination.total = res.total
            this.tableLoading = false
          },
          () => {
            this.tableLoading = false
          }
        )
        .asyncErrorCatch(() => {
          this.tableLoading = false
        })
    },
    // 导出表格数据
    exportTableData() {
      this.loading = true
      let queryParam = objectDeep(this.searchInfo)
      this.$request({
        url: `${this.reportDomain}/report/export`,
        method: 'POST',
        disableSuccessMsg: true,
        params: {
          queryParam,
          fileName: `${this.reportName}.xlsx`,
          fromName: this.reportType,
          columnlists: this.allColumnLength === this.tableColumns.length ? [] : this.tableColumns
        }
      }).asyncThen(
        (resp) => {
          this.$message({
            type: 'success',
            message: '附件正在生成中，3s后自动跳转下载附件界面自行下载。'
          })
          setTimeout(() => {
            const menuData = getMenuByCustom('formId', '665d30871ad39438e2cd7313')
            window.APaaSSDK.context.globalVueContext.$router.push(
              `/${window.APaaSSDK.context.globalEnv.VUE_APP_TENANT_ID}/app/app-page?appId=${menuData.appId}&formId=${menuData.formId}&title=服务文件&currentMenu=${menuData.id}`
            )
          }, 3000)
          this.loading = false
        },
        () => {
          this.loading = false
        }
      )
    },
    updateColConfigs(cols) {
      this.tableColumns = cols.filter((item) => item.checked)
      this.tableKey = Math.random()
    }
  }
}

export default reportConfigMixin
