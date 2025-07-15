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

    <!-- 概览指标卡片 -->
    <a-row :gutter="16" class="overview-row">
      <a-col :span="4">
        <a-card class="overview-card">
          <template #title>
            <div class="card-title">
              <span>客户满意度</span>
              <a-tag color="#52c41a">核心指标</a-tag>
            </div>
          </template>
          <a-statistic
            :value="85.6"
            :precision="1"
            suffix="分"
            :value-style="{ color: '#52c41a', fontSize: '24px' }"
          />
          <div class="trend-info">
            <span>同比</span>
            <a-statistic
              :value="3.2"
              :precision="1"
              suffix="%"
              :value-style="{ color: '#3f8600', fontSize: '14px' }"
              :prefix="renderUpIcon()"
            />
          </div>
        </a-card>
      </a-col>
      <a-col :span="4">
        <a-card class="overview-card">
          <template #title>
            <div class="card-title">
              <span>月度投诉数</span>
            </div>
          </template>
          <a-statistic
            :value="35"
            :value-style="{ color: '#faad14', fontSize: '24px' }"
          />
          <div class="trend-info">
            <span>环比</span>
            <a-statistic
              :value="16.7"
              :precision="1"
              suffix="%"
              :value-style="{ color: '#cf1322', fontSize: '14px' }"
              :prefix="renderDownIcon()"
            />
          </div>
        </a-card>
      </a-col>
      <a-col :span="4">
        <a-card class="overview-card">
          <template #title>
            <div class="card-title">
              <span>投诉解决率</span>
            </div>
          </template>
          <a-statistic
            :value="94.3"
            :precision="1"
            suffix="%"
            :value-style="{ color: '#1890ff', fontSize: '24px' }"
          />
          <div class="trend-info">
            <span>环比</span>
            <a-statistic
              :value="2.5"
              :precision="1"
              suffix="%"
              :value-style="{ color: '#3f8600', fontSize: '14px' }"
              :prefix="renderUpIcon()"
            />
          </div>
        </a-card>
      </a-col>
      <a-col :span="4">
        <a-card class="overview-card">
          <template #title>
            <div class="card-title">
              <span>平均响应时间</span>
            </div>
          </template>
          <a-statistic
            :value="2.5"
            :precision="1"
            suffix="小时"
            :value-style="{ color: '#52c41a', fontSize: '24px' }"
          />
          <div class="trend-info">
            <span>环比</span>
            <a-statistic
              :value="12.3"
              :precision="1"
              suffix="%"
              :value-style="{ color: '#3f8600', fontSize: '14px' }"
              :prefix="renderUpIcon()"
            />
            <span class="trend-desc">响应更快</span>
          </div>
        </a-card>
      </a-col>
      <a-col :span="4">
        <a-card class="overview-card">
          <template #title>
            <div class="card-title">
              <span>退货率</span>
            </div>
          </template>
          <a-statistic
            :value="1.2"
            :precision="1"
            suffix="%"
            :value-style="{ color: '#52c41a', fontSize: '24px' }"
          />
          <div class="trend-info">
            <span>环比</span>
            <a-statistic
              :value="0.3"
              :precision="1"
              suffix="%"
              :value-style="{ color: '#3f8600', fontSize: '14px' }"
              :prefix="renderDownIcon()"
            />
            <span class="trend-desc">退货减少</span>
          </div>
        </a-card>
      </a-col>
      <a-col :span="4">
        <a-card class="overview-card">
          <template #title>
            <div class="card-title">
              <span>重复投诉率</span>
            </div>
          </template>
          <a-statistic
            :value="3.8"
            :precision="1"
            suffix="%"
            :value-style="{ color: '#faad14', fontSize: '24px' }"
          />
          <div class="trend-info">
            <span>环比</span>
            <a-statistic
              :value="1.5"
              :precision="1"
              suffix="%"
              :value-style="{ color: '#cf1322', fontSize: '14px' }"
              :prefix="renderUpIcon()"
            />
            <span class="trend-desc trend-warning">需关注</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 核心指标看板 -->
    <a-row :gutter="16" class="stats-row">
      <a-col :span="8">
        <a-card class="chart-card" title="月度投诉趋势">
          <div ref="miniComplaintTrendChart" style="height: 250px"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="chart-card" title="满意度趋势">
          <div ref="satisfactionTrendChart" style="height: 250px"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="chart-card" title="月客诉件数">
          <div class="complaint-header">
            <a-range-picker
              v-model:value="complaintDateRange"
              format="YYYY-MM"
              :placeholder="['开始月份', '结束月份']"
              picker="month"
            />
            <div ref="complaintLevelChart" style="height: 250px"></div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 客户满意度与投诉分析区 -->
    <a-row :gutter="16" class="chart-row">
      <a-col :xs="24" :sm="24" :md="8" :lg="8">
        <a-card class="chart-card" title="当月事业部客户质量满意度评分">
          <div ref="departmentSatisfactionChart" style="height: 380px"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="8" :lg="8">
        <a-card class="chart-card" title="客户满意度分布">
          <div class="chart-filter-wrapper">
            <a-select
              v-model:value="selectedCustomerTypeForChart"
              style="width: 200px; margin-bottom: 15px"
              placeholder="请选择客户类型"
              @change="updateCustomerSatisfactionChart"
            >
              <a-select-option value="">全部客户</a-select-option>
              <a-select-option
                v-for="type in customerTypeOptions"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <div ref="customerSatisfactionRadar" style="height: 320px"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="8" :lg="8">
        <a-card class="chart-card" title="投诉等级分布">
          <div ref="complaintLevelMonthlyChart" style="height: 320px"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 退货数据统计区 -->
    <ReturnsStatistics
      :total-returns="totalReturns"
      :returns-date-range="returnsDateRange"
      :top-departments="topDepartments"
      :department-returns="departmentReturns"
      @update-date-range="updateReturnsData"
    />

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
import ReturnsStatistics from "./dashboard/ReturnsStatistics.vue";
import {
  getDeptCustomerSatisfactionData,
  departmentOptions,
  customerOptions,
  complaintData,
  getReturnData,
  getTotalReturnsByMonth,
  getDepartmentReturnsByMonth,
} from "../data/mockData";

