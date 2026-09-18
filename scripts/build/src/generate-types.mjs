import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import { logStep, logDone, logError, pkgPath, rootPath, ensureDir } from "./utils.mjs";

/**
 * Generate `.d.ts` declaration files using `vue-tsc --emitDeclarationOnly`.
 * Outputs into both `esm/` and `cjs/` directories under the target's dist.
 *
 * @param {object} config - same package descriptor used in buildPackage
 */
export async function generateTypes(config) {
  const { name, outDir } = config;
  const pkgRoot = pkgPath(name);
  const absOut = rootPath(outDir);
  const typesOut = path.join(absOut, "_types");

  logStep(`[${name}] generating .d.ts via vue-tsc...`);

  // 1. Write a temporary tsconfig for declaration emit.
  const tsconfigContent = {
    extends: "./tsconfig.json",
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      noEmit: false,
      outDir: path.relative(pkgRoot, typesOut).replace(/\\/g, "/"),
      stripInternal: false,
      skipLibCheck: true,
      jsx: "preserve",
    },
    include: [
      "index.ts",
      "config.ts",
      "type.d.ts",
      "components/**/*.ts",
      "components/**/*.tsx",
      "components/**/*.vue",
      "composables/**/*.ts",
      "constants/**/*.ts",
    ],
    exclude: [
      "**/__test__/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "coverage",
      "dist",
      "node_modules",
    ],
  };

  const tmpTsconfig = path.join(pkgRoot, "tsconfig.build-types.json");
  fs.writeFileSync(tmpTsconfig, JSON.stringify(tsconfigContent, null, 2), "utf-8");

  try {
    // 2. Run vue-tsc (resolved from scripts/build/node_modules)
    const vueTsc = resolveVueTsc();
    ensureDir(typesOut);

    execSync(
      `"${process.execPath}" "${vueTsc}" -p "${tmpTsconfig}"`,
      {
        cwd: pkgRoot,
        stdio: "pipe",
        env: { ...process.env, NODE_OPTIONS: "" },
        timeout: 120_000,
      },
    );

    // 3. Copy declarations into both esm/ and cjs/
    copyEmittedDeclarations(name, typesOut, absOut);

    logDone(`[${name}] .d.ts generated and copied to esm/ + cjs/`);
  } catch (err) {
    // vue-tsc may exit non-zero for minor type errors that don't affect emit
    const stdout = err.stdout?.toString() ?? "";
    if (fs.existsSync(typesOut) && fs.readdirSync(typesOut).length > 0) {
      // Declarations were still emitted despite errors
      copyEmittedDeclarations(name, typesOut, absOut);
      logDone(`[${name}] .d.ts emitted (with warnings)`);
      if (stdout) console.warn(stdout.slice(0, 2000));
    } else {
      logError(`[${name}] vue-tsc failed:\n${stdout}`);
      throw err;
    }
  } finally {
    // Always drop the temp tsconfig and the intermediate _types/ dir.
    fs.rmSync(tmpTsconfig, { force: true });
    fs.rmSync(typesOut, { recursive: true, force: true });
  }
}

/**
 * Copy emitted declarations from the vue-tsc `typesOut` tree into the target's
 * `esm/` and `cjs/` directories.
 *
 * Because the element-plus package self-references the sibling `helper` package
 * via the `element-plus-form-dispatcher/helper` alias, vue-tsc infers a common
 * rootDir of `packages/`, so it emits TWO sibling trees under `typesOut`:
 *   <typesOut>/element-plus/...   (this package -> esm/, cjs/)
 *   <typesOut>/helper/...         (sibling    -> esm/helper/, cjs/helper/)
 * The helper tree MUST be copied too, otherwise the published
 * `exports["./helper"].types` (`esm/helper/index.d.ts`) is missing and consumers
 * get TS7016 ("implicitly has an 'any' type").
 */
function copyEmittedDeclarations(name, typesOut, absOut) {
  const esmDir = path.join(absOut, "esm");
  const cjsDir = path.join(absOut, "cjs");
  const pkgDecls = path.join(typesOut, name);

  // rootDir inferred to `packages/` (nested per-package folders).
  if (fs.existsSync(pkgDecls) && fs.statSync(pkgDecls).isDirectory()) {
    copyDeclarations(pkgDecls, esmDir);
    copyDeclarations(pkgDecls, cjsDir);
    // Any OTHER top-level folder is a cross-package dep (e.g. `helper`); mirror
    // it under the same-named subdir so self-referenced specifiers resolve.
    for (const entry of fs.readdirSync(typesOut, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === name) continue;
      const src = path.join(typesOut, entry.name);
      copyDeclarations(src, path.join(esmDir, entry.name));
      copyDeclarations(src, path.join(cjsDir, entry.name));
    }
  } else {
    // rootDir stayed at the package root: a flat tree.
    copyDeclarations(typesOut, esmDir);
    copyDeclarations(typesOut, cjsDir);
  }
}

function resolveVueTsc() {
  // vue-tsc bin lives in scripts/build/node_modules/.bin or dist
  const candidates = [
    path.resolve(import.meta.dirname, "../node_modules/vue-tsc/bin/vue-tsc.js"),
    path.resolve(import.meta.dirname, "../../../node_modules/.pnpm/node_modules/vue-tsc/bin/vue-tsc.js"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  // Fallback: not found
  throw new Error(`vue-tsc not found. Run \`pnpm install\` in scripts/build.`);
}

/**
 * Recursively copy all `.d.ts` files from src to dest,
 * preserving directory structure.
 */
function copyDeclarations(src, dest) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDeclarations(srcPath, destPath);
    } else if (entry.name.endsWith(".d.ts") || entry.name.endsWith(".d.mts") || entry.name.endsWith(".d.cts")) {
      ensureDir(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
