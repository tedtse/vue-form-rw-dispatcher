import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import {
    cleanDir,
    ensureDir,
    logDone,
    logStep,
    pkgPath,
    rootPath,
} from "./utils.mjs";
import { elementPlusConfig } from "./configs/element-plus.mjs";

/**
 * Where the assembled theme lands, relative to the monorepo root. Derived from
 * the element-plus outDir so the theme ships inside the same dist package
 * (i.e. `dist/element-plus-form-dispatcher/theme`).
 */
const THEME_OUT = path.posix.join(elementPlusConfig.outDir, "theme");

/**
 * Theme assembly task (no rolldown involved):
 *   1. Run the `element-plus-theme` package build (sass + cssnano) so that
 *      `packages/element-plus-theme/dist/*` is fresh.
 *   2. Create the `theme` output directory from scratch.
 *   3. Copy `packages/element-plus-theme/src`     -> <out>/src/
 *   4. Copy `packages/element-plus-theme/dist/*`  -> <out>/
 *
 * @param {object} [opts]
 * @param {boolean} [opts.skipBuild] - copy existing dist without rebuilding
 */
export async function buildTheme(opts = {}) {
    const themePkg = pkgPath("element-plus-theme");
    const srcDir = path.join(themePkg, "src");
    const distDir = path.join(themePkg, "dist");
    const absOut = rootPath(THEME_OUT);

    // 1. Build the theme package first (unless explicitly skipped).
    if (!opts.skipBuild) {
        logStep("[theme] building element-plus-theme (sass + cssnano)...");
        execSync("pnpm run build", { cwd: themePkg, stdio: "inherit" });
    }

    if (!fs.existsSync(distDir)) {
        throw new Error(
            `[theme] ${distDir} not found — the theme build may have failed`,
        );
    }

    // 2. Fresh output directory.
    logStep(`[theme] assembling ${THEME_OUT}/`);
    cleanDir(absOut);
    ensureDir(absOut);

    // 3. src/ -> <out>/src/  (keep raw scss sources for downstream @use)
    fs.cpSync(srcDir, path.join(absOut, "src"), { recursive: true });

    // 4. dist/* -> <out>/   (compiled index.css + theme-vars.json at the root)
    const distEntries = fs.readdirSync(distDir);
    for (const entry of distEntries) {
        fs.cpSync(
            path.join(distDir, entry),
            path.join(absOut, entry),
            { recursive: true },
        );
    }

    logDone(
        `[theme] ${THEME_OUT}/ ready — src/ + ${distEntries.join(", ")}`,
    );
}

export { THEME_OUT };
