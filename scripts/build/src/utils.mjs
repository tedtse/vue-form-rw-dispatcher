import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import consola from "consola";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Absolute path to the monorepo root (where pnpm-workspace.yaml lives). */
export const ROOT = path.resolve(__dirname, "../../..");

/** Absolute path to a package by its folder name under `packages/`. */
export const pkgPath = (...segments) =>
  path.resolve(ROOT, "packages", ...segments);

/** Absolute path rooted at the monorepo root (used for shared `dist/`). */
export const rootPath = (...segments) => path.resolve(ROOT, ...segments);

/** Read a package.json for the given package folder name. */
export function readPkgJson(name) {
  const file = pkgPath(name, "package.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * Build a rolldown `external` predicate that keeps every declared dependency,
 * peer dependency, and Node builtin out of the bundle.
 */
export function createExternal(name) {
  const pkg = readPkgJson(name);
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
  ]);
  return (id) => {
    if (id.startsWith("node:")) return true;
    const bare = getBareImport(id);
    if (!bare) return false;
    return declared.has(bare);
  };
}

/** Extract the bare package name from a possibly-subpath import specifier. */
function getBareImport(id) {
  if (id.startsWith(".") || path.isAbsolute(id)) return null;
  const parts = id.split("/");
  return id.startsWith("@") && parts.length >= 2
    ? `${parts[0]}/${parts[1]}`
    : parts[0];
}

/** Blocking sleep (ms) without busy-waiting; used to ride out transient locks. */
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Remove a directory tree synchronously (safe if missing).
 *
 * On Windows a freshly written tree (hundreds of small files) is often held
 * briefly by antivirus / Search indexer / a lingering handle, which surfaces
 * as `EBUSY`/`EPERM`/`ENOTEMPTY` on `rmSync`. Those locks release within a
 * moment, so retry a few times with a short backoff before giving up.
 */
export function cleanDir(dir) {
  const maxAttempts = 5;
  for (let attempt = 1; ; attempt++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (err) {
      const retriable =
        err && ["EBUSY", "EPERM", "ENOTEMPTY"].includes(err.code);
      if (!retriable || attempt >= maxAttempts) throw err;
      sleepSync(200 * attempt);
    }
  }
}

/** Ensure directory exists. */
export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function banner(target) {
  const stamp = new Date().toISOString();
  return [
    `/*! ${target} — built at ${stamp} */`,
    `/*! vue-form-rw-dispatcher | ISC License */`,
  ].join("\n");
}

export function logStep(msg) {
  consola.info(chalk.cyan(msg));
}

export function logDone(msg) {
  consola.success(chalk.green(msg));
}

export function logError(err) {
  consola.error(chalk.red(err?.stack ?? err?.message ?? String(err)));
}
