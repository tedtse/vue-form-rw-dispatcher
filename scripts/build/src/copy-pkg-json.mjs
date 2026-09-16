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
 * Distribution overrides for the built artifact. Lives next to this module so
 * the shipped `package.json` can be tuned (name, entry fields, exports, unpkg,
 * style, ...) without touching the workspace source package. Top-level keys
 * here win over the source `package.json`; keys absent here are inherited from
 * the source (shallow merge).
 */
const EXTEND_FILE = path.join(import.meta.dirname, "pkg-extend.json");

/**
 * Copy `packages/element-plus/package.json` into the element-plus dist folder,
 * shallow-merging `pkg-extend.json` over it (extend wins on top-level keys).
 *
 * Must run after the rolldown build (which cleans the outDir), so it is
 * registered as a task that executes later in the pipeline.
 */
export async function copyPkgJson() {
    const srcFile = pkgPath("element-plus", "package.json");
    const absOut = rootPath(elementPlusConfig.outDir);
    const destFile = path.join(absOut, "package.json");

    if (!fs.existsSync(srcFile)) {
        throw new Error(`[pkg-json] ${srcFile} not found`);
    }
    if (!fs.existsSync(EXTEND_FILE)) {
        throw new Error(`[pkg-json] ${EXTEND_FILE} not found`);
    }

    logStep(`[pkg-json] copying package.json -> ${elementPlusConfig.outDir}/`);
    ensureDir(absOut);

    const pkg = JSON.parse(fs.readFileSync(srcFile, "utf8"));
    const extend = JSON.parse(fs.readFileSync(EXTEND_FILE, "utf8"));
    const merged = { ...pkg, ...extend };

    fs.writeFileSync(destFile, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
    logDone(
        `[pkg-json] ${elementPlusConfig.outDir}/package.json ready (name: ${merged.name})`,
    );
}
