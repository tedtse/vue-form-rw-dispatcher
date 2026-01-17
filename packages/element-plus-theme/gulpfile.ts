import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { src, dest, parallel, series } from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import autoprefixer from "gulp-autoprefixer";
import { Transform } from "stream";
import chalk from "chalk";
import postcss from "postcss";
import cssnano from "cssnano";
import consola from "consola";
import { rimrafSync } from "rimraf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destBundele = path.resolve(__dirname, "../element-plus/theme");
/**
 * using `postcss` and `cssnano` to compress CSS
 * @returns
 */
const compressWithCssnano = () => {
  const processor = postcss([
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
  ]);
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const file = chunk;
      if (file.isNull()) {
        callback(null, file);
        return;
      }
      if (file.isStream()) {
        callback(new Error("Streaming not supported"));
        return;
      }
      const cssString = file.contents!.toString();
      processor.process(cssString, { from: file.path }).then((result) => {
        const name = path.basename(file.path);
        file.contents = Buffer.from(result.css);
        consola.success(
          `${chalk.cyan(name)}: ${chalk.yellow(
            cssString.length / 1000
          )} KB -> ${chalk.green(result.css.length / 1000)} KB`
        );
        callback(null, file);
      });
    },
  });
};

const copySource = () => {
  return src(path.resolve(__dirname, "src/**")).pipe(dest(destBundele));
};

const copyBundle = () => {
  rimrafSync(destBundele);
  fs.mkdirSync(destBundele);
  return src(path.resolve(__dirname, "dist/**")).pipe(dest(destBundele));
};

const buildBundle = () => {
  const sass = gulpSass(dartSass);
  return src(path.resolve(__dirname, "./src/index.scss"))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(compressWithCssnano())
    .pipe(dest(path.resolve(__dirname, "dist")));
};

export const build = parallel(series(buildBundle, copyBundle), copySource);

export default build;
