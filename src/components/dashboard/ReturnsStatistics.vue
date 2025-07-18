<template>
  <a-row :gutter="16" class="returns-statistics-row">
    <a-col :xs="24" :sm="8">
      <a-card title="每月总体退货数 & 退货率" class="returns-statistics-card">
        <div ref="monthlyChartRef" style="height: 320px"></div>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="8">
      <a-card title="当月各部门退货数 & 退货率" class="returns-statistics-card">
        <div ref="departmentChartRef" style="height: 320px"></div>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="8">
      <a-card title="当月单部门各客户退货数" class="returns-statistics-card">
        <div style="position: absolute; top: 70px; right: 24px; z-index: 1">
          <a-tree-select
            v-model:value="selectedDepartment"
            style="width: 160px"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="departmentOptions"
            placeholder="请选择部门"
            allow-clear
            tree-default-expand-all
            @change="handleFilter"
          />
        </div>
        <div ref="customerChartRef" style="height: 320px"></div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  monthlyData?: { months: string[]; returns: number[]; rates: number[] };
  departmentData?: {
    departments: string[];
    returns: number[];
    rates: number[];
  };
  customerStackData?: {
    customers: string[];
    products: string[];
    stack: number[][];
  };
}>();

const defaultMonthly = {
  months: ["2月", "3月", "4月", "5月", "6月", "7月"],
  returns: [120, 132, 101, 134, 90, 230],
  rates: [5.3, 4.8, 6.1, 3.2, 4.5, 5.0],
};
const defaultDepartment = {
  departments: [
    "车载镜头-南昌",
    "车载镜头-合肥",
    "车载镜头-越南",
    "车载模组-合肥",
    "CA003-南昌",
    "CA003-墨西哥",
  ],
  returns: [50, 80, 30, 45, 60, 38],
  rates: [3.5, 5.1, 2.2, 4.0, 6.2, 3.8],
};
const defaultCustomerStack = {
  customers: ["阿里巴巴", "腾讯", "百度", "华为"],
  products: ["产品A", "产品B", "产品C"],
  stack: [
    [20, 34, 15, 28], // 产品A
    [5, 10, 6, 12], // 产品B
    [8, 2, 4, 7], // 产品C
  ],
};

const monthlyChartRef = ref();
const departmentChartRef = ref();
const customerChartRef = ref();

const selectedDepartment = ref<string | undefined>("车载镜头-南昌");

function handleFilter(value: string | undefined) {
  selectedDepartment.value = value;

  let customers = ["客户A", "客户B", "客户C", "客户D"];
  let products = ["产品A", "产品B", "产品C"];
  let stack = products.map(() =>
    customers.map(() => Math.floor(Math.random() * 30 + 10))
  );

  // 匹配 SatisfactionDashboard 的颜色方案
  const colors = [
    {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#ff4d4f" }, // 赤红色
        { offset: 1, color: "#a8071a" },
      ],
    },
    {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#52c41a" }, // 成功绿色
        { offset: 1, color: "#389e0d" },
      ],
    },
    {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#faad14" }, // 警告黄色
        { offset: 1, color: "#d48806" },
      ],
    },
  ];

  customerChartRef.value &&
    echarts.init(customerChartRef.value).setOption({
      color: colors,
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { data: products },
      xAxis: { type: "category", data: customers },
      yAxis: { type: "value", name: "退货数" },
      series: products.map((prod, idx) => ({
        name: prod,
        type: "bar",
        stack: "客户",
        data: stack[idx],
        itemStyle: { color: colors[idx] },
      })),
    });
}
// 部门选项数据（示例，可根据实际数据结构调整）
const departmentOptions = ref(
  (props.departmentData?.departments || defaultDepartment.departments).map(
    (dep, index) => ({
      title: dep,
      value: index,
      key: index,
    })
  )
);

let monthlyChart: any = null;
let departmentChart: any = null;
let customerChart: any = null;

