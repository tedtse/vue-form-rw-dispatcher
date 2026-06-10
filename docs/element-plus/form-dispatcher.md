# FormDispatcher

结合 `el-form` ${Config.namespace}State 状态分发

## 基本使用

:::demo

form-dispatcher/base

:::

## 行内表单

当垂直方向空间受限且表单较简单时，可以在一行内放置表单。

通过设置 `inline` 属性为 `true` 可以让表单域变为行内的表单域。

:::demo

form-dispatcher/inline-form

:::

## 对齐方式

:::demo

form-dispatcher/align

:::

:::

## 表单校验

:::demo

form-dispatcher/validate

:::

## 尺寸控制

表单中的所有子组件都继承了该表单的 `size` 属性。 同样，`form-item` 也有一个 `size` 属性。

如果希望某个表单项或某个表单组件的尺寸不同于 `Form` 上的 `size` 属性，直接为这个表单项或表单组件设置自己的 `size` 属性即可。

:::demo

form-dispatcher/size

:::
