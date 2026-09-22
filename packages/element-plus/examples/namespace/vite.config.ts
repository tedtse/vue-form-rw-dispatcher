import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import type { ComponentResolver } from "unplugin-vue-components";

/**
 * DispatcherPlugin 已将 *Dispatcher 组件全局注册，
 * 此 resolver 拦截这些组件名并指向正确的包，防止 ElementPlusResolver 误匹配。
 */
function FormDispatcherResolver(): ComponentResolver {
  return {
    type: "component",
    resolve: (name: string) => {
      if (name.endsWith("Dispatcher")) {
        return { name, from: "element-plus-form-dispatcher" };
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [FormDispatcherResolver(), ElementPlusResolver()],
    }),
  ],
});