// 渲染图标
const renderUpIcon = () => h(ArrowUpOutlined);
const renderDownIcon = () => h(ArrowDownOutlined);
const complaintDateRange = ref<[Dayjs, Dayjs]>([
  dayjs().subtract(5, "month"),
  dayjs(),
]);
const returnsDateRange = ref<[Dayjs, Dayjs]>([
  dayjs().subtract(5, "month"),
  dayjs(),
]);
const totalReturns = ref(1284);
const departmentReturns = reactive({});
const topDepartments = ref(departmentOptions);
// 满意度颜色标识
const getSatisfactionColor = (score: number) => {
  if (score >= 80) return "#52c41a";
  if (score >= 60) return "#faad14";
  return "#ff4d4f";
};
const updateReturnsData = () => {
  if (!returnsDateRange.value) return;

  // 计算总退货数
  let total = 0;
  for (let i = 0; i < topDepartments.value.length; i++) {
    const dept = topDepartments.value[i];
    const deptReturns = Math.floor(Math.random() * 300) + 100; // 模拟数据
    departmentReturns[dept.value] = deptReturns;
    total += deptReturns;

    // 为子部门生成数据
    if (dept.children && dept.children.length > 0) {
      let subTotal = 0;
      dept.children.forEach((child) => {
        const childReturns = Math.floor(
          deptReturns * (Math.random() * 0.5 + 0.1)
        ); // 子部门占比10%-60%
        departmentReturns[child.value] = childReturns;
        subTotal += childReturns;
      });

      // 调整以确保子部门总和不超过父部门
      if (subTotal > deptReturns) {
        const ratio = deptReturns / subTotal;
        dept.children.forEach((child) => {
          departmentReturns[child.value] = Math.floor(
            departmentReturns[child.value] * ratio
          );
        });
      }
    }
  }

  totalReturns.value = total;
};
// 投诉等级颜色

