import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { getViteConfig } from "./vite";
import { mdPlugin } from "./markdown";

export default withMermaid(
  defineConfig({
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
          items: [
            { text: "快速开始", link: "/guide/getting-started" },
            { text: "CSS 变量", link: "/guide/css-vars" },
          ],
        },
        {
          text: "组件",
          items: [
            { text: "Input", link: "/element-plus/input-dispatcher" },
            { text: "Select", link: "/element-plus/select-dispatcher" },
            { text: "Select V2", link: "/element-plus/select-v2-dispatcher" },
            { text: "Cascader", link: "/element-plus/cascader-dispatcher" },
            {
              text: "TreeSelect",
              link: "/element-plus/tree-select-dispatcher",
            },
            { text: "Radio", link: "/element-plus/radio-dispatcher" },
            { text: "Checkbox", link: "/element-plus/checkbox-dispatcher" },
            {
              text: "InputNumber",
              link: "/element-plus/input-number-dispatcher",
            },
            {
              text: "DatePicker",
              link: "/element-plus/date-picker-dispatcher",
            },
            {
              text: "TimePicker",
              link: "/element-plus/time-picker-dispatcher",
            },
            {
              text: "TimeSelect",
              link: "/element-plus/time-select-dispatcher",
            },
            { text: "Switch", link: "/element-plus/switch-dispatcher" },
            { text: "Form", link: "/element-plus/form-dispatcher" },
            {
              text: "DispatcherProvider",
              link: "/element-plus/dispatcher-provider",
            },
          ],
        },
        {
          text: "进阶",
          items: [
            {
              text: "自定义分发器",
              link: "/element-plus/custom-dispatcher",
            },
            {
              text: "分发器原理",
              link: "/element-plus/principle-dispatcher",
            },
            {
              text: "分发器助手",
              link: "/element-plus/helper",
            },
          ],
        },
      ],
    },
    vite: getViteConfig(),
    markdown: {
      config: (md) => mdPlugin(md),
    },
  }),
);
