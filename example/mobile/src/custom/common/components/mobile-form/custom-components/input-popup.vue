<template>
  <div>
    <div
      class="date-picker tw-w-full tw-h-12 tw-flex tw-items-center tw-px-3 tw-leading-10 tw-overflow-hidden tw-border tw-border-solid tw-border-gray-300 tw-rounded-md"
      :class="{
        'tw-bg-gray-100': fieldConfig?.disabled,
        'tw-border-red-500': errors[fieldConfig.prop]
      }"
      @click="showPopup"
    >
      <div v-if="formValue" class="tw-flex-1 tw-truncate">{{ formValue }}</div>
      <div v-else class="tw-flex-1 tw-truncate tw-text-gray-400">
        {{ fieldConfig?.attrs?.placeholder }}
      </div>
      <i v-if="formValue" class="cubeic-wrong tw-text-lg" @click.stop="clearValue"></i>
      <i v-else class="cubeic-arrow tw-text-gray-400"></i>
    </div>
    <bottom-popup
      ref="bottomPopupRef"
      v-model="visible"
      :title="fieldConfig.label"
      :showFooter="true"
    ></bottom-popup>
  </div>
</template>

<script>
import { formMixin } from '../utils/form.mixin'
import BottomPopup from '@/custom/common/components/bottom-popup.vue'

export default {
  name: 'InputPopup',
  components: {
    BottomPopup
  },
  mixins: [formMixin],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    showPopup() {
      this.visible = true
    },

    clearValue(e) {
      e.stopPropagation()
      this.formValue = ''
    }
  }
}
</script>
