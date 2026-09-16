import { transformAsync } from "@babel/core";
import vueJsx from "@vue/babel-plugin-jsx";
import tsSyntax from "@babel/plugin-transform-typescript";

/**
 * Rolldown plugin that compiles Vue JSX (`.jsx` / `.tsx`) via `@vue/babel-plugin-jsx`.
 *
 * Rolldown's native transform handles TS syntax but does not know about Vue's
 * JSX pragma (`h` from `vue`). We intercept `.jsx`/`.tsx` sources *before*
 * rolldown's own transform runs (see plugin array ordering in `build.mjs`):
 *   - `.tsx` → parse with TS syntax plugin, emit plain JS + Vue JSX.
 *   - `.jsx` → parse with JSX syntax only, emit Vue JSX.
 * `.ts` files without JSX are left to rolldown's native pipeline.
 */
export function vueJsxPlugin(options = {}) {
  const { include = /\.[jt]sx$/, exclude = /node_modules/ } = options;
  return {
    name: "vfr:vue-jsx",
    // Use a lower `transform` order via plugin array placement rather than the
    // Vite-only `enforce` field, which rolldown does not currently consume.
    async transform(code, id) {
      const clean = id.split("?")[0];
      if (!include.test(clean)) return null;
      if (exclude.test(clean)) return null;

      const ext = clean.slice(clean.lastIndexOf("."));
      const isTsx = ext === ".tsx";

      const plugins = [vueJsx];
      if (isTsx) {
        plugins.push([tsSyntax, { isTSX: true, allExtensions: true }]);
      }

      const result = await transformAsync(code, {
        filename: clean,
        babelrc: false,
        configFile: false,
        sourceType: "module",
        sourceMaps: true,
        // Only disable the default parser preset for pure `.jsx`/`.tsx` — we
        // bring the syntax plugins explicitly.
        presets: [],
        parserOpts: {
          plugins: isTsx
            ? ["typescript", "jsx", "decorators-legacy"]
            : ["jsx", "decorators-legacy"],
        },
        plugins,
      });

      if (!result?.code) return null;
      return { code: result.code, map: result.map ?? null };
    },
  };
}
