import path from "node:path";

/**
 * Rolldown plugin that inlines `unplugin-vue`'s virtual SFC sub-modules
 * back into their parent chunks, producing clean 1:1 output:
 *   reader.vue → reader.mjs / reader.js (no virtual companion files)
 *
 * Handles both ESM and CJS passthrough patterns:
 *   ESM: import X_default from "./X.vue_vue_type_...mjs"; var x = X_default; export { x as default };
 *   CJS: const req = require("./X.vue_vue_type_...js"); var x = req.default; exports.default = x;
 */
export function inlineVueVirtualPlugin() {
  return {
    name: "vfr:inline-vue-virtual",

    generateBundle(_options, bundle) {
      const isVirtual = (name) => /\.vue_vue_type_/.test(name);

      // 1. Detect virtual chunks
      const virtuals = new Set();
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && isVirtual(name)) {
          virtuals.add(name);
        }
      }
      if (virtuals.size === 0) return;

      // 2. For each non-virtual chunk, try to resolve & inline its virtual imports
      const merged = new Set();

      for (const [parentName, parentChunk] of Object.entries(bundle)) {
        if (parentChunk.type !== "chunk") continue;
        if (isVirtual(parentName)) continue;

        const parentDir = path.posix.dirname(parentName);
        const virtualRefs = findVirtualImports(parentChunk.code, parentDir, bundle, isVirtual);

        for (const { resolved, virtualChunk } of virtualRefs) {
          if (isPassthrough(parentChunk.code)) {
            // Replace parent with virtual's content (strip banner + map ref)
            let code = virtualChunk.code
              .replace(/^\/\*!.*?\*\/\n/gm, "")
              .replace(/\/\/# sourceMappingURL=.*\n?/g, "");
            parentChunk.code = code;
            merged.add(resolved);
          }
        }
      }

      // 3. Delete merged virtuals
      for (const name of merged) {
        delete bundle[name];
        if (bundle[name + ".map"]) delete bundle[name + ".map"];
      }
    },
  };
}

/**
 * Find import/require references to virtual chunks from the parent code.
 */
function findVirtualImports(code, parentDir, bundle, isVirtual) {
  const refs = [];

  // ESM: import X from "./path.vue_vue_type_....mjs"
  const esmRegex = /import\s+\w+\s+from\s+["']([^"']*\.vue_vue_type_[^"']*\.(?:mjs|js))["']/g;
  // CJS: const X = require("./path.vue_vue_type_....js")
  const cjsRegex = /(?:const|let|var)\s+\w+\s*=\s*require\(["']([^"']*\.vue_vue_type_[^"']*\.(?:mjs|js))["']\)/g;

  for (const regex of [esmRegex, cjsRegex]) {
    let match;
    while ((match = regex.exec(code)) !== null) {
      const relPath = match[1];
      const resolved = path.posix.normalize(path.posix.join(parentDir, relPath));
      const virtualChunk = bundle[resolved];
      if (virtualChunk && virtualChunk.type === "chunk" && isVirtual(resolved)) {
        refs.push({ resolved, virtualChunk });
      }
    }
  }
  return refs;
}

/**
 * Detect if the parent code is a simple passthrough to a virtual module.
 * Supports both ESM and CJS patterns.
 */
function isPassthrough(code) {
  const body = code
    .replace(/\/\*!.*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .trim();

  const lines = body.split("\n").filter((l) => l.trim());
  const relevant = lines.filter(
    (l) => !l.startsWith("//#region") && !l.startsWith("//#end") && l.trim(),
  );

  return relevant.every(
    (l) =>
      // ESM import of virtual
      /^import\s+\w+\s+from\s+["'].*\.vue_vue_type_/.test(l) ||
      // CJS require of virtual
      /^(?:const|let|var)\s+\w+\s*=\s*require\(.*\.vue_vue_type_/.test(l) ||
      // var assignment: `var x = y;` or `var x = y.default;`
      /^(?:var|const|let)\s+\w+\s*=\s*[\w.]+;?\s*$/.test(l) ||
      // ESM export { x as default }
      /^export\s*\{/.test(l) ||
      // CJS exports.default = x
      /^exports\.\w+\s*=\s*\w+;?\s*$/.test(l) ||
      // Object.defineProperty for CJS exports
      /^Object\.defineProperty\(exports/.test(l)
  );
}
