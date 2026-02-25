export default {
  // 根据组件类型赋值组件的逻辑
  updateLovAssignments(formAssignment, formData, defaultAssoData, widget) {
    // // 获取当前表单字段的值, 此处需要从配置中去取，或者更新时存储当前表单组件类型
    // const specialComponentTypes = [
    //   'FORM_WIDGET_LOV',
    //   'FORM_FILE_UPLOAD',
    //   'FORM_PEOPLE_SELECT',
    //   'FORM_DEPARTMENT_SELECT',
    //   'FORM_ASSOCIATION'
    // ]

    const selectComponentTypes = ['FORM_RADIO_INPUT', 'FORM_SELECT_INPUT', 'FORM_CHECKBOX_INPUT']
    // const generalComponentTypes = []

    let textValue = ''
    if (
      formAssignment.otherFormComponentType === formAssignment.currentFormComponentType &&
      !selectComponentTypes.includes(formAssignment.otherFormComponentType)
    ) {
      // 组件类型相等，且不为选择组件
      defaultAssoData[formAssignment.currentFormComponent] =
        formData[formAssignment.otherFormComponent]
    } else if (
      selectComponentTypes.includes(formAssignment.otherFormComponentType) &&
      selectComponentTypes.includes(formAssignment.currentFormComponentType)
    ) {
      // 组件类型都是选择类组件
      // TODO: 此处需要从他表字段配置中取值，相关配置项需要提供给前端
      const otherFormComponentValue = formData[formAssignment.otherFormComponent]
      const textLabelArray = Array.isArray(otherFormComponentValue)
        ? otherFormComponentValue
          .map((selectItem) => {
            const option =
                formAssignment.otherFormChooseOptions &&
                formAssignment.otherFormChooseOptions.find((option) => {
                  return option.id === selectItem
                })
            if (option) {
              return option.label
            } else {
              return undefined
            }
          })
          .filter((item) => item)
        : []

      let component
      if (this.widget.isInTable) {
        // 根据uuid获取指定组件
        const tableComponent = this.formConfigList.find((config) => {
          return config.componentConfig.uuid === this.widget.tableUuid
        })
        const tableColumn = tableComponent.componentConfig.tableColumn
        component = tableColumn.find((column) => {
          return column.uuid === formAssignment.currentFormComponent
        })
      } else {
        // 根据uuid获取指定组件
        const config = this.formConfigList.find((config) => {
          return config.componentConfig.uuid === formAssignment.currentFormComponent
        })
        component = config && config.componentConfig
      }
      if (!component) {
      } else {
        textValue = textLabelArray
          .map((textLabel) => {
            const option = component.chooseOptions && component.chooseOptions.find((option) => {
              return option.label === textLabel
            })
            if (option) {
              return option.id
            } else {
              return undefined
            }
          })
          .filter((optionId) => optionId)
      }
      defaultAssoData[formAssignment.currentFormComponent] = textValue
    } else {
      // 文本组件赋值
      if (formAssignment.otherFormComponentType === 'FORM_DEPARTMENT_SELECT') {
        const otherFormComponentValue = formData[formAssignment.otherFormComponent]
        textValue = Array.isArray(otherFormComponentValue)
          ? otherFormComponentValue.map((deptItem) => deptItem.name).toString()
          : ''
      } else if (formAssignment.otherFormComponentType === 'FORM_PEOPLE_SELECT') {
        const otherFormComponentValue = formData[formAssignment.otherFormComponent]
        textValue = Array.isArray(otherFormComponentValue)
          ? otherFormComponentValue.map((peopleItem) => peopleItem.username).toString()
          : ''
      } else if (formAssignment.otherFormComponentType === 'FORM_DATA_SELECTOR') {
        const otherFormComponentValue = formData[formAssignment.otherFormComponent]
        textValue = Array.isArray(otherFormComponentValue)
          ? otherFormComponentValue.map((lovItem) => lovItem.name).toString()
          : ''
      } else if (selectComponentTypes.includes(formAssignment.otherFormComponentType)) {
        const otherFormComponentValue = formData[formAssignment.otherFormComponent]
        textValue = Array.isArray(otherFormComponentValue)
          ? otherFormComponentValue
            .map((selectItem) => {
              const option = formAssignment.otherFormChooseOptions && formAssignment.otherFormChooseOptions.find((option) => {
                return option.id === selectItem
              })
              if (option) {
                return option.label
              } else {
                return undefined
              }
            })
            .filter((item) => item)
            .toString()
          : ''
      } else {
        textValue = formData[formAssignment.otherFormComponent]
      }
      defaultAssoData[formAssignment.currentFormComponent] = textValue
    }
  }
}
