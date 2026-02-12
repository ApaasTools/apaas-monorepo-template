import reportTable from '@/custom/apaas-custom-crmCustomPage/custom-page/components/reportTable.vue'
import repostConfig from '@/custom/apaas-custom-crmCustomPage/custom-page/repost/config'
import { getCustomEnv } from '~/utils/utils.js'
import { trackRequestError } from '~/utils/track.js'

const reportConfigMixin = {
  components: {
    reportTable
  },
  data() {
    return {
      reportType: '',
      reportName: '',
      loading: false,
      chartHeight: 400,
      pagination: {
        pageSize: 30,
        currentPage: 1,
        total: 0
      },
      isAll: false,
      url: ''
    }
  },
  computed: {
    searchConfigs() {
      return repostConfig[this.reportType] ?? []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.chartHeight = this.$refs.chartRef.clientHeight - 185
    })
  },
  methods: {
    switchCondition() {
      this.isAll = !this.isAll
      this.$refs.baseSearchRef.searchFormVisibleEvent(this.isAll)
    },
    reset() {
      this.$refs.baseSearchRef.resetData()
    },
    resetSearch(e) {
      this.searchInfo = e
      this.getChartData()
    },
    handleSearch(e) {
      this.searchInfo = e
      this.getChartData()
    },
    queryChartData() {
      this.pagination.pageSize = 30
      this.pagination.currentPage = 1
      this.$refs.baseSearchRef.handleQuery()
    },
    async getChartData() {
      try {
        this.loading = true
        if (!this.url) {
          //   console.info('BASE_URL.REPORT_URL', BASE_URL.REPORT_URL)
          this.url = `${getCustomEnv('reportDomain')}homePage/${this.reportType}`
        }
        const queryParam = this.$lodash.cloneDeep(this.searchInfo)
        const requestConfig = {
          url: this.url,
          method: 'POST',
          disableErrorMsg: true,
          disableSuccessMsg: true,
          params: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize,
            queryParam
          }
        }
        const [res, err] = trackRequestError(this.$request(requestConfig, false))
        if (err) {
          this.$message.error(err)
          return
        }
        console.info('getChartData', res)
      } finally {
        this.loading = false
      }
    }
  }
}

export default reportConfigMixin
