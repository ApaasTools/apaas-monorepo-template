<!--
 * @Author: junfa
 * @Date: 2023-12-26
 * @LastEditTime: 2023-12-26
 * @Description: 物料/供应商选择组件示例页面
-->
<template>
  <div class="material-supplier-demo">
    <cube-scroll class="scroll-wrapper">
      <div class="page-title">物料/供应商选择组件示例</div>
      
      <!-- 表单示例 -->
      <div class="form-container">
        <!-- 物料选择 -->
        <div class="section-title">物料选择</div>
        <FORM_CUSTOM_MATERIAL_SUPPLIER_SELECTOR
          ref="materialSelector"
          :widget="{
            label: '物料名称',
            prop: 'material_name',
            isView: false,
            readOnly: false
          }"
        ></FORM_CUSTOM_MATERIAL_SUPPLIER_SELECTOR>
        
        <!-- 供应商选择 -->
        <div class="section-title">供应商选择</div>
        <FORM_CUSTOM_MATERIAL_SUPPLIER_SELECTOR
          ref="supplierSelector"
          :widget="{
            label: '供应商名称',
            prop: 'supplier_name',
            isView: false,
            readOnly: false
          }"
        ></FORM_CUSTOM_MATERIAL_SUPPLIER_SELECTOR>
        
        <!-- 只读状态示例 -->
        <div class="section-title">只读状态</div>
        <FORM_CUSTOM_MATERIAL_SUPPLIER_SELECTOR
          :widget="{
            label: '物料名称(只读)',
            prop: 'material_name_readonly',
            isView: false,
            readOnly: true
          }"
        ></FORM_CUSTOM_MATERIAL_SUPPLIER_SELECTOR>
      </div>
      
      <!-- 结果展示 -->
      <div class="result-container" v-if="selectedData">
        <div class="section-title">选择结果</div>
        <div class="result-content">
          <pre>{{ JSON.stringify(selectedData, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 测试按钮 -->
      <div class="button-container">
        <cube-button :primary="true" @click="testGetValue">获取选中值</cube-button>
      </div>
    </cube-scroll>
  </div>
</template>

<script>
export default {
  name: 'material-supplier-demo',
  data() {
    return {
      selectedData: null
    }
  },
  created() {},
  methods: {
    // 测试获取选中值
    testGetValue() {
      const materialValue = this.$refs.materialSelector.formValue
      const supplierValue = this.$refs.supplierSelector.formValue
      
      this.selectedData = {
        material: materialValue,
        supplier: supplierValue
      }
      
      // 显示提示
      this.$createToast({
        txt: '获取值成功',
        type: 'success',
        time: 1000
      }).show()
    }
  }
}
</script>

<style scoped>
.material-supplier-demo {
  height: 100vh;
  background-color: #f5f5f5;
}
.material-supplier-demo .scroll-wrapper {
  height: 100%;
}
.material-supplier-demo .page-title {
  padding: 15px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}
.material-supplier-demo .section-title {
  margin: 15px 0 5px;
  padding-left: 15px;
  font-size: 15px;
  color: #323233;
  font-weight: 500;
}
.material-supplier-demo .form-container {
  padding: 0 0 15px;
  background-color: #fff;
}
.material-supplier-demo .form-container >>> .widget-item {
  margin: 0 15px;
  padding: 10px 0;
  border-bottom: 1px solid #ebedf0;
}
.material-supplier-demo .result-container {
  margin-top: 15px;
  padding: 0 15px 15px;
  background-color: #fff;
}
.material-supplier-demo .result-container .result-content {
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 5px;
}
.material-supplier-demo .result-container .result-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 13px;
}
.material-supplier-demo .button-container {
  margin: 20px 15px;
}
</style> 