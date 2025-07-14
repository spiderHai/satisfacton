import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/

export default defineConfig({
  base: "/satisfacton/", // 👈 这里必须是你的仓库名
  plugins: [vue()],
});
