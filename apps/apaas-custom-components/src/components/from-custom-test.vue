<!--
 * @Description: 自定义组件-审批历史
 * @Author: HongYu
 * @Date: 2025-02-10 09:18:45
 * @LastEditors: HongYu
 * @LastEditTime: 2025-02-10 09:18:45
-->
<template>
  <x-proxy-form-item
    :isInTable="widget.isInTable"
    :showRequired="showRequired"
    :label="widget.label"
    :validatorRules="validatorRules"
    :validateKey="validateKey"
    :validateInfo="validateInfo"
    class="form-history-table"
  >
    <x-loading :visible="loading">
      <p class="yc:text-amber-200">测试文本</p>
      <el-button>测试按钮</el-button>
    </x-loading>
  </x-proxy-form-item>
</template>

<script>
import { FormWidgetMixin } from "@apaas/helper";

export default {
  name: "TestComponent",
  title: "测试组件",
  mixins: [FormWidgetMixin]
};
</script>