const renderMonthlyChart = () => {
  const data = props.monthlyData || defaultMonthly;
  if (!monthlyChartRef.value) return;
  if (!monthlyChart) monthlyChart = echarts.init(monthlyChartRef.value);
  monthlyChart.setOption({
    color: ["#1890ff", "#faad14"], // 与SatisfactionDashboard保持一致
    tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
    legend: { data: ["退货数", "退货率"] },
    xAxis: { type: "category", data: data.months },
    yAxis: [
      { type: "value", name: "退货数" },
      {
        type: "value",
        name: "退货率",
        axisLabel: { formatter: "{value} %" },
      },
    ],
    series: [
      {
        name: "退货数",
        type: "bar",
        data: data.returns,
        itemStyle: { color: "#52c41a" }, // 偏绿色
        // itemStyle: { color: "#1890ff" }, // 主蓝色
      },
      {
        name: "退货率",
        type: "line",
        yAxisIndex: 1,
        data: data.rates,
        itemStyle: { color: "#faad14" }, // 警告黄色
        lineStyle: { color: "#faad14" },
      },
    ],
  });
};

// 调整部门图表颜色
const renderDepartmentChart = () => {
  const data = props.departmentData || defaultDepartment;
  if (!departmentChartRef.value) return;
  if (!departmentChart)
    departmentChart = echarts.init(departmentChartRef.value);
  departmentChart.setOption({
    color: ["#52c41a", "#ff7a45"], // 绿色和橙色
    tooltip: { trigger: "axis" },
    legend: { data: ["退货数", "退货率"] },
    xAxis: { type: "category", data: data.departments },
    yAxis: [
      { type: "value", name: "退货数" },
      {
        type: "value",
        name: "退货率",
        axisLabel: { formatter: "{value} %" },
      },
    ],
    series: [
      {
        name: "退货数",
        type: "bar",
        data: data.returns,
        itemStyle: { color: "#52c41a" }, // 绿色
      },
      {
        name: "退货率",
        type: "line",
        yAxisIndex: 1,
        data: data.rates,
        itemStyle: { color: "#ff7a45" }, // 橙色
        lineStyle: { color: "#ff7a45" },
      },
    ],
  });
};

// 客户图表也需要修改初始颜色
const renderCustomerChart = () => {
  const data = props.customerStackData || defaultCustomerStack;
  // 匹配主面板颜色
  const colors = [
    "#ff4d4f", // 蓝色
    "#52c41a", // 绿色
    "#faad14", // 黄色/橙色
  ];
  if (!customerChartRef.value) return;
  if (!customerChart) customerChart = echarts.init(customerChartRef.value);
  customerChart.setOption({
    color: colors,
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { data: data.products },
    xAxis: { type: "category", data: data.customers },
    yAxis: { type: "value", name: "退货数" },
    series: data.products.map((prod, idx) => ({
      name: prod,
      type: "bar",
      stack: "客户",
      data: data.stack[idx],
      itemStyle: { color: colors[idx] },
    })),
  });
};
watch(() => props.monthlyData, renderMonthlyChart, { deep: true });
watch(() => props.departmentData, renderDepartmentChart, { deep: true });
watch(() => props.customerStackData, renderCustomerChart, { deep: true });

onMounted(() => {
  renderMonthlyChart();
  renderDepartmentChart();
  renderCustomerChart();
});
</script>

<style>
.returns-statistics-row {
  margin-bottom: 24px;
}
.returns-statistics-card {
  min-height: 360px;
}
.returns-statistics-card {
  position: relative;
  overflow: visible;
}
/* 穿透修改 ant-card-body 样式 */
.returns-statistics-card :deep(.ant-card-body) {
  padding-top: 36px !important;
  padding-bottom: 0px !important;
}

/* :deep(.returns-statistics-card .ant-card-body) {
  padding-top: 36px !important;
  padding-bottom: 0px !important;
} */

/* 或者不使用 scoped 样式时可以这样写 */
/*
.returns-statistics-card .ant-card-body {
  padding: 16px;
}
*/
.returns-statistics-card .ant-card-body {
  padding-top: 48px;
  padding-bottom: 0px;
}
</style>
