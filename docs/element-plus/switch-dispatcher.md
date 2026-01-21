# SwitchDispatcher

Element Plus 的 `el-switch` 组件分发器，添加了只读功能。

## 基本用法

:::demo

switch-dispatcher/basic

:::

## 文本与图标

可通过 `active-text` / `inactive-text` 控制读状态展示文本，`active-icon` / `inactive-icon` 可用于展示图标。

:::demo

switch-dispatcher/basic

:::

## Slots

使用 `slots` 中的 `reader`, `writer` 覆盖读写状态渲染函数。

:::warning 注意

建议在 slots 中加上 key, 避免切换读写状态出现渲染切换不过来的情况。

:::