const getDepartmentReturns = (deptValue: string) => {
  return departmentReturns[deptValue] || 0;
};

// 获取子部门退货数
const getSubDepartmentReturns = (deptValue: string) => {
  return departmentReturns[deptValue] || 0;
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

// 添加到现有的 ref 声明部分
const miniComplaintTrendChart = ref<HTMLElement | null>(null);

// 在 initCharts 函数中添加以下初始化代码
// 迷你投诉趋势图

// 客户满意度图表所选部门
const selectedDeptForChart = ref("");

// 更新客户满意度图表
// 添加客户类型选项
const customerTypeOptions = [
  { value: "automobile", label: "汽车制造商" },
  { value: "electronics", label: "电子产品厂商" },
  { value: "smartphone", label: "智能手机厂商" },
  { value: "optics", label: "光学设备厂商" },
  { value: "industrial", label: "工业制造商" },
];

// 将 selectedDeptForChart 改为 selectedCustomerTypeForChart
const selectedCustomerTypeForChart = ref("");

// 更新客户满意度图表函数
const updateCustomerSatisfactionChart = () => {
  if (!customerSatisfactionRadar.value) return;

  const chart =
    echarts.getInstanceByDom(customerSatisfactionRadar.value) ||
    echarts.init(customerSatisfactionRadar.value);
  chart.clear(); // 确保清除旧图表

  // 构建雷达图数据
  let radarData = [];
  let legendData = [];

  // 根据是否选择客户类型来过滤客户数据
  if (selectedCustomerTypeForChart.value) {
    // 根据选择的客户类型获取对应的客户满意度数据
    const customersByType = {
      automobile: ["上汽集团", "一汽集团", "比亚迪"],
      electronics: ["华为", "小米", "海信"],
      smartphone: ["OPPO", "VIVO", "三星"],
      optics: ["蔡司", "尼康", "佳能"],
      industrial: ["西门子", "ABB", "三菱电机"],
    };

    const selectedCustomers =
      customersByType[selectedCustomerTypeForChart.value] || [];

    // 为每个客户生成雷达图数据
    selectedCustomers.forEach((customer) => {
      legendData.push(customer);
      // 生成一些随机数据
      const baseScore = 75 + Math.floor(Math.random() * 15);
      radarData.push({
        name: customer,
        value: [
          baseScore + Math.floor(Math.random() * 10) - 5, // 响应速度
          baseScore + Math.floor(Math.random() * 10) - 5, // 专业度
          baseScore + Math.floor(Math.random() * 10) - 5, // 解决效率
          baseScore + Math.floor(Math.random() * 10) - 5, // 服务态度
          baseScore, // 整体满意度
        ],
      });
    });
  } else {
    // 使用默认的代表性客户数据
    legendData = ["华为", "上汽集团", "小米", "比亚迪", "西门子"];
    radarData = [
      { value: [92, 88, 90, 86, 90], name: "华为" },
      { value: [85, 90, 80, 88, 84], name: "上汽集团" },
      { value: [78, 82, 85, 80, 81], name: "小米" },
      { value: [82, 80, 75, 90, 82], name: "比亚迪" },
      { value: [88, 85, 87, 84, 86], name: "西门子" },
    ];
  }

  // 设置雷达图配置
  chart.setOption({
    title: selectedCustomerTypeForChart.value
      ? {
          text: `${getCustomerTypeLabel(
            selectedCustomerTypeForChart.value
          )}客户满意度`,
          left: "center",
        }
      : null,
    tooltip: {},
    legend: {
      data: legendData,
      type: "scroll",
      bottom: 0,
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
        data: radarData,
        lineStyle: {
          width: 2,
        },
        emphasis: {
          lineStyle: {
            width: 4,
          },
        },
      },
    ],
  });
};

