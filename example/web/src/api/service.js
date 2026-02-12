export default {
  controlRangeCheck: {
    // 校验服务文件
    url: 'business/serviceFile/controlRangeCheck',
    method: 'post',
    disableSuccessMsg: true
  },
  checkOrdSubProcess: {
    url: 'business/serviceOrder/checkOrdSubProcess',
    method: 'get',
    disableSuccessMsg: true
  },
  // 根据服务订单信息查询服务站是否超出授权范围
  queryRangeNew: {
    url: 'md/stationAuthorize/queryRangeNew',
    method: 'post',
    disableSuccessMsg: true
  },
  // 维修/调试单提交前校验
  checkRepairOrCommOrdSubmit: {
    url: 'business/serviceOrder/checkRepairOrCommOrdSubmit',
    method: 'post',
    disableSuccessMsg: true
  },
  // 填写配件销售单位后的提交校验接口
  checkPartsSalesUnit: {
    url: 'business/serviceOrder/checkPartsSalesUnit',
    method: 'post',
    disableSuccessMsg: true
  }

}
