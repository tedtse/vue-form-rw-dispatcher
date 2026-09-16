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
 * Public package name for the built artifact shipped under `dist/`.
 * The workspace source package keeps its scoped name
 * (`@vue-form-rw-dispatcher/element-plus`), but the distributed folder is
 * consumed/published as `element-plus-form-dispatcher`.
 */
const DIST_NAME = "element-plus-form-dispatcher";

/**
 * Copy `packages/element-plus/package.json` into the element-plus dist folder,
 * rewriting the `name` field to `element-plus-form-dispatcher` while keeping
 * every other field identical to the source.
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

    logStep(`[pkg-json] copying package.json -> ${elementPlusConfig.outDir}/`);
    ensureDir(absOut);

    const pkg = JSON.parse(fs.readFileSync(srcFile, "utf8"));
    pkg.name = DIST_NAME;

    fs.writeFileSync(destFile, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
    logDone(
        `[pkg-json] ${elementPlusConfig.outDir}/package.json ready (name: ${DIST_NAME})`,
    );
}
