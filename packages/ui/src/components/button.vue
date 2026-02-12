<template>
  <el-row>
    <el-button>默认按钮</el-button>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="success">成功按钮</el-button>
    <el-button type="info">信息按钮</el-button>
    <el-button type="warning">警告按钮</el-button>
    <el-button type="danger">危险按钮</el-button>
    <x-svg-icon :name="nameVariable1"></x-svg-icon>
    <x-svg-icon :name="nameVariable2"></x-svg-icon>
    <x-svg-icon :name="nameVariable3"></x-svg-icon>
  </el-row>
</template>

<script>
export default {
  name: "Button",
  data() {
    return {
      nameVariable1: "x-lib-area",
      nameVariable2: "x-lib-checkbox-active",
      nameVariable3: "x-lib-pdf",
    };
  },
};
</script>
