# @vue-form-rw-dispatcher/build

基于 [rolldown](https://rolldown.rs) 的 monorepo 打包脚本，把 `packages/*` 下的
TypeScript + Vue SFC + Vue JSX 源码编译为多格式产物，并生成 `.d.ts` 类型声明。

## 使用

从仓库根目录执行：

```bash
pnpm install             # 首次安装构建依赖（rolldown / unplugin-vue / vue-tsc 等）
pnpm build               # 构建所有已注册的目标（element-plus + theme）
pnpm build:element-plus  # 只构建 @vue-form-rw-dispatcher/element-plus
pnpm build:theme         # 构建 theme 包 CSS 并组装 dist/element-plus-form-dispatcher/theme/
```

也可绕过 pnpm 直接运行：

```bash
node scripts/build/src/index.mjs element-plus
node scripts/build/src/index.mjs theme
```

## 产物结构

产物统一落在仓库根 `dist/<name>/`。以 `element-plus` 为例：

```
dist/element-plus-form-dispatcher/
├── esm/                    # ES module（保留源码目录结构，一文件一模块）
│   ├── index.mjs           #   .ts/.tsx/.vue  ->  .mjs + .mjs.map + .d.ts
│   ├── index.mjs.map
│   ├── index.d.ts
│   └── components/
│       └── input/src/
│           ├── input.mjs / input.mjs.map / input.d.ts          # 来自 input.tsx
│           ├── reader.mjs / reader.mjs.map                     # 来自 reader.vue
│           └── reader.vue.d.ts                                 # 来自 reader.vue
├── cjs/                    # CommonJS（结构同上，扩展名为 .js）
│   ├── index.js / index.js.map / index.d.ts
│   └── components/...
├── umd/                    # 单文件自包含打包，供浏览器 <script> 直用
│   ├── index.full.js       #   未压缩
│   ├── index.full.js.map
│   ├── index.full.min.js   #   压缩
│   └── index.full.min.js.map
└── theme/                  # theme 任务组装（见下方《theme 任务》）
    ├── src/                #   复制自 packages/element-plus-theme/src
    ├── index.css           #   复制自 packages/element-plus-theme/dist/*
    └── theme-vars.json
```

### 文件映射规则

| 源文件  | esm/                  | cjs/                | .d.ts        |
| ------- | --------------------- | ------------------- | ------------ |
| `a.ts`  | `a.mjs` + `a.mjs.map` | `a.js` + `a.js.map` | `a.d.ts`     |
| `a.tsx` | `a.mjs` + `a.mjs.map` | `a.js` + `a.js.map` | `a.d.ts`     |
| `a.vue` | `a.mjs` + `a.mjs.map` | `a.js` + `a.js.map` | `a.vue.d.ts` |

`esm/` 与 `cjs/` 使用 rolldown 的 `preserveModules`，**保留原始目录结构**；
`.d.ts` 由 `vue-tsc --emitDeclarationOnly` 生成后同时拷入 `esm/` 与 `cjs/`。

`umd/` 是整体单文件打包（非 preserveModules），`full` 表示依赖内联，
仅把 `vue` 作为 external（全局 `Vue`），对外暴露全局变量 `VueFormRWDispatcher`。

### theme 任务（dist/element-plus-form-dispatcher/theme/）

`theme` 目标不走 rolldown，而是一个资源组装任务（`src/copy-theme.mjs`）：
先调 `element-plus-theme` 包的构建（sass + cssnano）刷新其 `dist/`，
再把源码与产物拷到 `dist/element-plus-form-dispatcher/theme/`：

```
dist/element-plus-form-dispatcher/theme/
├── src/              # 复制自 packages/element-plus-theme/src（原始 scss 源）
├── index.css         # 复制自 packages/element-plus-theme/dist/*
└── theme-vars.json
```

> 输出目录由 `elementPlusConfig.outDir` 派生（`copy-theme.mjs` 中
> `THEME_OUT = path.posix.join(elementPlusConfig.outDir, "theme")`），
> 改 config 的 `outDir` 即可整体重定位。`build`(all) 中 element-plus 先于
> theme 执行，theme 只清理自己的子目录，不会冲掉 esm/cjs/umd。

## 目录结构

```
scripts/build/
├── package.json
├── README.md
└── src/
    ├── index.mjs                 # CLI 入口，解析 targets
    ├── build.mjs                 # rolldown 打包核心（esm / cjs / umd）
    ├── generate-types.mjs        # vue-tsc 生成 .d.ts 并拷入 esm/ cjs/
    ├── copy-theme.mjs            # theme 任务：构建 theme 包 CSS 并组装 .../theme/
    ├── utils.mjs                 # 路径 / external / 日志工具
    ├── plugins/
    │   ├── alias.mjs             # tsconfig paths 风格的 `element-plus-form-dispatcher/*` 别名
    │   ├── vue-jsx.mjs           # 用 @vue/babel-plugin-jsx 处理 .jsx / .tsx
    │   └── inline-vue-virtual.mjs# 合并 unplugin-vue 在 preserveModules 下产生的虚拟模块
    └── configs/
        └── element-plus.mjs      # element-plus 目标的具体配置
```

## 新增构建目标

1. 在 `src/configs/` 下新增一个描述符，形如：
   ```js
   export const myConfig = {
     name: "my-pkg", // packages/<name>
     entry: "index.ts", // 相对包根
     outDir: "dist/my-pkg", // 相对仓库根，最终输出到 <repo>/dist/my-pkg/
     alias: [
       /* { match, target } */
     ],
     extraExternals: [
       /* string | RegExp */
     ],
     umd: {
       // 可选；不填则跳过 umd
       name: "MyPkg", // 全局变量名
       fileName: "index.full", // 生成 index.full.js / index.full.min.js
       externals: { vue: "Vue" }, // 仅这些保持 external，其余内联
     },
   };
   ```
2. 在 `src/index.mjs` 的 `REGISTRY` 中注册。
3. 根 `package.json` 可选地加一条快捷脚本。

## 关键约束

- **外部依赖识别** 通过读取 `packages/<name>/package.json` 的
  `dependencies` / `peerDependencies` / `optionalDependencies` 自动完成；
  Node 内置模块（`node:*`）与正则命中的额外 `extraExternals` 一并排除。
  （`umd` 通道例外：只 externalize `umd.externals` 里列出的包，其余全部内联。）
- **`helper` 包内联**：`element-plus-form-dispatcher/helper` 通过 alias 解析到
  `packages/helper/index.ts`，会被打入产物。
- **SFC 处理** 由 `unplugin-vue/rollup` 承担；rolldown 与其 Rollup 插件 API 兼容。
  `preserveModules` 下 `unplugin-vue` 会拆出 `*.vue_vue_type_*` 虚拟模块，
  由 `plugins/inline-vue-virtual.mjs` 在 `generateBundle` 阶段合并回父模块。
- **Vue JSX 处理** 由 `plugins/vue-jsx.mjs` 中的 Babel 管道完成；对 `.tsx`
  额外启用 `@babel/plugin-transform-typescript`（`isTSX: true`）。
- **类型声明** 由 `generate-types.mjs` 调 `vue-tsc --emitDeclarationOnly`，
  临时 tsconfig 排除 `__test__`、开启 `jsx: "preserve"`；跨包推断导致 rootDir
  上抬到 `packages/` 时会剥离多余的 `<name>/` 前缀。非致命的 TS2742 告警不影响
  已 emit 的声明拷贝。
