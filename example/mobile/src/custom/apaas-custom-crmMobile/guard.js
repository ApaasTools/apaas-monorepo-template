// 全局监听器管理
let globalSaveHandler = null

function checkHasUnsavedChanges() {
  let hasUnsavedChanges = false

  // 检查所有ScoringTable实例是否有更改数据
  if (window.ScoringTableObj && Object.keys(window.ScoringTableObj).length > 0) {
    hasUnsavedChanges = Object.values(window.ScoringTableObj).some((instance) => {
      return instance.hasUnsavedChanges || false
    })
  }

  // 检查所有TotalScoreTable实例是否有更改数据
  if (
    window.TotalScoreTableObj &&
    Object.keys(window.TotalScoreTableObj).length > 0 &&
    !hasUnsavedChanges
  ) {
    hasUnsavedChanges = Object.values(window.TotalScoreTableObj).some((instance) => {
      return instance.hasUnsavedChanges || false
    })
  }
  return hasUnsavedChanges
}

/**
 * 清理全局监听器
 */
function cleanupGlobalSaveHandler() {
  if (globalSaveHandler) {
    document.removeEventListener('SaveOrSubmitSuccess', globalSaveHandler)
    globalSaveHandler = null
  }
}

/**
 * 路由守卫：在离开 formEdit 页面时，检查是否有未保存的数据
 * @param {*} to     目标路由
 * @param {*} from   当前路由
 * @param {*} next   路由守卫回调函数
 * @returns
 */
export function beforeRouteLeave(to, from, next) {
  // 判断是正式机还是测试机, 这是由于测试机和正式机的 formId 不同，所以才需要判断 😡
  const isProd = !location.hostname.includes('qas')
  const formId = isProd ? '6891b02099e94430be35d733' : '6825b5bd53fd7a6c2846f3bf'

  // 成熟度页面需要特殊处理
  //? 判断条件：从 formEdit 页面离开，且 formId 匹配，且目标页面是 formDetail 页面
  if (from.name === 'formEdit' && to.name === 'formDetail' && from.query.formId === formId) {
    // 先清理之前可能存在的监听器
    cleanupGlobalSaveHandler()
    
    let hasUnsavedChanges = checkHasUnsavedChanges()

    // 创建新的监听器函数
    globalSaveHandler = () => {
      console.info("SaveOrSubmitSuccess")
      hasUnsavedChanges = false
    }

    // 添加监听器
    document.addEventListener('SaveOrSubmitSuccess', globalSaveHandler)

    if (hasUnsavedChanges) {
      this.$confirm({
        message: '请检查是否已保存当前表单，确定要离开吗？',
        okConfig: {
          title: '确定',
          onOk: () => {
            // 清理监听器
            cleanupGlobalSaveHandler()
            next(true)
          }
        },
        cancelConfig: {
          title: '取消',
          onCancel: () => {
            // 取消时也清理监听器
            cleanupGlobalSaveHandler()
            next(false)
          }
        }
      })
    } else {
      // 清理监听器
      cleanupGlobalSaveHandler()
      next()
    }
    return
  }
  next()
}
