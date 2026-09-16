import { parse, compileScript, registerTS } from "@vue/compiler-sfc";
import { readFileSync, existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// Register TypeScript with compiler-sfc so it can resolve external type imports.
// This is what @vitejs/plugin-vue does internally.
const require = createRequire(import.meta.url);
registerTS(() => require("typescript"));

/**
 * Rolldown plugin that compiles `.vue` SFCs into a SINGLE module
 * (no virtual sub-modules like `?vue&type=script`).
 *
 * Uses `compileScript({ inlineTemplate: true })` to produce a clean
 * 1:1 mapping: `reader.vue` → `reader.mjs`.
 */
export function vueInlinePlugin(options = {}) {
  const { isProduction = true, root = process.cwd() } = options;

  // Custom FS for compileScript's type resolver.
  const fsResolver = {
    fileExists: (file) => {
      try { return existsSync(file); } catch { return false; }
    },
    readFile: (file) => {
      try { return readFileSync(file, "utf-8"); } catch { return undefined; }
    },
    realpath: (file) => {
      try { return realpathSync(file); } catch { return file; }
    },
  };

  return {
    name: "vfr:vue-inline",

    async transform(_code, id) {
      const clean = id.split("?")[0];
      if (!clean.endsWith(".vue")) return null;
      if (id.includes("vue&type=")) return null;

      const source = readFileSync(clean, "utf-8");
      const idHash = hashCode(clean);
      const { descriptor, errors } = parse(source, { filename: clean });

      if (errors.length) {
        throw new Error(
          `[vue-inline] SFC parse errors in ${path.basename(clean)}:\n` +
          errors.map((e) => `  - ${e.message}`).join("\n"),
        );
      }

      if (!descriptor.script && !descriptor.scriptSetup) {
        throw new Error(`[vue-inline] No <script> block in ${clean}`);
      }

      const compiled = compileScript(descriptor, {
        id: idHash,
        isProd: isProduction,
        inlineTemplate: !!descriptor.template,
        fs: fsResolver,
        templateOptions: {
          compilerOptions: {
            mode: "module",
            prefixIdentifiers: true,
            hoistStatic: false,
          },
        },
        genDefaultAs: "__sfc__",
      });

      const output = compiled.content + "\nexport default __sfc__;\n";
      return { code: output, map: null };
    },
  };
}

/** Generate a short hex hash from a file path. */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}
