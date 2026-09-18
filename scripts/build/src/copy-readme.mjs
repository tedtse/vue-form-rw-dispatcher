import path from "node:path";
import fs from "node:fs";
import {
    ensureDir,
    logDone,
    logStep,
    pkgPath,
    rootPath,
} from "./utils.mjs";
import { elementPlusConfig } from "./configs/element-plus.mjs";

/**
 * Copy `packages/element-plus/README.md` into the element-plus dist folder so
 * the published package ships its own README (npm renders it on the package
 * page). Mirrors the `pkg-json` task: dest path is derived from the single
 * source of truth `elementPlusConfig.outDir`.
 *
 * Must run after the rolldown build (which cleans the outDir), so it is
 * registered as a task that executes later in the pipeline.
 */
export async function copyReadme() {
    const srcFile = pkgPath("element-plus", "README.md");
    const absOut = rootPath(elementPlusConfig.outDir);
    const destFile = path.join(absOut, "README.md");

    if (!fs.existsSync(srcFile)) {
        throw new Error(`[readme] ${srcFile} not found`);
    }

    logStep(`[readme] copying README.md -> ${elementPlusConfig.outDir}/`);
    ensureDir(absOut);

    fs.copyFileSync(srcFile, destFile);
    logDone(`[readme] ${elementPlusConfig.outDir}/README.md ready`);
}
