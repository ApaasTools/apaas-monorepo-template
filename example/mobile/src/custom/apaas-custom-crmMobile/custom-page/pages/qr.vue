<template>
  <div class="tw-flex tw-flex-col tw-gap-y-2 tw-p-4">
    <mobile-form ref="formRef" :fieldConfigs="formFieldConfigs" :formData="formData">
      <template #slotPopup="{ field, formData, errors, prop, value }">
        <InputPopup
          v-model="formData[prop]"
          :fieldConfig="field"
          :formData="formData"
          :errors="errors"
          :value="value"
        />
      </template>
    </mobile-form>
    <div class="tw-flex tw-justify-between tw-items-center tw-relative">
      <cube-button @click="save">
        保存
      </cube-button>
    </div>
  </div>
</template>

<script>
import QrScanner from '~/components/qr-scanner.vue'
import MobileForm from '@/custom/common/components/mobile-form/index.vue'
import InputPopup from '@/custom/common/components/mobile-form/custom-components/input-popup.vue'

export default {
  name: 'Qr',
  components: {
    QrScanner,
    MobileForm,
    InputPopup
  },
  data() {
    return {
      label: '请扫描二维码',
      showScanner: false,
      scanResult: '',
      formFieldConfigs: [
        {
          label: '请扫描二维码',
          prop: 'scanResult',
          type: 'input',
          required: true,
          attrs: {
            placeholder: '请扫码'
          },
          events: {
            focus: () => {
              console.log('focus')
            },
            blur: () => {
              console.log('blur')
            },
            input: (value) => {
              console.log('input', value)
            }
          }
        },
        {
          label: '选择类型',
          prop: 'select',
          type: 'select',
          required: true,
          attrs: {
            placeholder: '请选择'
          },
          options: [
            {
              text: '选项1',
              value: '1'
            },
            {
              text: '选项2',
              value: '2'
            }
          ],
          events: {
            change: (value) => {
              console.log('change', value)
            }
          }
        },
        {
          label: '请输入',
          prop: 'textarea',
          type: 'textarea',
          attrs: {
            placeholder: '请输入',
            maxlength: 100,
            forceExpand: true
          },
          extra: {
            formatter: (value, formData) => {
              return value.toUpperCase()
            },
            // 提交前格式化
            beforeSubmitFormatter: (value) => {
              console.log('beforeSubmitFormatter', value)
              return value.toUpperCase()
            }
          }
        },
        {
          label: '开关',
          prop: 'switch',
          type: 'switch'
        },
        {
          label: '日期选择器',
          prop: 'datePicker',
          type: 'date-picker',
          attrs: {
            placeholder: '请选择日期'
          }
        },
        {
          label: '插槽',
          prop: 'slot',
          type: 'slot',
          slotName: 'slotPopup'
        }
      ],
      formData: {
        scanResult: '',
        select: '',
        textarea: '',
        switch: false,
        datePicker: '',
        slot: ''
      }
    }
  },
  methods: {
    save() {
      const valid = this.$refs.formRef.validate()
      console.log('valid', valid)
    }
  }
}
</script>
