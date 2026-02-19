# CascaderDispatcher

Element Plus 的 `el-cascader` 组件分发器，添加了只读功能。

## 基础用法​

只需为 `Cascader` 的options属性指定选项数组即可渲染出一个级联选择器。 通过 `props.expandTrigger` 属性控制子节点的展开方式

:::demo

cascader-dispatcher/basic

:::

## 仅显示最后一级​

可以仅在输入框中显示选中项最后一级的标签，而不是选中项所在的完整路径。

属性 `show-all-levels` 定义了是否显示完整的路径， 将其赋值为 `false` 则仅显示最后一级。

:::demo

cascader-dispatcher/last-level

:::

## 多选
​
在标签中添加 :props="props" 并设置 props = { multiple: true } 来开启多选模式。

:::demo

cascader-dispatcher/multiple

:::

## 选择任意一级选项​

在单选模式下，你只能选择叶子节点；而在多选模式下，勾选父节点真正选中的都是叶子节点。 启用该功能后，可让父子节点取消关联，选择任意一级选项。

可通过 `props.checkStrictly = true` 来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。

:::demo

cascader-dispatcher/any-level

:::

## 自定义节点内容​

可以自定义备选项的节点内容

你可以通过 `scoped slot` 自定义节点的内容。 您可以访问 scope 中的 `node` 和 `data` 属性，分别表示当前节点的 Node 对象和当前节点的数据。

:::demo

cascader-dispatcher/custom-content

:::

## 自定义标签

将自定义的标签插入 `el-cascader` 的 slot 中即可。 `collapse-tags`, `collapse-tags-tooltip`, `max-collapse-tags` 在此模式下不生效。

:::demo

cascader-dispatcher/custom-tag

:::

## 已勾选项显示策略
​
控制在多选模式下已选值的显示方式。

在多选模式下，你可以使用 `show-checked-strategy `来控制已选值的显示方式。 默认策略为 `child`，即显示所有已选中的子节点。 `parent` 策略仅在其所有子节点都被选中时显示父节点。

:::demo

cascader-dispatcher/show-checked-strategy

:::
