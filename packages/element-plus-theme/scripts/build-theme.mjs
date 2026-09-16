// 用纯 Node 脚本替代 gulpfile：src/index.scss -> dart-sass -> autoprefixer
// -> cssnano -> dist/index.css。 gulp 在此仅是任务编排 + stream 胶水，去掉后
// 直接调 sass / postcss 的 JS API 即可，产物与原 gulp build 等价。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const srcDir = path.resolve(root, "src");
const entry = path.resolve(srcDir, "index.scss");
const outDir = path.resolve(root, "dist");
const outFile = path.join(outDir, "index.css");

// 1. SCSS -> CSS（dart-sass，expanded 与原 gulp-sass 默认输出一致）
const { css } = sass.compile(entry, {
    style: "expanded",
    loadPaths: [srcDir],
});

// 2. autoprefixer + cssnano（postcss），配置沿用原 gulpfile
const result = await postcss([
    autoprefixer({ cascade: false }),
    cssnano({
        preset: [
            "default",
            {
                // avoid color transform
                colormin: false,
                // avoid font transform
                minifyFontValues: false,
            },
        ],
    }),
]).process(css, { from: entry });

if (result.warnings().length) {
    for (const warn of result.warnings()) {
        console.warn(`[build-theme] postcss warning: ${warn.toString()}`);
    }
}

// 3. 落盘
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, result.css);

const kb = (n) => (n / 1000).toFixed(2);
console.log(
    `[build-theme] index.css written: ${kb(css.length)} KB -> ${kb(
        result.css.length,
    )} KB (minified)`,
);
