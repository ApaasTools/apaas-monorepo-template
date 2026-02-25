<template>
  <cube-select
    v-model="formValue"
    :placeholder="fieldConfig?.attrs?.placeholder"
    :disabled="disabled"
    :options="innerOptions"
    class="tw-w-full tw-border tw-overflow-hidden tw-border-solid tw-border-gray-300 tw-rounded-md"
    :class="{ 'tw-bg-gray-100': disabled, 'tw-border-red-500': errors[fieldConfig.prop] }"
    v-bind="fieldConfig?.attrs || {}"
    v-on="fieldConfig?.events || {}"
    @click="visibleChange"
  ></cube-select>
</template>

<script>
import { Select } from 'cube-ui/lib'
import { formMixin } from '../utils/form.mixin'
import { getSystemDictionary, getCrmCustomDictionary } from '@/custom/common/api/common'

export default {
  name: 'MobileFormDictionarySelect',
  components: { CubeSelect: Select },
  mixins: [formMixin],
  data() {
    return {
      innerOptions: []
    }
  },
  computed: {
    dictionaryCode() {
      return this.fieldConfig?.extra?.dictionaryCode || ''
    }
  },
  created() {
    if (this.fieldConfig.extra?.getDataMode === 'created') {
      this.getOptionsData()
    }
  },
  methods: {
    async getOptionsData() {
      if (this.optionsType === 'system') {
        const [res, err] = await getSystemDictionary(this, this.dictionaryCode)
        if (err) {
          this.$toast.error(err.message)
          return
        }
        this.innerOptions = res.data[this.dictionaryCode].filter((i) => i.valueStatus === 'ENABLE')
      } else {
        const [res, err] = await getCrmCustomDictionary(this, this.fieldConfig.extra?.params || {})
        if (err) {
          this.$toast.error(err.message)
          return
        }
        this.innerOptions = res.table || []
      }
    },
    visibleChange(e) {
      this.$emit('visibleChange', e)
      this.getOptionsData()
    }
  }
}
</script>
