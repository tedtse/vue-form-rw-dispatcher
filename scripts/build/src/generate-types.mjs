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
    // vue-tsc may infer rootDir as `packages/` (due to helper cross-ref),
    // putting output under `<typesOut>/element-plus/...`. Detect and strip.
    const nested = path.join(typesOut, name);
    const typesSrc = fs.existsSync(nested) && fs.statSync(nested).isDirectory()
      ? nested
      : typesOut;
    copyDeclarations(typesSrc, path.join(absOut, "esm"));
    copyDeclarations(typesSrc, path.join(absOut, "cjs"));

    logDone(`[${name}] .d.ts generated and copied to esm/ + cjs/`);
  } catch (err) {
    // vue-tsc may exit non-zero for minor type errors that don't affect emit
    const stdout = err.stdout?.toString() ?? "";
    if (fs.existsSync(typesOut) && fs.readdirSync(typesOut).length > 0) {
      // Declarations were still emitted despite errors
      const nested = path.join(typesOut, name);
      const typesSrc = fs.existsSync(nested) && fs.statSync(nested).isDirectory()
        ? nested
        : typesOut;
      copyDeclarations(typesSrc, path.join(absOut, "esm"));
      copyDeclarations(typesSrc, path.join(absOut, "cjs"));
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
