<template>
  <a-card class="returns-card" title="退货数据统计" :bordered="false">
    <div class="returns-header">
      <a-statistic
        title="总体退货数"
        :value="totalReturns"
        style="margin-bottom: 20px"
      >
        <template #suffix>
          <span style="font-size: 16px">件</span>
        </template>
      </a-statistic>
      <a-range-picker
        v-model:value="dateRange"
        format="YYYY-MM"
        :placeholder="['开始月份', '结束月份']"
        @change="onDateRangeChange"
        style="margin-bottom: 20px"
      />
    </div>
    <a-divider style="margin: 16px 0" />
    <a-row :gutter="[16, 16]">
      <a-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        v-for="dept in topDepartments"
        :key="dept.value"
      >
        <a-card bordered>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <a-statistic
              :title="dept.title"
              :value="getDepartmentReturns(dept.value)"
              :value-style="{ color: getDepartmentColor(dept.value) }"
            >
              <template #suffix>
                <span>件</span>
              </template>
            </a-statistic>
            <div
              :style="{
                marginLeft: '12px',
                fontSize: '14px',
                color: getDepartmentColor(dept.value),
                fontWeight: 500,
              }"
            >
              <span>退货率：</span>
              <span>{{ getDepartmentRate(dept.value) }}</span>
            </div>
          </div>
          <div
            v-if="dept.children && dept.children.length > 0"
            class="sub-dept-stats"
          >
            <div
              v-for="child in dept.children"
              :key="child.value"
              class="sub-dept-item"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <span>{{ child.title }}: </span>
                <span>{{ getSubDepartmentReturns(child.value) }}件</span>
              </div>
              <div style="margin-left: 12px; font-size: 14px; color: #888">
                <span>退货率：</span>
                <span>{{ getSubDepartmentRate(child.value) }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { Dayjs } from "dayjs";

const props = defineProps({
  totalReturns: {
    type: Number,
    required: true,
  },
  returnsDateRange: {
    type: Array,
    required: true,
  },
  topDepartments: {
    type: Array,
    required: true,
  },
  departmentReturns: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-date-range"]);

// 将父组件传入的日期范围作为本地计算属性
const dateRange = computed({
  get: () => props.returnsDateRange,
  set: (value) => emit("update-date-range", value),
});

// 日期范围变更时触发父组件更新
const onDateRangeChange = () => {
  emit("update-date-range");
};

// 获取部门退货数
const getDepartmentReturns = (deptValue: string) => {
  return props.departmentReturns[deptValue] || 0;
};

// 获取子部门退货数
const getSubDepartmentReturns = (deptValue: string) => {
  return props.departmentReturns[deptValue] || 0;
};

// 计算部门退货率
const getDepartmentRate = (deptValue: string) => {
  if (!props.totalReturns || props.totalReturns === 0) return "0%";
  const val = props.departmentReturns[deptValue] || 0;
  return ((val / props.totalReturns) * 100).toFixed(2) + "%";
};

// 计算子部门退货率
const getSubDepartmentRate = (deptValue: string) => {
  if (!props.totalReturns || props.totalReturns === 0) return "0%";
  const val = props.departmentReturns[deptValue] || 0;
  return ((val / props.totalReturns) * 100).toFixed(2) + "%";
};

// 部门颜色
const getDepartmentColor = (deptValue: string) => {
  const colorMap = {
    "car-lens": "#1890ff",
    "car-module": "#52c41a",
    ca003: "#722ed1",
    "mobile-lens": "#fa8c16",
    "mobile-module": "#eb2f96",
    "fuzhou-hengtai": "#13c2c2",
    "hd-wide-lens": "#faad14",
    "hd-wide-module": "#a0d911",
    "glass-lens": "#f5222d",
    "precision-parts": "#2f54eb",
  };

  return colorMap[deptValue] || "#1890ff";
};
</script>

<style scoped>
.returns-card {
  margin-bottom: 20px;
}

.returns-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.sub-dept-stats {
  margin-top: 12px;
  border-top: 1px dashed #f0f0f0;
  padding-top: 8px;
}

.sub-dept-item {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  display: flex;
  justify-content: space-between;
}
</style>
