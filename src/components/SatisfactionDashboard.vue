<template>
  <div class="satisfaction-dashboard">
    <!-- 顶部筛选区 -->
    <a-card class="filter-card" :bordered="false">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="时间范围">
            <a-range-picker
              v-model:value="dateRange"
              format="YYYY-MM"
              :placeholder="['开始月份', '结束月份']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="部门筛选">
            <a-tree-select
              v-model:value="selectedDepts"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="departmentOptions"
              placeholder="请选择部门"
              allow-clear
              multiple
              tree-default-expand-all
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="客户筛选">
            <a-select
              v-model:value="selectedCustomers"
              mode="multiple"
              placeholder="请选择客户"
              style="width: 100%"
              :options="customerOptions"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" style="text-align: right">
          <a-button style="margin-right: 8px" @click="resetFilters"
            >重置</a-button
          >
          <a-button type="primary" @click="applyFilters">查询</a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- 核心指标看板 -->
    <a-row :gutter="16" class="stats-row">
      <a-col :span="8">
        <a-card class="metric-card">
          <template #title>当月平均满意度</template>
          <a-statistic
            :value="overallSatisfaction"
            :precision="1"
            suffix="分"
            style="font-weight: bold"
            :value-style="{
              color: getSatisfactionColor(overallSatisfaction),
              fontSize: '32px',
            }"
          />
          <div class="trend-indicator">
            <span>环比</span>
            <a-statistic
              :value="satisfactionChange"
              :precision="2"
              suffix="%"
              :value-style="{
                color: satisfactionChange >= 0 ? '#3f8600' : '#cf1322',
              }"
              :prefix="
                satisfactionChange >= 0 ? renderUpIcon() : renderDownIcon()
              "
            />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="chart-card" title="满意度趋势">
          <div ref="satisfactionTrendChart" style="height: 250px"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="chart-card" title="投诉等级分布">
          <div ref="complaintLevelChart" style="height: 250px"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 双维度分析区 -->
    <a-row :gutter="16" class="chart-row">
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <a-card class="chart-card" title="部门满意度排名">
          <div ref="departmentSatisfactionChart" style="height: 300px"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <a-card class="chart-card" title="月度投诉趋势">
          <div ref="complaintTrendChart" style="height: 300px"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="chart-row">
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <a-card class="chart-card" title="客户满意度分布">
          <div class="chart-filter-wrapper">
            <a-select
              v-model:value="selectedDeptForChart"
              style="width: 200px; margin-bottom: 15px"
              placeholder="请选择部门"
              @change="updateCustomerSatisfactionChart"
            >
              <a-select-option
                v-for="dept in departmentOptions"
                :key="dept.value"
                :value="dept.value"
              >
                {{ dept.title }}
              </a-select-option>
            </a-select>
          </div>
          <div ref="customerSatisfactionRadar" style="height: 300px"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <a-card class="chart-card" title="投诉等级月度分布">
          <div ref="complaintLevelMonthlyChart" style="height: 300px"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 投诉详情表格区 -->
    <a-card class="detail-card" title="投诉详情列表">
      <ComplaintDetailTable
        :columns="complaintColumns"
        :data="complaintData"
        @view-detail="viewDetail"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, h } from "vue";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons-vue";
import * as echarts from "echarts";
import dayjs, { Dayjs } from "dayjs";
import ComplaintDetailTable from "./ComplaintDetailTable.vue";
import {
  getDeptCustomerSatisfactionData,
  departmentOptions,
  customerOptions,
  complaintData,
} from "../data/mockData";

// 渲染图标
const renderUpIcon = () => h(ArrowUpOutlined);
const renderDownIcon = () => h(ArrowDownOutlined);

// 满意度颜色标识
const getSatisfactionColor = (score: number) => {
  if (score >= 80) return "#52c41a";
  if (score >= 60) return "#faad14";
  return "#ff4d4f";
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

// 筛选条件
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(5, "month"), dayjs()]);
const selectedDepts = ref<string[]>([]);
const selectedCustomers = ref<string[]>([]);

