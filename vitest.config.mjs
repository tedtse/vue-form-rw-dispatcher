import { defineConfig } from "vitest/config";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import VueMacros from "unplugin-vue-macros/vite";

export default defineConfig({
  plugins: [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      betterDefine: false,
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
      },
    }),
  ],
  optimizeDeps: {
    disabled: true,
  },
  test: {
    clearMocks: true,
    environment: "jsdom",
    typecheck: {
      enabled: true,
    },
    testTransformMode: {
      web: ["*.{ts,tsx}"],
    },
  },
});
