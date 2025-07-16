import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    viteSingleFile(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // 不自动导入样式
        }),
      ],
    }),
  ],
  build: {
    assetsInlineLimit: 100000000,
    minify: false,
  },
});
