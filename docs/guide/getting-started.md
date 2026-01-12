# 快速开始

## 介绍

Vue Form RW Dispatcher 是一个专为 Vue.js 应用设计的表单读写分发器。它可以帮助您轻松管理表单的读取和写入操作，提供统一的接口和状态管理。

## 安装

```bash
npm install vue-form-rw-dispatcher
```

或者使用 pnpm：

```bash
pnpm add vue-form-rw-dispatcher
```

## 基本用法

### 1. 引入组件

```javascript
import VueFormRWDispatcher from "vue-form-rw-dispatcher";
```

### 2. 注册组件

```javascript
export default {
  components: {
    VueFormRWDispatcher,
  },
};
```

### 3. 在模板中使用

```vue
<template>
  <vue-form-rw-dispatcher :config="formConfig" @submit="handleSubmit" />
</template>
```

## 下一步

查看[配置指南](/config/)了解更多配置选项。
