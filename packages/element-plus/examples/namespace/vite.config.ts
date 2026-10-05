import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// 方案 A：使用库自带的 resolver（`element-plus-form-dispatcher/resolver` 子路径，
// 依赖为零，不会把运行时组件树拖进本配置文件）。
import { FormDispatcherResolver } from "element-plus-form-dispatcher/resolver";

/**
 * `ElementPlusResolver` 贪婪匹配任何 `^El[A-Z]` 名字，会把 `ElInputDispatcher`
 * 误当成 element-plus 组件、生成错误的 `element-plus/es/...` 导入。两种互斥方案：
 *
 * 方案 A（当前启用）：用库自带的 `FormDispatcherResolver` 抢先认领 `*Dispatcher`
 *   组件并指向正确的包，且必须排在 `ElementPlusResolver` 之前。unplugin 解析后会
 *   自动补进 components.d.ts，对 `vue-tsc` 类型检查友好。
 *
 * 方案 B（备选，无需任何 resolver）：让 ElementPlusResolver 主动放过这些名字，
 *   组件完全依赖 main.ts 中 DispatcherPlugin 的全局注册：
 *     Components({ resolvers: [ElementPlusResolver({ exclude: /Dispatcher$/ })] })
 *   注意：库未附带 GlobalComponents 类型增强，走 `vue-tsc` 时需自行声明这些全局组件。
 */
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 方案 A：FormDispatcherResolver 必须排在 ElementPlusResolver 之前。
      resolvers: [FormDispatcherResolver(), ElementPlusResolver()],
    }),
  ],
});
