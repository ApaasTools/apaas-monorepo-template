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
      <x-vxe-table
        :colConfigs="colConfigs"
        :tableData="tableData"
        :pageConfig="{ hidden: true }"
        seqType="none"
      >
        <template #indexSlot="{ row, index }">
          {{ index + 1 }}
        </template>
        <template #processStatusMeaningSlot="{ row }">
          <el-tag :type="processStatus(row?.processStatus)" size="small">
            {{ row?.processStatusMeaning }}
          </el-tag>
        </template>
        <template #processCommentSlot="{ row }">
          <div class="process-comment">
            <p
              v-for="text in handleNodeApproversProcessComment(
                row?.nodeApprovers ?? []
              )"
              :key="text"
            >
              {{ text }}
            </p>
          </div>
        </template>
      </x-vxe-table>
    </x-loading>
  </x-proxy-form-item>
</template>

<script>
import { FormWidgetMixin } from "@apaas/helper";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default {
  name: "FormCustomApprovalHistory",
  title: "审批历史(通用)",
  components: {},
  mixins: [FormWidgetMixin],
  data() {
    return {
      loading: false,
      tableData: [],
      roleCode: [],
      userType: "",
    };
  },
  computed: {
    colConfigs() {
      const cols = [
        {
          prop: "index",
          label: "序号",
          showOverflowTooltip: true,
          align: "center",
          customSlot: "indexSlot",
          width: 50,
        },
        {
          prop: "nodeName",
          label: "节点名称",
          showOverflowTooltip: true,
          align: "center",
          minWidth: 200,
        },
        {
          prop: "processStatusMeaning",
          label: "审批状态",
          showOverflowTooltip: true,
          align: "center",
          minWidth: 100,
        },
        {
          prop: "nodeApprovers",
          label: "审批人",
          showOverflowTooltip: true,
          align: "center",
          formatter: ({ cellValue }) => {
            return cellValue?.map((item) => item.userName)?.join(",");
          },
          minWidth: 200,
        },
        {
          prop: "nodeApprovers",
          label: "审批操作",
          showOverflowTooltip: true,
          align: "center",
          formatter: ({ cellValue }) => {
            return cellValue
              ?.map((item) => item?.processStatusMeaning)
              ?.join(",");
          },
          minWidth: 100,
        },
        {
          prop: "nodeApprovers",
          label: "审批意见",
          showOverflowTooltip: true,
          align: "center",
          customSlot: "processCommentSlot",
          minWidth: 400,
          // formatter: ({ cellValue }) => {
          //   return cellValue?.map((item) => item?.processComment)?.join('\n')
          // },
          // minWidth: 400
        },
        {
          prop: "executeTime",
          label: "审批时间",
          showOverflowTooltip: true,
          align: "center",
        },
        {
          prop: "totalTime",
          label: "审批时长",
          showOverflowTooltip: true,
          align: "center",
          formatter: ({ cellValue }) => {
            return this.upperTotalTime(cellValue);
          },
        },
      ];

      return cols;
    },
  },
  created() {
    this.getHasPermission();
  },
  methods: {
    upperTotalTime(cellValue) {
      const day = cellValue?.dayNum ?? 0;
      const hour = cellValue?.hourNum ?? 0;
      const min = cellValue?.minNum ?? 0;

      // 如果都为0，返回0天 0小时 0分钟
      if (day === 0 && hour === 0 && min === 0) {
        return "0天 0小时 0分钟";
      }

      // 组合时长并使用 dayjs 格式化显示
      const duration = dayjs.duration({
        days: day,
        hours: hour,
        minutes: min,
      });

      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();

      return `${days}天 ${hours}小时 ${minutes}分钟`;
    },
    queryProcessHistory() {
      // const globalData = window.$FormCustomApprovalHistory?.globalData
      const params = {
        // ...api.processHistory,
        url: "/xdap-app/process/query/processHistory",
        method: "POST",
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          documentId: this.globalData?.documentId,
          formId: this.globalData?.formId,
          permissionFlag: true,
        },
      };
      this.loading = true;
      this.$request(params)
        .asyncThen((resp) => {
          this.loading = false;
          this.tableData = resp?.data?.nodeApproverList ?? [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatterCurrentNodeStatusFlag(flag) {
      return flag ? "当前环节" : flag === false ? "已审批" : "未开始";
    },
    processStatus(flag) {
      if (["APPROVING"].includes(flag)) {
        return "default";
      }

      if (["RESTART"].includes(flag)) {
        return "warning";
      }

      if (
        [
          "SUBMIT",
          "APPROVE",
          "BATCH_APPROVE",
          "COMPLETED",
          "SUCCESSFUL",
        ].includes(flag)
      ) {
        return "success";
      }

      if (["REJECT", "BATCH_REJECT", "ERROR", "FAILED"].includes(flag)) {
        return "danger";
      }

      return "info";
    },
    async getHasPermission() {
      const requestConfig = {
        url: "/xdap-app/form/query/detailFormButton",
        method: "get",
        disableSuccessMsg: true,
        params: {
          documentId: this.globalData?.documentId,
          formId: this.globalData?.formId,
          permissionFlag: true,
          taskId: this.globalData?.taskId || "",
        },
      };
      const res = await this.$request(requestConfig);
      if (res.code !== "ok") return;
      const hasPermission = res?.data?.some(
        (item) => item?.buttonCode === "APPROVE_HISTORY"
      );
      if (hasPermission) {
        this.queryProcessHistory();
      }
    },
    handleNodeApproversProcessComment(nodeApprovers) {
      return nodeApprovers
        ?.map((item) => item?.processComment)
        ?.join("\n")
        ?.split("\n");
    },
  },
};
</script>

<style lang="scss" scoped>
.form-history-table {
  --custom-form-label-background-color: #fff;
}

::v-deep(
    .x-vxe-table
      .vxe-table
      .vxe-table--body
      tr
      > td.vxe-body--column
      .c--ellipsis:has(.process-comment)
  ) {
  white-space: normal;
  max-height: max-content;
  text-align: left;
}
</style>
