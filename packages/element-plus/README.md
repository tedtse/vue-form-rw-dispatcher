# Vue Form RW Dispatcher

> 一个强大的 Vue 3 表单读写分发器：通过自定义「分发器（Dispatcher）」组件，**一套代码同时满足表单的填写（write）与展示（read）两种场景**，无需重复编写只读视图。

在后台/审批/详情类系统中，同一份表单常常要在「编辑态」和「只读态」之间切换。传统做法要写两遍模板。本项目为 [Element Plus](https://element-plus.org/) 常用表单控件封装了一层分发器组件，你只需切换一个状态值，即可在「可交互控件」与「纯文本/自定义只读渲染」之间无缝切换，并且读写两侧都会自动透传 `props`、`attrs`、`slots`。

## ✨ 特性

- **一套代码，读写两用**：切换 `rwDispatcherState`（`"write" | "read"`）即可，无需维护两套视图。
- **完全兼容 Element Plus**：分发器透传原生控件的全部 `props` / `attrs` / `slots`，用法与表单组件等保持一致。
- **局部状态管理**：`<el-dispatcher-provider>` 让一批子组件共享读写状态、`size`、`disabled` 等，无需逐项设置。
- **可覆盖的读写渲染**：通过 `#rw-dispatcher-reader` / `#rw-dispatcher-writer` 插槽自定义任一状态的渲染内容。
- **可扩展**：`defineRWDispatcher` 让任意组件（如 color-picker、slider）快速接入读写分发能力。
- **可配置命名空间**：默认命名空间 `rwDispatcher`，可按需自定义。
- **配套主题系统**：内置基于 SCSS 的主题构建产物与 CSS 变量。
- **TypeScript 优先**。

## 🧱 技术栈

| 类别      | 选型                                          |
| --------- | --------------------------------------------- |
| 框架      | Vue 3.5                                       |
| 语言      | TypeScript 5.9                                |
| UI 组件库 | Element Plus 2.13 + `@element-plus/icons-vue` |
| 打包      | Rolldown（ESM / CJS / UMD）                   |
| 类型声明  | vue-tsc                                       |
| 主题      | 自研 SCSS 主题构建                            |
| 测试      | Vitest + `@vue/test-utils`                    |
| 文档站    | VitePress                                     |
| 包管理    | pnpm workspace（monorepo）                    |

## 💡 核心概念

### 1. 读写状态 `rwDispatcherState`

默认命名空间为 `rwDispatcher`，因此状态属性为 `rwDispatcherState`（模板中写作 `rw-dispatcher-state`），取值 `"write"`（默认）或 `"read"`。它可通过 **prop** 指定，也可由上层 **Provider 注入**。

### 2. 分发原理

分发器会透传 `props` / `attrs` / `slots`，再依据状态渲染不同组件：

```
开始 → 分发器组件 → { 读状态? }
        ├── 是 → 透传 props/attrs/slots → 渲染「读组件」
        └── 否 → 透传 props/attrs/slots → 渲染「写组件」
```

### 3. 局部状态管理 `<el-dispatcher-provider>`

将多个分发器包裹进 Provider，统一控制读写状态、`size`、`disabled` 等，避免逐个设置：

```vue
<template>
  <el-dispatcher-provider :rw-dispatcher-state="state" disabled size="small">
    <el-form-item label="姓名">
      <el-input-dispatcher v-model="form.name" />
    </el-form-item>
    <el-form-item label="部门">
      <el-select-dispatcher v-model="form.dept" :options="depts" />
    </el-form-item>
  </el-dispatcher-provider>
</template>
```

### 4. 自定义读/写渲染

通过 `#rw-dispatcher-reader` / `#rw-dispatcher-writer` 插槽覆盖任一状态的渲染：

```vue
<el-input-dispatcher v-model="form.name" :rw-dispatcher-state="state">
  <template #rw-dispatcher-reader="{ value }" key="reader">
    <b>{{ value }}</b>
  </template>
  <template #rw-dispatcher-writer key="writer">
    <!-- 自定义写入态渲染 -->
  </template>
</el-input-dispatcher>
```

> 建议为读/写插槽各自加上 `key`，避免切换状态时渲染不及时。

### 5. 自定义分发器

任何组件都可以用 `defineRWDispatcher` 接入读写分发能力：

```ts
import { defineRWDispatcher } from "element-plus-form-dispatcher/helper";

export const ElColorPickerDispatcher = defineRWDispatcher<ColorPickerProps>({
  name: "ElColorPickerDispatcher",
  writerFn: (props, context) => extendComponent(ElColorPicker, props, context),
  readerFn: (props) => <span style={{ color: props.modelValue }}>{props.modelValue}</span>,
});
```
