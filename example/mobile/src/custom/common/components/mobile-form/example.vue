<!---
 * @Description: 移动端表单组件使用示例
 * @Date: 2025-07-04
 * @FilePath: src/custom/common/components/mobile-form/example.vue
 -->
<template>
  <div>
    <h3 class="tw-text-lg tw-font-medium tw-mb-4">表单示例</h3>
    <mobile-form
      ref="mobileForm"
      :field-configs="fieldConfigs"
      :form-data="formData"
      layout="vertical"
    />
    <div class="tw-mt-4 tw-flex tw-justify-between">
      <cube-button @click="resetForm">重置</cube-button>
      <cube-button @click="submitForm" :primary="true">提交</cube-button>
    </div>
  </div>
</template>

<script>
import { Button } from 'cube-ui/lib'
import MobileForm from './index.vue'
import { rules } from './utils/validator'

export default {
  name: 'MobileFormExample',
  components: {
    MobileForm,
    CubeButton: Button
  },
  data() {
    return {
      formData: {},
      fieldConfigs: [
        {
          label: '用户名',
          prop: 'username',
          type: 'input',
          placeholder: '请输入用户名',
          required: true
        },
        {
          label: '手机号',
          prop: 'mobile',
          type: 'input',
          placeholder: '请输入手机号',
          required: true,
          validator: rules.mobile,
          errorMessage: '请输入正确的手机号码'
        },
        {
          label: '性别',
          prop: 'gender',
          type: 'radio-group',
          options: [
            { value: '1', text: '男' },
            { value: '2', text: '女' }
          ],
          required: true
        },
        {
          label: '爱好',
          prop: 'hobbies',
          type: 'checkbox-group',
          options: [
            { value: '1', text: '阅读' },
            { value: '2', text: '音乐' },
            { value: '3', text: '运动' },
            { value: '4', text: '旅行' }
          ],
          multiple: true
        },
        {
          label: '职业',
          prop: 'occupation',
          type: 'select',
          placeholder: '请选择职业',
          options: [
            { value: '1', text: '程序员' },
            { value: '2', text: '设计师' },
            { value: '3', text: '产品经理' },
            { value: '4', text: '运营' },
            { value: '5', text: '其他' }
          ]
        },
        {
          label: '出生日期',
          prop: 'birthday',
          type: 'date-picker',
          placeholder: '请选择出生日期'
        },
        {
          label: '个人简介',
          prop: 'introduction',
          type: 'textarea',
          placeholder: '请输入个人简介'
        }
      ]
    }
  },
  methods: {
    resetForm() {
      this.$refs.mobileForm.reset()
    },
    submitForm() {
      this.$refs.mobileForm.submit()
        .then(formData => {
          this.$createToast({
            txt: '提交成功',
            type: 'success'
          }).show()
          console.log('表单提交成功：', formData)
        })
        .catch(errors => {
          this.$createToast({
            txt: '表单验证失败',
            type: 'error'
          }).show()
          console.error('表单验证失败：', errors)
        })
    }
  }
}
</script>