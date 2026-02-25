<template>
  <cube-textarea
    v-model="formValue"
    :disabled="
      fieldConfig?.extra?.disabled ? fieldConfig?.extra?.disabled(formData) : fieldConfig?.disabled
    "
    class="tw-w-full tw-border tw-border-solid tw-border-gray-300 tw-rounded-md tw-overflow-hidden"
    :class="{
      'tw-bg-gray-100': fieldConfig?.disabled,
      'tw-border-red-500': errors[fieldConfig.prop]
    }"
    v-bind="fieldConfig?.attrs || {}"
    v-on="fieldConfig?.events || {}"
  ></cube-textarea>
</template>

<script>
import { Textarea } from 'cube-ui/lib'
import { formMixin } from '../utils/form.mixin'

export default {
  name: 'MobileFormTextarea',
  components: { CubeTextarea: Textarea },
  mixins: [formMixin]
}
</script>
