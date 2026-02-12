<!--
 * @Description:
 * @Author: junfa
 * @Date: 2024-03-09 18:24:15
 * @FilePath: \apaas-custom-enginecode\src\components\createServiceOrder.vue
 * @LastEditors: junfa
 * @LastEditTime: 2024-03-27 10:47:25
-->
<template>
  <div class="createServiceOrder">
    <x-modal
      title="请选择服务订单类型"
      :okConfig="okConfig"
      :modalVisible="dialogVisible"
      width="400"
      :customModalBg="true"
      :cancelConfig="cancelConfig"
      :closeConfig="closeConfig"
    >
      <el-form
        ref="processForm"
        :label-position="'top'"
        label-width="80px"
        :rules="rules"
        :model="processForm"
      >
        <el-form-item label="单据类型" prop="processType">
          <el-select
            v-model="processForm.processType"
            filterable
            clearable
            placeholder="请选择单据类型"
            @change="handleProcessTypeChange"
          >
            <el-option
              v-for="item in options"
              :key="item.optionCode"
              :label="`${item.optionCode}/${item.optionName}`"
              :value="item.optionCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据编码">
          <el-input v-model="processForm.processType" disabled></el-input>
        </el-form-item>
      </el-form>
    </x-modal>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      okConfig: {
        onOk: () => {
          this.confirmCreateProcess()
        },
        title: '确认'
      },
      cancelConfig: {
        onCancel: () => {
          this.dialogVisible = false
        },
        title: '取消'
      },
      closeConfig: {
        onClose: () => {
          this.dialogVisible = false
        }
      },
      rules: {
        processType: [{ required: true, message: '请选择单据类型', trigger: 'blur' }]
      },
      processForm: {
        processType: null,
        processTypeName: null
      },
      options: []
    }
  },
  created() {
    this.newDataSelectorDataAsync()
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
      this.processForm = {
        processType: null,
        processTypeName: null
      }
    },
    confirmCreateProcess() {
      this.$refs.processForm.validate((valid) => {
        if (!valid) {
          this.$message.error('请检查表单')
          return
        }
        this.$emit('confirmCreateProcess', this.processForm)
        this.dialogVisible = false
        this.$nextTick(() => {
          window.open(
            `${window.GLOBAL_ENV.VUE_APP_PUBLIC_PATH}external-form-page/external-custom-page?customPath=apaas-custom-serviceOrderDetails&processType=${this.processForm.processType}&processTypeName=${this.processForm.processTypeName}`
          )
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleOpen() {
      this.newDataSelectorDataAsync()
    },
    handleProcessTypeChange(event) {
      this.processForm.processTypeName = this.options.find(
        (item) => item.optionCode === event
      ).optionName
    },
    newDataSelectorDataAsync() {
      const requestConfig = {
        url: `/custom/business/listPageBusinessData`,
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {}
      }
      requestConfig.params = {
        tabId: '65712bdc77d2411e4cbb5b0c',
        formId: '65712bdc77d2411e4cbb5b0a',
        page: 1,
        pageSize: 99,
        selectorFilterConditionList: [
          {
            uuid: 'dictionaryCode',
            componentType: 'FORM_TEXT_INPUT',
            conditionOption: 'CONTAIN',
            filterInputs: [
              {
                filterParams: [
                  {
                    filterType: 'COMMON',
                    filterComponentUuid: '',
                    filterComponentType: '',
                    filterValue: 'CRM_DOC_TYPE',
                    filterValueType: '',
                    filterDisplayValue: {},
                    searchBoxContentType: 'SINGLE_QUERY',
                    queryValueList: []
                  }
                ],
                order: 0
              }
            ],
            connector: 'AND'
          },
          {
            uuid: 'backupField1',
            componentType: 'FORM_TEXT_INPUT',
            conditionOption: 'CONTAIN',
            filterInputs: [
              {
                filterParams: [
                  {
                    filterType: 'COMMON',
                    filterComponentUuid: '',
                    filterComponentType: '',
                    filterValue: 'A2',
                    filterValueType: '',
                    filterDisplayValue: {},
                    searchBoxContentType: 'SINGLE_QUERY',
                    queryValueList: []
                  }
                ],
                order: 0
              }
            ],
            connector: 'AND'
          }
        ],
        filterConditionGroup: [],
        orders: []
      }
      this.$request(requestConfig).asyncThen((res) => {
        this.options = res.table
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
