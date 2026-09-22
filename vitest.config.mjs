import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import VueMacros from "unplugin-vue-macros/vite";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "packages");

export default defineConfig({
  root: "packages/element-plus",
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
  // Mirror `packages/element-plus/tsconfig.json` paths so the workspace-only
  // `element-plus-form-dispatcher/*` specifiers resolve at test time. The
  // `helper` entry must precede the wildcard so it wins over it.
  resolve: {
    alias: [
      {
        find: /^element-plus-form-dispatcher\/helper$/,
        replacement: path.resolve(pkgRoot, "helper/index.ts"),
      },
      {
        find: /^element-plus-form-dispatcher\/(.*)$/,
        replacement: path.resolve(pkgRoot, "element-plus") + "/$1",
      },
    ],
  },
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
    coverage: {
      provider: "v8",
      include: ["components/**/*.{ts,tsx,vue}"],
    },
  },
});
