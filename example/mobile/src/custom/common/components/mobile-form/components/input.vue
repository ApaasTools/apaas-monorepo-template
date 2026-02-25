<template>
  <cube-input
    v-model="formValue"
    :disabled="disabled"
    class="tw-w-full tw-overflow-hidden tw-border tw-border-solid tw-border-gray-300 tw-rounded-md"
    :class="{
      'tw-bg-gray-100': fieldConfig?.disabled,
      'tw-border-red-500': errors[fieldConfig.prop]
    }"
    v-bind="fieldConfig?.attrs || {}"
    v-on="fieldConfig?.events || {}"
  ></cube-input>
</template>

<script>
import { Input } from 'cube-ui/lib'
import { formMixin } from '../utils/form.mixin'

export default {
  name: 'MobileFormInput',
  components: { CubeInput: Input },
  mixins: [formMixin]
}
</script>
