import path from "node:path";
import { rolldown } from "rolldown";
import Vue from "unplugin-vue/rollup";
import { aliasPlugin } from "./plugins/alias.mjs";
import { vueJsxPlugin } from "./plugins/vue-jsx.mjs";
import { inlineVueVirtualPlugin } from "./plugins/inline-vue-virtual.mjs";
import {
  banner,
  cleanDir,
  createExternal,
  ensureDir,
  logDone,
  logStep,
  pkgPath,
  rootPath,
} from "./utils.mjs";

/**
 * Run a full build for a package descriptor.
 * Outputs preserve the original module structure (one file per source module).
 *
 * Produces:
 *   <outDir>/esm/   ESM (.mjs + .mjs.map)
 *   <outDir>/cjs/   CJS (.js + .js.map)
 *
 * @param {object} config
 * @param {string} config.name                - package folder name under `packages/`
 * @param {string} config.entry               - entry file, relative to package root
 * @param {string} config.outDir              - output dir, relative to the MONOREPO ROOT
 *                                              (e.g. `dist/element-plus`)
 * @param {Array<{match:string,target:string}>} [config.alias]
 * @param {string[]} [config.extraExternals]  - additional externals (globs/regex allowed)
 */
export async function buildPackage(config) {
  const {
    name,
    entry,
    outDir,
    alias = [],
    extraExternals = [],
  } = config;

  const pkgRoot = pkgPath(name);
  const absEntry = path.resolve(pkgRoot, entry);
  const absOut = rootPath(outDir);
  const external = createExternal(name);
  const isExternal = (id) =>
    external(id) ||
    extraExternals.some((p) => (typeof p === "string" ? id === p : p.test(id)));

  // Shared rolldown input options. `externalFn` lets the UMD pass use a
  // different (narrower) external set than the module-tree passes.
  const makeInputOptions = (externalFn) => ({
    input: absEntry,
    cwd: pkgRoot,
    platform: "browser",
    plugins: [
      alias.length
        ? aliasPlugin(
          alias.map((a) => ({
            match: a.match,
            target: path.isAbsolute(a.target)
              ? a.target
              : path.resolve(pkgRoot, a.target),
          })),
        )
        : null,
      vueJsxPlugin(),
      Vue({ isProduction: true, template: { compilerOptions: {} } }),
      inlineVueVirtualPlugin(),
    ].filter(Boolean),
    external: externalFn,
  });

  // Clean previous output.
  logStep(`[${name}] cleaning ${outDir}`);
  cleanDir(absOut);
  ensureDir(path.join(absOut, "esm"));
  ensureDir(path.join(absOut, "cjs"));

  // Two passes: ESM then CJS, each preserving the module tree.
  const formats = [
    {
      label: "esm",
      format: "es",
      dir: path.join(absOut, "esm"),
      ext: "mjs",
    },
    {
      label: "cjs",
      format: "cjs",
      dir: path.join(absOut, "cjs"),
      ext: "js",
    },
  ];

  for (const f of formats) {
    logStep(`[${name}] bundling ${f.label} -> ${outDir}/${f.label}/`);
    const bundle = await rolldown(makeInputOptions(isExternal));
    await bundle.write({
      dir: f.dir,
      format: f.format,
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: pkgRoot,
      entryFileNames: `[name].${f.ext}`,
      chunkFileNames: `[name].${f.ext}`,
      banner: banner(`${name} (${f.label})`),
      esModule: f.format === "cjs" ? false : undefined,
      exports: "named",
      minify: false,
    });
    if (typeof bundle.close === "function") await bundle.close();
    logDone(`[${name}] ${f.label} done`);
  }

  // Optional UMD "full" build: single self-contained bundle (no preserveModules).
  if (config.umd) {
    await buildUmd(name, config, outDir, absOut, makeInputOptions);
  }

  return { dir: absOut, formats };
}

/**
 * Build a single-file UMD bundle in two variants:
 *   <fileName>.js(.map)      unminified
 *   <fileName>.min.js(.map)  minified
 *
 * @param {string} name
 * @param {object} config
 * @param {string} outDir            relative out dir (for logs)
 * @param {string} absOut            absolute out dir
 * @param {(externalFn:(id:string)=>boolean)=>object} makeInputOptions
 */
async function buildUmd(name, config, outDir, absOut, makeInputOptions) {
  const umd = config.umd;
  const globals = umd.externals || {};
  // Only the listed packages stay external; everything else is bundled in.
  const keys = Object.keys(globals);
  const isUmdExternal = (id) =>
    keys.some((k) => id === k || id.startsWith(`${k}/`));

  const umdDir = path.join(absOut, "umd");
  ensureDir(umdDir);
  const base = umd.fileName || "index.full";

  logStep(`[${name}] bundling umd -> ${outDir}/umd/`);
  const bundle = await rolldown(makeInputOptions(isUmdExternal));

  const common = {
    format: "umd",
    name: umd.name || "VueFormRWDispatcher",
    globals,
    sourcemap: true,
    exports: "named",
    banner: banner(`${name} (umd)`),
  };

  // Unminified full build.
  await bundle.write({
    ...common,
    file: path.join(umdDir, `${base}.js`),
    minify: false,
  });
  // Minified full build.
  await bundle.write({
    ...common,
    file: path.join(umdDir, `${base}.min.js`),
    minify: true,
  });

  if (typeof bundle.close === "function") await bundle.close();
  logDone(`[${name}] umd done`);
}
