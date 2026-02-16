# SelectV2Dispatcher

Element Plus v2 的 `el-select` 组件分发器，添加了只读功能。

## 基本用法

:::demo

select-v2-dispatcher/basic

:::

## 禁用选择器本身或选项

选择禁用 Select 或者 Select 中的某个选项。

:::demo

select-v2-dispatcher/disabled

:::

## 尺寸

使用 `size` 属性改变选择器大小。 除了默认大小外，还有另外两个选项： `large`, `small`。

:::demo

select-v2-dispatcher/size

:::

## 多选

多选选择器使用 tag 组件来展示已选中的选项。

:::demo

select-v2-dispatcher/multiple

:::

## 自定义选项的渲染模板

:::demo

select-v2-dispatcher/customized-option

:::

## 创建临时选项

创建并选中未包含在初始选项中的条目。

通过使用 `allow-create` 属性，用户可以通过输入框创建新项目。 为了使 `allow-create` 正常工作， `filterable` 的值必须为 true。 本例还使用了 `default-first-option` 属性， 在该属性为 `true` 的情况下，按下回车就可以选中当前选项列表中的第一个选项，无需使用鼠标或键盘方向键进行定位。

:::demo

select-v2-dispatcher/allow-create

:::

## 使用 value-key 键属性

:::demo

select-v2-dispatcher/value-key

:::

## 自定义选项

当您的 `options` 格式不同于默认格式 您可以通过 `props` 属性自定义 `options`

:::demo

select-v2-dispatcher/customized-option

:::

## 自定义标签


将自定义的标签插入 `el-select` 的 `slot` 中即可。 `collapse-tags`, `collapse-tags-tooltip`, `max-collapse-tags` 在此模式下不生效.

:::demo

select-v2-dispatcher/custom-tag

:::

## 空值配置
​
若想配置如空字符串为有效值而不是空值，可以配置 `empty-values` 为 [null, undefined].

如果您想要将清空值更改为 null, 请设置 value-on-clear 为 null

:::demo

select-v2-dispatcher/null

:::

## 自定义标签

:::demo

select-v2-dispatcher/custom-label

:::