// 核心指标
const overallSatisfaction = ref(85.6);
const satisfactionChange = ref(3.2);

// 图表引用
const satisfactionTrendChart = ref<HTMLElement | null>(null);
const complaintLevelChart = ref<HTMLElement | null>(null);
const departmentSatisfactionChart = ref<HTMLElement | null>(null);
const complaintTrendChart = ref<HTMLElement | null>(null);
const customerSatisfactionRadar = ref<HTMLElement | null>(null);
const complaintLevelMonthlyChart = ref<HTMLElement | null>(null);

// 投诉表格列定义
const complaintColumns = [
  { title: "NO.", dataIndex: "no", key: "no" },
  { title: "担当", dataIndex: "owner", key: "owner" },
  { title: "客诉编号", dataIndex: "complaintId", key: "complaintId" },
  { title: "客户", dataIndex: "customer", key: "customer" },
  { title: "产品型号", dataIndex: "productModel", key: "productModel" },
  { title: "投诉时间(年月日)", dataIndex: "deliveryDate", key: "deliveryDate" },
  { title: "重要发生", dataIndex: "importantOccur", key: "importantOccur" },
  { title: "不良率", dataIndex: "defectRate", key: "defectRate" },
  { title: "客诉等级", dataIndex: "complaintLevel", key: "complaintLevel" },

  { title: "不良描述", dataIndex: "defectDesc", key: "defectDesc" },
  { title: "根本原因", dataIndex: "rootCause", key: "rootCause" },
  { title: "对策", dataIndex: "countermeasure", key: "countermeasure" },
  { title: "权责区分", dataIndex: "responsibility", key: "responsibility" },
  { title: "完成状态", dataIndex: "status", key: "status" },
  { title: "结案时间", dataIndex: "closeDate", key: "closeDate" },
];

// 查看详情
const viewDetail = (record: any) => {
  console.log("查看详情", record);
};

// 重置筛选器
const resetFilters = () => {
  dateRange.value = [dayjs().subtract(5, "month"), dayjs()];
  selectedDepts.value = [];
  selectedCustomers.value = [];
};

// 客户满意度图表所选部门
const selectedDeptForChart = ref("");

// 更新客户满意度图表
const updateCustomerSatisfactionChart = () => {
  if (!customerSatisfactionRadar.value) return;

  const chart =
    echarts.getInstanceByDom(customerSatisfactionRadar.value) ||
    echarts.init(customerSatisfactionRadar.value);
  chart.clear(); // 确保清除旧图表

  // 如果未选择部门，显示雷达图
  if (!selectedDeptForChart.value) {
    chart.setOption({
      tooltip: {},
      legend: {
        data: ["阿里巴巴", "腾讯", "百度", "京东", "华为"],
      },
      radar: {
        indicator: [
          { name: "响应速度", max: 100 },
          { name: "专业度", max: 100 },
          { name: "解决效率", max: 100 },
          { name: "服务态度", max: 100 },
          { name: "整体满意度", max: 100 },
        ],
      },
      series: [
        {
          type: "radar",
          data: [
            { value: [90, 85, 88, 92, 89], name: "阿里巴巴" },
            { value: [85, 90, 80, 88, 84], name: "腾讯" },
            { value: [78, 82, 85, 80, 81], name: "百度" },
            { value: [82, 80, 75, 90, 82], name: "京东" },
            { value: [92, 88, 90, 86, 90], name: "华为" },
          ],
        },
      ],
    });
    return;
  }

  // 获取选中部门对应的模拟数据
  const { customerScores } = getDeptCustomerSatisfactionData(
    selectedDeptForChart.value
  );

  // 准备柱状图数据
  const customers = Object.keys(customerScores);
  const scores = customers.map((customer) => customerScores[customer].score);

  // 设置柱状图
  chart.setOption({
    title: {
      text: `${getDepartmentName(selectedDeptForChart.value)}客户满意度`,
      left: "center",
    },
    tooltip: { trigger: "axis" },
    legend: { show: false },
    xAxis: { type: "category", data: customers },
    yAxis: { type: "value", min: 0, max: 100, name: "满意度" },
    series: [
      {
        data: scores.map((score) => ({
          value: score,
          itemStyle: { color: getSatisfactionColor(score) },
        })),
        type: "bar",
        label: {
          show: true,
          position: "top",
          formatter: "{c}分",
        },
      },
    ],
  });
};

