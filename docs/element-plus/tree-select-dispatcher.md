# TreeSelectDispatcher

Element Plus 的 `el-tree-select` 组件分发器，添加了只读功能。

## 基础用法​

树状选择器

:::demo

tree-select-dispatcher/basic

:::

## 选择任意级别​

当属性 `check-strictly=true` 时，任何节点都可以被选择，否则只有子节点可被选择。

:::demo

tree-select-dispatcher/check-strictly

:::

## 多选​

通过点击或复选框选择多个选项。

:::demo

tree-select-dispatcher/multiple

:::

## 禁用选项​

使用 disabled 字段禁用选项。

:::demo

tree-select-dispatcher/disabled

:::

## 可筛选​

使用关键字筛选或自定义筛选方法。 `filterMethod`可以自定义数据筛选的方法， `filterNodeMethod`可以自定义节点数据筛选的方法。

:::demo

tree-select-dispatcher/filterable

:::

## 自定义内容​

自定义树节点的内容。

:::demo

tree-select-dispatcher/custom-content

:::

## 使用 node-key 属性​

默认情况下，modelValue 会查找 value 键。 对于其他数据结构，必须提供 node-key 才能正常工作。

:::demo

tree-select-dispatcher/node-key

:::
