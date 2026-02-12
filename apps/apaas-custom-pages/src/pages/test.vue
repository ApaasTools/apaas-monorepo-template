<template>
    <el-row>
        <el-button>{{ $t("test") }}</el-button>
        <Button />
    </el-row>
</template>

<script>
import Button  from "@apaas/ui/components/button.vue";

export default {
  name: "Test",
  title: "测试页面",
  components: {
    Button,
  },
};
</script>
