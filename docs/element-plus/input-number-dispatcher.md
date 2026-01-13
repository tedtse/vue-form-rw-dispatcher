# InputNumberDispatcher

Element Plus 的 `el-input-number` 组件分发器，添加了只读功能。

## 基础用法​

要使用它，只需要在 &lt;el-input-number&gt; 元素中使用 v-model 绑定变量即可，变量的初始值即为默认值。

:::demo

input-number-dispatcher/basic

:::

## 禁用状态​

:::demo

input-number-dispatcher/disabled

:::

## 精度​

设置 precision 属性可以控制数值精度，接收一个 Number。

:::demo

input-number-dispatcher/precision

:::

## 不同的输入框尺寸​

使用 size 属性额外配置尺寸，可选的尺寸大小为：large 或 small

:::demo

input-number-dispatcher/size

:::

## 带前缀和后缀
​
使用前缀和标名后缀。

:::demo

input-number-dispatcher/with-prefix-suffix

:::

## Slots

使用 `slots` 中的 `reader`, `writer` 覆盖读写状态渲染函数

:::demo

input-number-dispatcher/slots

:::

:::warning 注意

建议在 slots 中加上 key, 避免切换读写状态出现渲染切换不过来的情况

如示例中 #reader 加上了 key="reader", #writer 加上了 key="writer"

:::
