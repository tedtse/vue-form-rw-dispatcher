// 编译 scripts/_vars-entry.scss，通过 dart-sass 自定义函数 js-sink
// 直接接收 light/dark 变量 JSON，生成 dist/theme-vars.json：
// { "light": { "--rw-dispatcher-xxx": "value", ... }, "dark": { ... } }
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../dist");
const entry = path.resolve(here, "_vars-entry.scss");

let collected = null;

sass.compile(entry, {
  functions: {
    "js-sink($light, $dark)": (args) => {
      collected = {
        light: JSON.parse(args[0].assertString("light").text),
        dark: JSON.parse(args[1].assertString("dark").text),
      };
      return sass.sassNull;
    },
  },
});

if (!collected) {
  throw new Error("js-sink was not invoked during compilation");
}

// 规范化 rgb()/rgba() 通道：dart-sass color.mix 输出小数（如 rgb(197.7, 225.9, 255)）
// 按 CSS 规范逗号语法仅允许整数，这里 round 后落盘
const channelRe = /\d+\.\d+/g;
const normalizeColor = (val) =>
  typeof val === "string" && /^rgba?\(/.test(val)
    ? val.replace(channelRe, (m) => String(Math.round(parseFloat(m))))
    : val;
for (const mode of Object.keys(collected)) {
  for (const key of Object.keys(collected[mode])) {
    collected[mode][key] = normalizeColor(collected[mode][key]);
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "theme-vars.json"),
  JSON.stringify(collected, null, 2) + "\n",
);

console.log(
  `[build-vars-json] theme-vars.json written: ${
    Object.keys(collected.light).length
  } light keys, ${Object.keys(collected.dark).length} dark keys`,
);
