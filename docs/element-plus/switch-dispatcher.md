# SwitchDispatcher

Element Plus 的 `el-switch` 组件分发器，添加了只读功能。

## 基本用法

:::demo

switch-dispatcher/basic

:::

## 尺寸

:::demo

switch-dispatcher/sizes

:::

## 文字描述

使用`active-text`属性与`inactive-text`属性来设置开关的文字描述。 使用 `inline-prompt` 属性来控制文本是否显示在点内。

使用`active-text`属性与`inactive-text`属性来设置开关的文字描述。

:::demo

switch-dispatcher/text-description

:::

## 显示自定义图标

使用 `inactive-icon` 和 `active-icon` 属性来添加图标。 使用 `inline-prompt` 属性来控制图标显示在点内。

:::demo

switch-dispatcher/custom-icons

:::

## 扩展的 value 类型

:::demo

switch-dispatcher/extended-value-types

:::

## 禁用状态

:::demo

switch-dispatcher/disabled

:::

## Slots

使用 `slots` 中的 `reader`, `writer` 覆盖读写状态渲染函数。

:::warning 注意

建议在 slots 中加上 key, 避免切换读写状态出现渲染切换不过来的情况。

:::
