# 分发器助手

分发器助手是一个工具库，用于定义分发器的行为。 不仅仅是 `Element Plus`，我们也可以为 `Ant Design Vue`、 `Naive UI`、 `Vant` 等主流组件库定义分发器，覆盖机械的增删查改页面，减少后续的维护成本。

主要方法有

## defineRWDispatcherPropType

通过 `ArrayPropsOptions` 或 `ObjectPropsOptions` 定义分发器的 props 类型, 并返回一个函数，用于定义分发器的行为。

- 示例

```ts
import { defineRWDispatcherPropType } from "@vue-form-rw-dispatcher/helper";

defineRWDispatcherPropType({
  name: "CustomDispatcher",
  props: {
    value: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  writerFn: (props, context) => WriterFn(props, context),
  readerFn: (props, context) => ReaderFn(props, context),
  options: {
    inheritAttrs: false,
  },
});
```

- 参数
  - name: 可选，分发器的名称

  - props: 可选，分发器的 props 类型，透传到读组件和写组件的 `props`, 必须是 Vue3 的 props 类型定义类型 `ArrayPropsOptions` 或 `ObjectPropsOptions`

  - writerFn: 必填，写组件的渲染函数

  - readerFn: 必填，读组件的渲染函数

  - options: 可选，同 `defineComponentOptions`, 透传到读组件和写组件的 `options` 中

## define-rw-dispatcher-generic

通过typescript 泛型的概念，定义分发器的 props 类型，同时定义分发器的行为。

- 示例

```ts
import { defineRWDispatcherGeneric } from "@vue-form-rw-dispatcher/helper";

defineRWDispatcherGeneric<Props>({
  name: "CustomDispatcher",
  writerFn: (props, context) => WriterFn(props, context),
  readerFn: (props, context) => ReaderFn(props, context),
  options: {
    inheritAttrs: false,
  },
});
```

- 参数
  - name: 可选，分发器的名称
  - writerFn: 必填，写组件的渲染函数
  - readerFn: 必填，读组件的渲染函数
  - options: 可选，同 `defineComponentOptions`, 透传到读组件和写组件的 `options` 中

## extendComponentJSX

通过 JSX 透传`props` `attrs` `slots` 到分发器的读组件和写组件中。

- 示例

```ts
import { extendComponentJSX } from "@vue-form-rw-dispatcher/helper";

const WriterFn = (props, context) => {
  return extendComponentJSX("el-input", props, context);
};
```

## extendComponentRender

通过 `render` 函数透传`props` `attrs` `slots` 到分发器的读组件和写组件中。

- 示例

```ts
import { extendComponentRender } from "@vue-form-rw-dispatcher/helper";

const WriterFn = (props, context) => {
  return extendComponentRender("el-input", props, context);
};
```

## Type

- RWDispatcherState
  - 定义分发器的状态类型，'reader' 或 'writer'。

- rwDispatcherProps

  分发器的固定 props 类型，这些 props 不需要透传到读组件和写组件的。代码实现如下：

```ts
  [`${Config.namespace}State`]: {
    type: String,
  },

```
