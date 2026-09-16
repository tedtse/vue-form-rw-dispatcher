import path from "node:path";
import { pkgPath } from "../utils.mjs";

/**
 * Rolldown build descriptor for `@vue-form-rw-dispatcher/element-plus`.
 *
 * Output goes to `<repo>/dist/element-plus-form-dispatcher/` (outDir is resolved
 * against the monorepo root, not the package folder). Every target gets its own
 * subdir so multiple packages can share one top-level `dist/` tree.
 *
 * The alias table mirrors `packages/element-plus/tsconfig.json`:
 *   "element-plus-form-dispatcher/helper" -> "../helper"
 *   "element-plus-form-dispatcher/*"      -> "./*"
 * The more specific `helper` entry must come first so it wins over the
 * wildcard. `helper` is resolved to its absolute path and inlined into the
 * bundle (the sibling package is still consumed by docs/dev via its own
 * workspace link; only the built artifact embeds it here).
 */
const helperPkgRoot = pkgPath("helper");

export const elementPlusConfig = {
  name: "element-plus",
  entry: "index.ts",
  outDir: "dist/element-plus-form-dispatcher",
  alias: [
    {
      // exact specifier: rewrite to helper package root (index.ts inside)
      match: "element-plus-form-dispatcher/helper",
      target: path.resolve(helperPkgRoot, "index.ts"),
    },
    {
      // wildcard: everything else stays inside the element-plus package
      match: "element-plus-form-dispatcher/*",
      target: ".",
    },
  ],
  // Keep every runtime peer/consumer import external:
  // `vue`, `element-plus`, `@element-plus/icons-vue`, and the theme package.
  // These already appear in `packages/element-plus/package.json` and are
  // auto-externalized by `createExternal`; the list below is for anything
  // extra (deep imports that don't match a bare package name, etc.).
  extraExternals: [/^element-plus\//, /^@element-plus\//],

  // UMD "full" build: a single self-contained file for browser <script> use.
  // Only `vue` is kept external (global `Vue`); element-plus / icons / helper /
  // theme are bundled in. Emits index.full.js(.map) and index.full.min.js(.map).
  umd: {
    name: "VueFormRWDispatcher",
    fileName: "index.full",
    externals: { vue: "Vue" },
  },
};

export default elementPlusConfig;
