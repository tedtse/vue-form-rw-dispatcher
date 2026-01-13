# SelectDispatcher

Element Plus 的 `el-select` 组件分发器，添加了只读功能。

## 基本用法

:::demo

select-dispatcher/basic

:::

## 禁用状态

禁用整个选择器组件

为 el-select 设置 disabled 属性，则整个选择器不可用。

:::demo

select-dispatcher/disabled

:::

## 尺寸

使用 `size` 属性改变选择器大小。 除了默认大小外，还有另外两个选项： `large`, `small`。

:::demo

select-dispatcher/size

:::

## 多选

多选选择器使用 tag 组件来展示已选中的选项。

:::demo

select-dispatcher/multiple

:::

## 将选项进行分组

你可以为选项进行分组来区分不同的选项

使用 el-option-group 对备选项进行分组，它的 label 属性为分组名

:::demo

select-dispatcher/grouping

:::

## 使用值键 value-key 属性

如果 Select 的绑定值为对象类型，请务必指定 `value-key` 作为它的唯一性标识。

通过使用 `value-key` 属性，可以正确处理带有重复 label 的数据。 这样虽然 label 是重复的，但任可通过 id 来确认唯一性。

:::demo

select-dispatcher/value-key

:::

## 自定义标签 (tag)

您可以自定义标签。

将自定义的标签插入 el-select 的 slot 中即可。 collapse-tags, collapse-tags-tooltip, max-collapse-tags 在此模式下不生效.

:::demo

select-dispatcher/custom-tag

:::

## 自定义标签 (label)

:::demo

select-dispatcher/custom-label

:::

## Slots

使用 `slots` 中的 `reader`, `writer` 覆盖读写状态渲染函数

:::demo

select-dispatcher/slots

:::

:::warning 注意

建议在 slots 中加上 key, 避免切换读写状态出现渲染切换不过来的情况

如示例中 #reader 加上了 key="reader", #writer 加上了 key="writer"

:::
