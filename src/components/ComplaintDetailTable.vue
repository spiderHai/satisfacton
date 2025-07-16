<template>
  <!-- 添加部门和时间选择器 -->
  <div class="filter-container">
    <a-row :gutter="16" style="margin-bottom: 16px">
      <a-col :xs="24" :sm="12" :md="8" :lg="6">
        <a-form-item label="部门筛选">
          <a-tree-select
            v-model:value="selectedDepartment"
            style="width: 60%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="departmentOptions"
            placeholder="请选择部门"
            allow-clear
            tree-default-expand-all
            @change="handleFilter"
          />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="10">
        <a-form-item label="时间范围">
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            :placeholder="['开始日期', '结束日期']"
            @change="handleFilter"
            style="width: 60%"
          />
        </a-form-item>
      </a-col>
      <a-col
        :xs="24"
        :sm="24"
        :md="4"
        :lg="8"
        style="text-align: right; align-self: flex-end"
      >
        <a-button style="margin-right: 8px" @click="resetFilter">重置</a-button>
        <a-button type="primary" @click="handleFilter">筛选</a-button>
      </a-col>
    </a-row>
  </div>

  <a-table
    :columns="columns"
    :data-source="filteredData"
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
import { defineProps, defineEmits, ref, computed } from "vue";
import dayjs, { Dayjs } from "dayjs";

const props = defineProps<{
  columns: any[];
  data: any[];
  departmentOptions?: any[];
}>();

const emit = defineEmits(["view-detail", "filter-change"]);

// 筛选条件
const selectedDepartment = ref<string | undefined>(undefined);
const dateRange = ref<[Dayjs, Dayjs] | null>(null);

// 过滤后的数据
const filteredData = computed(() => {
  let result = [...props.data];

  // 部门筛选
  if (selectedDepartment.value) {
    result = result.filter((item) =>
      item.productModel?.includes(getDepartmentName(selectedDepartment.value))
    );
  }

  // 时间筛选
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = dateRange.value[0].format("YYYY-MM-DD");
    const endDate = dateRange.value[1].format("YYYY-MM-DD");

    result = result.filter((item) => {
      const itemDate = item.deliveryDate;
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  return result;
});

// 筛选处理
const handleFilter = () => {
  emit("filter-change", {
    department: selectedDepartment.value,
    dateRange: dateRange.value,
  });
};

// 重置筛选
const resetFilter = () => {
  selectedDepartment.value = undefined;
  dateRange.value = null;
  handleFilter();
};

// 根据部门ID获取部门名称
const getDepartmentName = (deptId: string): string => {
  if (!props.departmentOptions) return deptId;

  for (const dept of props.departmentOptions) {
    if (dept.value === deptId) return dept.title;
    if (dept.children) {
      for (const child of dept.children) {
        if (child.value === deptId) return child.title;
      }
    }
  }
  return deptId;
};

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

<style scoped>
.filter-container {
  margin-bottom: 16px;
  background-color: #fafafa;
  padding: 16px;
  border-radius: 2px;
}
</style>
