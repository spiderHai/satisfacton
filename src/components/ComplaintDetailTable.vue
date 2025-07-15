<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="{ pageSize: 10 }"
    :scroll="{ x: 1000 }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'level'">
        <a-tag :color="getComplaintLevelColor(record.level)">
          {{ record.level }}
        </a-tag>
      </template>
      <template v-else-if="column.dataIndex === 'status'">
        <a-badge :status="getStatusType(record.status)" :text="record.status" />
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <a-button type="link" @click="$emit('view-detail', record)">
          查看详情
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  columns: any[];
  data: any[];
}>();
const emit = defineEmits(["view-detail"]);

// 投诉等级颜色
const getComplaintLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    A级: "#ff4d4f",
    B级: "#ff7a45",
    C级: "#faad14",
    D级: "#52c41a",
    E级: "#bfbfbf",
  };
  return colorMap[level] || "#bfbfbf";
};

// 状态标识
const getStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    待处理: "warning",
    处理中: "processing",
    已解决: "success",
    已关闭: "default",
  };
  return statusMap[status] || "default";
};
</script>
