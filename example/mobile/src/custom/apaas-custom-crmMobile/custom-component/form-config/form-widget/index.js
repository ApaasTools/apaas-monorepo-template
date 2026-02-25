const homejs = require.context('../../form-component/form-widget/edit/compoents', false, /\.vue$/)

const widgetConfigList = homejs.keys().map((page) => {
  const current = homejs(page).default
  return {
    version: 2.0,
    code: current.name,
    component: {
      edit: current.name,
      read: current.name
    }
  }
})

console.log('widgetConfigList', widgetConfigList)

export default widgetConfigList
