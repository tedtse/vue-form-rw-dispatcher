# InputDispatcher

Element Plus 的 `el-input` 组件分发器，添加了只读功能。

## 基本用法

:::demo

input-dispatcher/base

:::

## 禁用状态

通过 `disabled` 属性指定是否禁用 input 组件

:::demo

input-dispatcher/disabled

:::

## 格式化

在 `formatter` 的情况下显示值，我们通常同时使用 `parser`

:::demo

input-dispatcher/formatter

:::

## 密码框

使用 `show-password` 属性即可得到一个可切换显示隐藏的密码框

:::demo

input-dispatcher/password

:::

## 带图标的输入框

带有图标标记输入类型

要在输入框中添加图标，你可以简单地使用 prefix-icon 和 suffix-icon 属性。 另外， prefix 和 suffix 命名的插槽也能正常工作。

:::demo

input-dispatcher/with-icon

:::

## 复合型输入框

可以在输入框中前置或后置一个元素，通常是标签或按钮。

可通过 slot 来指定在 Input 中分发的前置或者后置的内容。

:::demo

input-dispatcher/mixed-input

:::

## 尺寸

使用 `size` 属性改变输入框大小。 除了默认大小外，还有另外两个选项： `large`, `small`。

:::demo

input-dispatcher/various-size

:::

## Slots

使用 `slots` 中的 `reader`, `writer` 覆盖读写状态渲染函数

:::demo

input-dispatcher/slots

:::

:::warning 注意

建议在 slots 中加上 key, 避免切换读写状态出现渲染切换不过来的情况

如示例中 #reader 加上了 key="reader", #writer 加上了 key="writer"

:::
