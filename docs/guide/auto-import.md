# 自动导入集成（on-demand import）

如果你用 `unplugin-vue-components` 的 `ElementPlusResolver` 做按需自动导入，引入
`element-plus-form-dispatcher` 后会遇到一个坑：**`*Dispatcher` 组件被误解析成
element-plus 组件**。本页解释原因，并给出两种互斥的解决方案，按项目偏好二选一。

## 问题：ElementPlusResolver 的贪婪匹配

`ElementPlusResolver` 判断"是不是 element-plus 组件"的规则非常简单——只要组件名
形如 `/^El[A-Z]/`（`El` + 大写字母）就认领，并 **不校验** element-plus 是否真的导出
该名字。源码里等价于：

```js
function resolveComponent(name, options) {
  if (options.exclude && name.match(options.exclude)) return;
  if (!/^El[A-Z]/.test(name)) return; // 只要 ^El+大写 就认领
  // ... 返回 { name, from: 'element-plus/es', sideEffects: [样式] }
}
```

我们的组件为了在模板里与 element-plus 完全对称（`<el-input>` → `<el-input-dispatcher>`）
而采用 `ElInputDispatcher` 命名，正好命中 `^El[A-Z]`。于是 `ElementPlusResolver` 会：

- 生成错误导入 `import { ElInputDispatcher } from 'element-plus/es'`（并不存在）；
- 顺带注入不存在的样式副作用 `element-plus/es/components/input-dispatcher/style/css`。

结果通常是构建报错或组件解析异常。

> 补充：这些 `*Dispatcher` 组件其实已由 `DispatcherPlugin`（`main.ts` 里 `.use`）**全局注册**，
> 本身并不依赖自动导入。这里的处理只是为了**不让 `ElementPlusResolver` 抢先错误接管**它们。

## 方案 A：使用库自带的 resolver（推荐，类型友好）

库在独立子路径 `element-plus-form-dispatcher/resolver` 导出了 `FormDispatcherResolver`。
它**依赖为零**，不会把运行时组件树（`vue` / `element-plus`）拖进 `vite.config` 这类
Node 端配置文件。返回的对象抢先认领 `*Dispatcher` 并指向正确的包：

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { FormDispatcherResolver } from "element-plus-form-dispatcher/resolver";

export default {
  plugins: [
    Components({
      // ⚠️ 顺序关键：FormDispatcherResolver 必须在 ElementPlusResolver 之前。
      resolvers: [FormDispatcherResolver(), ElementPlusResolver()],
    }),
  ],
};
```

可选项：

```ts
FormDispatcherResolver({
  suffix: "Dispatcher", // 匹配后缀，默认 "Dispatcher"
  from: "element-plus-form-dispatcher", // 导入来源，默认本包
});
```

因为组件被 resolver 正常解析，`unplugin-vue-components` 会把它们写进
`components.d.ts`，所以对 `vue-tsc` 类型检查也友好。

## 方案 B：让 ElementPlusResolver 主动放过（零 resolver）

不引入任何自定义 resolver，改用 `ElementPlusResolver` 自带的 `exclude` 选项，把这些
名字排除掉；组件完全依赖 `DispatcherPlugin` 的全局注册：

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default {
  plugins: [
    Components({
      resolvers: [ElementPlusResolver({ exclude: /Dispatcher$/ })],
    }),
  ],
};
```

> 类型提醒：本库未附带 `GlobalComponents` 类型增强。若你在 `vue-tsc` 下走方案 B，
> 模板里的 `<el-input-dispatcher>` 等全局组件需要**自行声明类型**，否则会报"组件未定义"。
> 若不想处理类型，用方案 A 更省心。

## 如何选择

|                | 方案 A                        | 方案 B                                |
| -------------- | ----------------------------- | ------------------------------------- |
| 需要额外依赖   | 否（库自带子路径）            | 否                                    |
| 自动导入解析   | ✅ 由库 resolver 认领         | ❌ 不解析，靠全局注册                 |
| `vue-tsc` 类型 | ✅ 自动写入 `components.d.ts` | 需自行声明全局组件类型                |
| 配置改动       | 引入并排在最前                | 给 `ElementPlusResolver` 加 `exclude` |
