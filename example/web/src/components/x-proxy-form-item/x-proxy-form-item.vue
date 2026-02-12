<template>
  <div class="x-proxy-form-item">
    <el-form label-position="top">
      <el-form-item>
        <template v-slot:label>
          <div v-if="!isInTable" class="proxy-form-item-label">
            <x-ellipsis class="limit-length" mode="origin" :label="label"></x-ellipsis>
          </div>
        </template>
        <slot></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'XProxyFormItem',
  components: {},
  props: {
    label: {
      type: String,
      default: 'label'
    },
    isInTable: {
      type: Boolean,
      default: false
    },
    renderScene: {
      type: String,
      default: 'edit'
    }
  },

  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.x-proxy-form-item {
  --label-font-default-color: #1d2129;
  --label-font-default-weight: 600;
  --label-font-default-size: 12px;
  background-color: #fff;

  ::v-deep .el-form-item__label {
    color: var(--label-font-default-color) !important;
    font-weight: var(--label-font-default-weight);
    font-size: var(--label-font-default-size);
    width: 100%;
    padding: 0;
    text-align: right;
    vertical-align: middle;
    float: left;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  ::v-deep .el-form-item__content {
    line-height: 32px !important;
  }
}
</style>
