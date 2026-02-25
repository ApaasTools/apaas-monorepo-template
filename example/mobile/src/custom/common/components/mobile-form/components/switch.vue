<template>
  <cube-switch
    v-model="formValue"
    :placeholder="fieldConfig?.attrs?.placeholder"
    :disabled="disabled"
    :options="fieldConfig?.options || []"
    class="tw-w-full"
    v-bind="fieldConfig?.attrs || {}"
    v-on="fieldConfig?.events || {}"
  ></cube-switch>
</template>

<script>
import { Switch } from 'cube-ui/lib'
import { formMixin } from '../utils/form.mixin'

export default {
  name: 'MobileFormSwitch',
  components: { CubeSwitch: Switch },
  mixins: [formMixin]
}
</script>
