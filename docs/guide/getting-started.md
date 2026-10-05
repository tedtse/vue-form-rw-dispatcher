# 快速开始

## 介绍

Element Plus Form Dispatcher 是基于 Element Plus 的表单读写状态分发器。它根据 `rwDispatcherState`（`"write"` 或 `"read"`）自动切换表单组件的编辑态与只读态，无需手动维护两套模板。

## 安装

```bash
npm install element-plus-form-dispatcher
```

或者使用 pnpm：

```bash
pnpm add element-plus-form-dispatcher
```

### 前置依赖

| 包名                    | 版本要求 |
| ----------------------- | -------- |
| vue                     | ^3.5.26  |
| element-plus            | ^2.13.0  |
| @element-plus/icons-vue | ^2.3.2   |

## 基本用法

### 1. 注册插件

```typescript
// main.ts
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { DispatcherPlugin } from "element-plus-form-dispatcher";
import "element-plus-form-dispatcher/theme/index.css";
import App from "./App.vue";

createApp(App).use(ElementPlus).use(DispatcherPlugin).mount("#app");
```

### 2. 在模板中使用

通过 `rw-dispatcher-state` 控制读写状态：

```vue
<template>
  <el-form-dispatcher
    :model="form"
    label-width="auto"
    :rw-dispatcher-state="rwState"
  >
    <el-form-item label="名称">
      <el-input-dispatcher v-model="form.name" />
    </el-form-item>
    <el-form-item label="即时配送">
      <el-switch-dispatcher v-model="form.delivery" />
    </el-form-item>
  </el-form-dispatcher>

  <el-switch
    v-model="rwState"
    active-value="write"
    inactive-value="read"
    active-text="编辑"
    inactive-text="只读"
  />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { type RWDispatcherState } from "element-plus-form-dispatcher/helper";

const rwState = ref<RWDispatcherState>("write");

const form = reactive({
  name: "",
  delivery: false,
});
</script>
```

### 3. 使用 Provider 注入状态

也可以通过 `el-dispatcher-provider` 向下注入状态，避免逐层传递 prop：

```vue
<template>
  <el-dispatcher-provider :rw-dispatcher-state="rwState">
    <el-form-item label="名称">
      <el-input-dispatcher v-model="form.name" />
    </el-form-item>
    <el-form-item label="区域">
      <el-select-dispatcher v-model="form.region">
        <el-option label="上海" value="shanghai" />
        <el-option label="北京" value="beijing" />
      </el-select-dispatcher>
    </el-form-item>
  </el-dispatcher-provider>
</template>
```

## 可用组件

| 组件                           | 对应 Element Plus |
| ------------------------------ | ----------------- |
| `el-form-dispatcher`           | ElForm            |
| `el-input-dispatcher`          | ElInput           |
| `el-input-number-dispatcher`   | ElInputNumber     |
| `el-select-dispatcher`         | ElSelect          |
| `el-select-v2-dispatcher`      | ElSelectV2        |
| `el-cascader-dispatcher`       | ElCascader        |
| `el-switch-dispatcher`         | ElSwitch          |
| `el-checkbox-dispatcher`       | ElCheckbox        |
| `el-checkbox-group-dispatcher` | ElCheckboxGroup   |
| `el-radio-dispatcher`          | ElRadio           |
| `el-radio-group-dispatcher`    | ElRadioGroup      |
| `el-date-picker-dispatcher`    | ElDatePicker      |
| `el-time-picker-dispatcher`    | ElTimePicker      |
| `el-time-select-dispatcher`    | ElTimeSelect      |
| `el-tree-select-dispatcher`    | ElTreeSelect      |
| `el-dispatcher-provider`       | — (状态注入容器)  |
