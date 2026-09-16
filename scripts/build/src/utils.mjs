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

/** Remove a directory tree synchronously (safe if missing). */
export function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
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
