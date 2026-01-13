import { defineConfig } from "vitepress";
import { getViteConfig } from "./vite";
import { mdPlugin } from "./markdown";

export default defineConfig({
  base: "/",
  server: {
    port: 5173,
    strictPort: true,
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "Vue Form RW Dispatcher",
      description: "Vue 表单读写分发器文档",
    },
  },
  themeConfig: {
    nav: [{ text: "指南", link: "/guide/getting-started" }],
    sidebar: [
      {
        text: "指南",
        items: [{ text: "快速开始", link: "/guide/getting-started" }],
      },
      {
        text: "Components",
        items: [
          { text: "Input", link: "/element-plus/input-dispatcher" },
          { text: "Select", link: "/element-plus/select-dispatcher" },
          {
            text: "InputNumber",
            link: "/element-plus/input-number-dispatcher",
          },
          { text: "DatePicker", link: "/element-plus/date-picker-dispatcher" },
        ],
      },
    ],
  },
  vite: getViteConfig(),
  markdown: {
    config: (md) => mdPlugin(md),
  },
});
