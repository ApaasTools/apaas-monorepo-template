import Mock from 'x-lib-mock'

// MockContext.getInstance().init()

const XMock = {
  mockStatus: '', // MOCK_WITH_URL, MOCK_WITH_API_CONFIG(使用脚手架特有的)
  mocks: {},
  mockApis: {},

  successPer: 100,
  bizErrorPer: 0,
  errorPer: 0,

  // 注册需要mock的api，这个
  registerAPI(mocks, mockStatus, apis) {
    this.mocks = mocks
    this.mockStatus = mockStatus
    this.mockApis = apis
  },

  /**
   * 判断url是否需要mock
   * @param {*} requestConfig
   */
  isMock(requestConfig) {
    const isMock = Object.keys(this.mocks).find((mockKey) => {
      // return this.mocks[mockKey].mockConfig.url === requestConfig.url
      return requestConfig.url.includes(this.mocks[mockKey].mockConfig.url)
    })
    return !!isMock
  },

  /**
   * 是否需要随机触发错误, 默认全部成功
   */
  mockErroRandom(successPer, bizErrorPer, errorPer) {
    this.successPer = successPer
    this.bizErrorPer = bizErrorPer
    this.errorPer = errorPer
  },

  /**
   * 注册全局context
   */
  registerGlobolContext(key, value) {
    Mock.MockContext.getInstance().registerGlobalData(key, value)
  },

  /**
   * 注册全局字典
   */
  registerDistContext(key, value) {
    Mock.MockContext.getInstance().registerDistData(key, value)
  },

  /**
   * 生成全局Mock数据
   * @param {*} requestConfig
   */
  generateMockData(requestConfig) {
    // 获取成功，获取失败，获取网络请求失败
    // 从api网络中获取模板
    const mockKey = Object.keys(this.mocks).find((mockKey) => {
      return requestConfig.url.includes(this.mocks[mockKey].mockConfig.url)
    })

    const data = Mock.MockGenerate.getInstance().generateDataByMock({
      data: this.mocks[mockKey].success
    })

    // 生成成功的Mock数据
    const mockData = Mock.MockWrapper.getInstance().wrapperSuccess('data', data)

    return mockData
  },

  registerSuccessGlobalWrapper(wrapper) {
    // Mock.MockGenerate.getInstance()
    Mock.MockWrapper.getInstance().wrapperGlobalSuccess(wrapper)
  },

  registerGlobalBizErrorWrapper(wrapper) {
    Mock.MockWrapper.getInstance().wrapperGlobalBizError(wrapper)
  }
}

export default XMock