// 根据客户类型ID获取客户类型名称
const getCustomerTypeLabel = (typeId) => {
  const type = customerTypeOptions.find((t) => t.value === typeId);
  return type ? type.label : "未知客户类型";
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
  if (miniComplaintTrendChart.value) {
    const chart = echarts.init(miniComplaintTrendChart.value);
    const months = [
      "2023-12",
      "2024-01",
      "2024-02",
      "2024-03",
      "2024-04",
      "2024-05",
    ];
    const complaints = [42, 38, 45, 40, 36, 35];

    // 计算环比变化
    const changes = [null];
    for (let i = 1; i < complaints.length; i++) {
      const change = (
        ((complaints[i] - complaints[i - 1]) / complaints[i - 1]) *
        100
      ).toFixed(1);
      changes.push(parseFloat(change));
    }

    chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        top: "15%",
        left: "3%",
        right: "3%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: months,
        axisLine: { lineStyle: { color: "#f0f0f0" } },
        axisLabel: { fontSize: 10 },
      },
      yAxis: [
        {
          type: "value",
          name: "投诉数",
          nameTextStyle: { fontSize: 10 },
          axisLabel: { fontSize: 10 },
          splitLine: { lineStyle: { type: "dashed" } },
        },
        {
          type: "value",
          name: "环比",
          nameTextStyle: { fontSize: 10 },
          axisLabel: {
            fontSize: 10,
            formatter: "{value}%",
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "投诉数量",
          type: "bar",
          data: complaints,
          barWidth: "40%",
          itemStyle: { color: "#faad14" },
        },
        {
          name: "环比变化",
          type: "line",
          yAxisIndex: 1,
          data: changes,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2 },
          itemStyle: {
            color: function (params) {
              return params.value >= 0 ? "#cf1322" : "#52c41a";
            },
          },
        },
      ],
    });
  }
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

  // 部门满意度排名柱状图 - 调整为更长的图表
  if (departmentSatisfactionChart.value) {
    const chart = echarts.init(departmentSatisfactionChart.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      xAxis: { type: "value", min: 50, max: 100 },
      yAxis: {
        type: "category",
        data: ["技术部", "客服部", "销售部", "财务部", "生产部", "研发部"],
        axisLabel: {
          interval: 0,
          rotate: 0,
        },
      },
      grid: {
        left: "15%",
        right: "10%",
        top: "5%",
        bottom: "5%",
        containLabel: true,
      },
      series: [
        {
          name: "满意度分数",
          type: "bar",
          data: [88.5, 83.6, 79.8, 85.2, 81.9, 87.3],
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
  updateReturnsData();
  // 窗口大小改变时重绘图表
  window.addEventListener("resize", () => {
    const charts = [
      satisfactionTrendChart.value,
      complaintLevelChart.value,
      departmentSatisfactionChart.value,
      complaintTrendChart.value,
      customerSatisfactionRadar.value,
      complaintLevelMonthlyChart.value,
      miniComplaintTrendChart.value,
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

.overview-row {
  margin-bottom: 20px;
}

.overview-card {
  height: 100%;
  border-radius: 4px;
}

.overview-card :deep(.ant-card-head) {
  min-height: 36px;
  padding: 0 12px;
  border-bottom: 0;
}

.overview-card :deep(.ant-card-head-title) {
  padding: 8px 0;
}

.overview-card :deep(.ant-card-body) {
  padding: 12px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.trend-info {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.trend-info span {
  margin-right: 4px;
}

.trend-desc {
  margin-left: 8px;
  color: #3f8600;
}

.trend-warning {
  color: #cf1322;
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
.satisfaction-dashboard {
  padding: 20px;
}
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

/* 可能需要添加一些额外的样式 */
.chart-card {
  height: 100%;
}

/* 添加到现有的 <style scoped> 部分 */
.complaint-trend-card :deep(.ant-card-body) {
  padding: 0 12px 12px;
}

.complaint-trend-card .chart-title {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;
}
</style>
