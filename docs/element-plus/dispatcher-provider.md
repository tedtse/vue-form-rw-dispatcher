# ElRWDispatcherProvider

局部几个dispatcher的共同状态管理

## 基本使用

:::demo

dispatcher-provider/base

:::

## 尺寸控制

局部所有子组件都继承了provider的 `size` 属性。

:::demo

dispatcher-provider/size

:::

## 禁用表单

:::demo

dispatcher-provider/disabled

:::

### API

| 属性                | 说明       | 类型                              | 默认值    |
| ------------------- | ---------- | --------------------------------- | --------- |
| rw-dispatcher-state | 读写状态   | `"write" \| "read"`               | `"write"` |
| size                | 子组件尺寸 | `"large" \| "default" \| "small"` | —         |
| disabled            | 禁用子组件 | `boolean`                         | `false`   |
