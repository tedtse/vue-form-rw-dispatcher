# 自定义分发器

现实开发过程中，我们可能会遇到一些场景，常规的表单分发器不能满足实际需求，需要自定义分发器。

## api

```ts
import { defineRWDispatcher } from "@vue-form-rw-dispatcher/helper";

defineRWDispatcher<Props>({
  name: "CustomDispatcher",
  writerFn: (props, context) => WriterFn(props, context),
  readerFn: (props, context) => ReaderFn(props, context),
});
```

## 自定义 color-picker-dispatcher

::: demo

custom-dispatcher/color-picker-dispatcher

:::

## 自定义 slider-dispatcher

::: demo

custom-dispatcher/slider-dispatcher

:::
