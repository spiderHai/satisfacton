<template>
  <div ref="chartRef" style="height: 300px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
// 按需引入 ECharts，优化体积
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);


const props = defineProps({
  departments: {
    type: Array,
    default: () => ["技术部", "客服部", "销售部", "财务部"],
  },
  scores: {
    type: Array,
    default: () => [88.5, 83.6, 79.8, 85.2],
  },
});

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

const renderChart = () => {
  if (!chartRef.value) return;

  if (!chart) {
    chart = echarts.init(chartRef.value);
  }

  chart.setOption({
    tooltip: { trigger: "axis" },
    xAxis: { type: "value", min: 50, max: 100 },
    yAxis: {
      type: "category",
      data: props.departments,
    },
    series: [
      {
        name: "满意度分数",
        type: "bar",
        data: props.scores,
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
};

watch(
  () => [props.departments, props.scores],
  () => {
    renderChart();
  },
  { deep: true }
);

onMounted(() => {
  renderChart();
  window.addEventListener("resize", renderChart);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", renderChart);
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>
