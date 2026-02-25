<template>
  <cube-select
    v-model="formValue"
    :placeholder="fieldConfig?.attrs?.placeholder"
    :disabled="disabled"
    :options="fieldConfig?.options || []"
    class="tw-w-full tw-border tw-overflow-hidden tw-border-solid tw-border-gray-300 tw-rounded-md"
    :class="{ 'tw-bg-gray-100': disabled, 'tw-border-red-500': errors[fieldConfig.prop] }"
    v-bind="fieldConfig?.attrs || {}"
    v-on="fieldConfig?.events || {}"
  ></cube-select>
</template>

<script>
import { Select } from 'cube-ui/lib'
import { formMixin } from '../utils/form.mixin'

export default {
  name: 'MobileFormSelect',
  components: { CubeSelect: Select },
  mixins: [formMixin]
}
</script>
