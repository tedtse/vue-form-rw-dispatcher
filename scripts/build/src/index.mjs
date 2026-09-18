#!/usr/bin/env node
import process from "node:process";
import chalk from "chalk";
import consola from "consola";
import { buildPackage } from "./build.mjs";
import { generateTypes } from "./generate-types.mjs";
import { buildTheme } from "./copy-theme.mjs";
import { copyPkgJson } from "./copy-pkg-json.mjs";
import { copyReadme } from "./copy-readme.mjs";
import { elementPlusConfig } from "./configs/element-plus.mjs";
import { logError, logDone } from "./utils.mjs";

// rolldown-powered package targets (bundle + type emit).
const REGISTRY = {
  "element-plus": elementPlusConfig,
};

// Copy / asset-only tasks that don't go through rolldown.
const TASKS = {
  theme: buildTheme,
  "pkg-json": copyPkgJson,
  readme: copyReadme,
};

const ALL = [...Object.keys(REGISTRY), ...Object.keys(TASKS)];

async function main() {
  const args = process.argv.slice(2).filter(Boolean);
  const targets = args.length === 0 || args[0] === "all" ? ALL : args;

  const unknown = targets.filter((t) => !REGISTRY[t] && !TASKS[t]);
  if (unknown.length) {
    consola.error(
      chalk.red(`unknown target(s): ${unknown.join(", ")}`) +
      `\navailable: ${ALL.join(", ")}`,
    );
    process.exit(1);
  }

  consola.box(
    `${chalk.bold("vue-form-rw-dispatcher build")}\n` +
    `targets: ${targets.map((t) => chalk.cyan(t)).join(", ")}\n` +
    `bundler: ${chalk.magenta("rolldown")}`,
  );

  const started = Date.now();
  for (const t of targets) {
    try {
      if (REGISTRY[t]) {
        await buildPackage(REGISTRY[t]);
        await generateTypes(REGISTRY[t]);
      } else {
        await TASKS[t]();
      }
    } catch (err) {
      logError(err);
      process.exit(1);
    }
  }
  const cost = ((Date.now() - started) / 1000).toFixed(2);
  logDone(`all targets finished in ${cost}s`);
}

main().catch((err) => {
  logError(err);
  process.exit(1);
});
