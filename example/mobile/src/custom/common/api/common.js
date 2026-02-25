import { trackRequestError } from '@/custom/common/utils/track'

/**
 * 获取后台系统的数据字典
 * @param {Vue} vm 当前组件实例
 * @param {string} dictionaryCode 数据字典编码
 * @returns {Promise<[null, Error] | [any, null]>} 数据字典列表
 */
export const getSystemDictionary = async (vm, dictionaryCode) => {
  const requestConfig = {
    method: 'post',
    url: window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.VUE_APP_STANDARD_DOMAIN + 'common/querySysDict',
    params: new Array(dictionaryCode),
    disableSuccessMsg: true,
    disableErrorMsg: true
  }
  return trackRequestError(vm.$request(requestConfig, false))
}

/**
 * 获取crm自定义数据字典
 * @param {*} vm
 * @param {*} customParams
 * @param {*} orders
 * @param {*} conditionOption
 * @returns
 */
export const getCrmCustomDictionary = async (vm, customParams, conditionOption = 'CONTAIN') => {
  let selectorFilterConditionList = Object.entries(customParams).map(([key, value]) => {
    const isArray = Array.isArray(value)
    return {
      uuid: key,
      componentType: 'FORM_TEXT_INPUT',
      conditionOption: isArray ? 'CONTAIN' : conditionOption,
      filterInputs: [
        {
          filterParams: [
            {
              filterType: 'COMMON',
              filterComponentUuid: '',
              filterComponentType: '',
              filterValue: isArray ? '' : value,
              queryValueList: isArray ? value : [],
              filterValueType: '',
              filterDisplayValue: {},
              searchBoxContentType: isArray ? 'MULTILINE_QUERY' : 'SINGLE_QUERY'
            }
          ],
          order: 0
        }
      ],
      connector: 'AND'
    }
  })
  const requestConfig = {
    url: `/custom/business/listPageBusinessData`,
    method: 'POST',
    disableErrorMsg: true,
    disableSuccessMsg: true,
    params: {
      tabId: '65712bdc77d2411e4cbb5b0c',
      formId: '65712bdc77d2411e4cbb5b0a',
      page: 1, // 当前页
      pageSize: 9999, // 每页条数
      selectorFilterConditionList, // 筛选条件
      filterConditionGroup: [], // 过滤条件
      ...customParams
      //   orders: orders // 排序
    }
  }
  return trackRequestError(vm.$request(requestConfig, false))
}