// 根据部门ID获取部门名称
const getDepartmentName = (deptId: string): string => {
  for (const dept of departmentOptions) {
    if (dept.value === deptId) return dept.title;
    if (dept.children) {
      for (const child of dept.children) {
        if (child.value === deptId) return child.title;
      }
    }
  }
  return deptId;
};

// 初始化图表
const initCharts = () => {
  // 满意度趋势图
  if (satisfactionTrendChart.value) {
    const chart = echarts.init(satisfactionTrendChart.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: [
          "2023-05",
          "2023-06",
          "2023-07",
          "2023-08",
          "2023-09",
          "2023-10",
        ],
      },
      yAxis: {
        type: "value",
        min: 50,
        max: 100,
      },
      series: [
        {
          name: "满意度",
          type: "line",
          smooth: true,
          data: [76.5, 82.3, 80.1, 84.5, 83.2, 85.6],
          itemStyle: {
            color: "#1890ff",
          },
          lineStyle: {
            width: 3,
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }],
          },
        },
      ],
    });
  }

  // 投诉等级分布环形图
  if (complaintLevelChart.value) {
    const chart = echarts.init(complaintLevelChart.value);
    chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        data: ["A级", "B级", "C级", "D级", "E级"],
      },
      series: [
        {
          name: "投诉等级",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: "bold",
            },
          },
          data: [
            { value: 15, name: "A级", itemStyle: { color: "#ff4d4f" } },
            { value: 25, name: "B级", itemStyle: { color: "#ff7a45" } },
            { value: 35, name: "C级", itemStyle: { color: "#faad14" } },
            { value: 20, name: "D级", itemStyle: { color: "#52c41a" } },
            { value: 5, name: "E级", itemStyle: { color: "#bfbfbf" } },
          ],
        },
      ],
    });
  }

  // 部门满意度排名柱状图
  if (departmentSatisfactionChart.value) {
    const chart = echarts.init(departmentSatisfactionChart.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      xAxis: { type: "value", min: 50, max: 100 },
      yAxis: {
        type: "category",
        data: ["技术部", "客服部", "销售部", "财务部"],
      },
      series: [
        {
          name: "满意度分数",
          type: "bar",
          data: [88.5, 83.6, 79.8, 85.2],
          itemStyle: {
            color: function (params: any) {
              const score = params.data;
              if (score >= 80) return "#52c41a";
              if (score >= 60) return "#faad14";
              return "#ff4d4f";
            },
          },
          label: {
            show: true,
            position: "right",
            formatter: "{c}",
          },
        },
      ],
    });
  }

  // 月度投诉趋势图
  if (complaintTrendChart.value) {
    const chart = echarts.init(complaintTrendChart.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      legend: { data: ["投诉数量", "环比变化"] },
      xAxis: {
        type: "category",
        data: [
          "2023-05",
          "2023-06",
          "2023-07",
          "2023-08",
          "2023-09",
          "2023-10",
        ],
      },
      yAxis: [
        { type: "value", name: "投诉数量" },
        { type: "value", name: "环比(%)", max: 50, min: -50 },
      ],
      series: [
        {
          name: "投诉数量",
          type: "bar",
          data: [45, 52, 49, 38, 42, 35],
          barWidth: "40%",
        },
        {
          name: "环比变化",
          type: "line",
          yAxisIndex: 1,
          data: [null, 15.6, -5.8, -22.4, 10.5, -16.7],
          lineStyle: { width: 3 },
          symbol: "circle",
          symbolSize: 8,
        },
      ],
    });
  }

  // 客户满意度雷达图
  if (customerSatisfactionRadar.value) {
    const chart = echarts.init(customerSatisfactionRadar.value);
    chart.setOption({
      tooltip: {},
      legend: {
        data: ["阿里巴巴", "腾讯", "百度", "京东", "华为"],
      },
      radar: {
        indicator: [
          { name: "响应速度", max: 100 },
          { name: "专业度", max: 100 },
          { name: "解决效率", max: 100 },
          { name: "服务态度", max: 100 },
          { name: "整体满意度", max: 100 },
        ],
      },
      series: [
        {
          type: "radar",
          data: [
            { value: [90, 85, 88, 92, 89], name: "阿里巴巴" },
            { value: [85, 90, 80, 88, 84], name: "腾讯" },
            { value: [78, 82, 85, 80, 81], name: "百度" },
            { value: [82, 80, 75, 90, 82], name: "京东" },
            { value: [92, 88, 90, 86, 90], name: "华为" },
          ],
        },
      ],
    });
  }

  // 投诉等级月度分布
  if (complaintLevelMonthlyChart.value) {
    const chart = echarts.init(complaintLevelMonthlyChart.value);
    chart.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { data: ["A级", "B级", "C级", "D级", "E级"] },
      xAxis: {
        type: "category",
        data: [
          "2023-05",
          "2023-06",
          "2023-07",
          "2023-08",
          "2023-09",
          "2023-10",
        ],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "A级",
          type: "bar",
          stack: "总量",
          itemStyle: { color: "#ff4d4f" },
          data: [8, 10, 9, 6, 7, 5],
        },
        {
          name: "B级",
          type: "bar",
          stack: "总量",
          itemStyle: { color: "#ff7a45" },
          data: [12, 14, 13, 10, 12, 8],
        },
        {
          name: "C级",
          type: "bar",
          stack: "总量",
          itemStyle: { color: "#faad14" },
          data: [15, 16, 15, 12, 13, 12],
        },
        {
          name: "D级",
          type: "bar",
          stack: "总量",
          itemStyle: { color: "#52c41a" },
          data: [7, 8, 9, 8, 7, 8],
        },
        {
          name: "E级",
          type: "bar",
          stack: "总量",
          itemStyle: { color: "#bfbfbf" },
          data: [3, 4, 3, 2, 3, 2],
        },
      ],
    });
  }
};

// 应用筛选
const applyFilters = () => {
  console.log("应用筛选", {
    dateRange: dateRange.value,
    departments: selectedDepts.value,
    customers: selectedCustomers.value,
  });
  initCharts(); // 重新加载图表
  updateCustomerSatisfactionChart(); // 更新客户满意度图表
};

onMounted(() => {
  initCharts();
  updateCustomerSatisfactionChart(); // 初始化客户满意度图表

  // 窗口大小改变时重绘图表
  window.addEventListener("resize", () => {
    const charts = [
      satisfactionTrendChart.value,
      complaintLevelChart.value,
      departmentSatisfactionChart.value,
      complaintTrendChart.value,
      customerSatisfactionRadar.value,
      complaintLevelMonthlyChart.value,
    ];

    charts.forEach((chartEl) => {
      if (chartEl) {
        const chart = echarts.getInstanceByDom(chartEl);
        chart?.resize();
      }
    });
  });
});
</script>

<style scoped>
.satisfaction-dashboard {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.chart-row {
  margin-bottom: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.metric-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trend-indicator {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.trend-indicator span {
  margin-right: 8px;
}

.chart-filter-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
