<template>
  <a-config-provider>
    <div class="app-container">
      <a-layout>
        <a-layout-header class="header">
          <div class="logo">客户满意度数据看板</div>
        </a-layout-header>
        <a-layout-content class="content">
          <SatisfactionDashboard />
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          客户满意度看板系统 ©2023 Created by Your Company
        </a-layout-footer>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import SatisfactionDashboard from "./components/SatisfactionDashboard.vue";
</script>

<style>
.app-container {
  min-height: 100vh;
}

.header {
  background: #001529;
  padding: 0 50px;
  display: flex;
  align-items: center;
}

.logo {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.content {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 134px);
}
</style>
