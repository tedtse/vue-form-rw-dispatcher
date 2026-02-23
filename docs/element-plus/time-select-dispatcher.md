# TimeSelectDispatcher

Element Plus 的 `el-time-select` 组件分发器，添加了只读功能。

## 基本用法

:::demo

time-select-dispatcher/basic

:::

## 时间格式

使用 `format` 属性来控制时间格式 (小时以及分钟)。

:::demo

time-select-dispatcher/time-formats

:::

## Slots

使用 `slots` 中的 `${Config.namespace}Reader`, `${Config.namespace}Writer` 覆盖读写状态渲染函数。

:::demo

time-select-dispatcher/slots

:::
