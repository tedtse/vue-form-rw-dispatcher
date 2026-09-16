import path from "node:path";
import fs from "node:fs";

/**
 * Resolve tsconfig-style path aliases (`element-plus-form-dispatcher/*`).
 *
 * Rolldown's built-in `resolve.alias` only supports exact-string replacement
 * or a narrow prefix form; our mapping needs to (a) prefer the more specific
 * `.../helper` key before the wildcard `...*`, and (b) probe for a resolvable
 * file (`index.ts`, `index.tsx`, `<name>.ts`, ...) once a directory is hit.
 *
 * @param {Array<{ match: string; target: string }>} rules
 *   `match` is a specifier prefix ending with `*` for wildcard rules, or an
 *   exact specifier. Rules are evaluated in declaration order — put more
 *   specific entries first.
 * @param {string[]} extensions - file extensions to probe for directory imports.
 */
export function aliasPlugin(rules, extensions = [".ts", ".tsx", ".vue", ".js", ".mjs"]) {
  const compiled = rules.map((r) => {
    if (r.match.endsWith("/*")) {
      return {
        prefix: r.match.slice(0, -1), // keep trailing slash
        target: r.target.replace(/\/$/, ""),
        wildcard: true,
      };
    }
    if (r.match.endsWith("*")) {
      return {
        prefix: r.match.slice(0, -1),
        target: r.target.replace(/\/$/, ""),
        wildcard: true,
      };
    }
    return { exact: r.match, target: r.target, wildcard: false };
  });

  return {
    name: "vfr:alias",
    // Ordering is handled by placing this plugin first in the `plugins` array
    // (rolldown does not consume Vite's `enforce` field).
    resolveId(source) {
      if (source.startsWith(".") || path.isAbsolute(source)) return null;
      for (const rule of compiled) {
        if (!rule.wildcard) {
          if (source === rule.exact) return tryFsPath(rule.target, extensions);
          if (source.startsWith(rule.exact + "/")) {
            const sub = source.slice(rule.exact.length);
            const hit = tryFsPath(rule.target + sub, extensions);
            if (hit) return hit;
          }
          continue;
        }
        if (!source.startsWith(rule.prefix)) continue;
        const sub = source.slice(rule.prefix.length);
        const base = sub ? `${rule.target}/${sub}` : rule.target;
        const hit = tryFsPath(base, extensions);
        if (hit) return hit;
      }
      return null;
    },
  };
}

function tryFsPath(candidate, extensions) {
  if (!candidate) return null;
  const normalized = path.normalize(candidate);
  if (fs.existsSync(normalized) && fs.statSync(normalized).isFile()) {
    return normalized;
  }
  if (fs.existsSync(normalized) && fs.statSync(normalized).isDirectory()) {
    for (const ext of extensions) {
      const file = path.join(normalized, `index${ext}`);
      if (fs.existsSync(file)) return file;
    }
    return null;
  }
  for (const ext of extensions) {
    const withExt = normalized + ext;
    if (fs.existsSync(withExt)) return withExt;
  }
  return null;
}
