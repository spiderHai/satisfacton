import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteSingleFile } from "vite-plugin-singlefile";
// https://vite.dev/config/

export default defineConfig({
  base: "./", // 👈 这里必须是你的仓库名
  plugins: [vue(), viteSingleFile()],

  build: {
    assetsInlineLimit: 100000000, // 尽可能内联资源
  },
});
