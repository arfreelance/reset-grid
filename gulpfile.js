import { deleteAsync } from "del";
import { dest, series, src, task } from "gulp";
import * as dartSass from "sass";
import autoprefixer from "autoprefixer";
import cleancss from "gulp-clean-css";
import gulpSass from "gulp-sass";
import header from "gulp-header";
import postcss from "gulp-postcss";
import prettier from "gulp-prettier";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import stylelint from "gulp-stylelint-esm";

// sass
// -----------------------------------------------------------------------------

const sass = gulpSass(dartSass);

// options
// -----------------------------------------------------------------------------

const options = {
  cleancss: { level: 1, format: { breakWith: "lf" } },
  header:
    "/*! reset-grid | MIT License | github.com/arfreelance/reset-grid */\n\n",
  postcss: [autoprefixer({ cascade: false })],
  prettier: { editorconfig: true },
  rename: { suffix: ".min" },
  sass: { outputStyle: "expanded" },
  stylelint: {
    fix: true,
    failAfterError: true,
    reporters: [{ formatter: "string", console: true }],
  },
};

// lint
// -----------------------------------------------------------------------------

task("lint", () => {
  return src("scss/**/*.scss", { base: "." })
    .pipe(stylelint(options.stylelint))
    .pipe(prettier(options.prettier))
    .pipe(dest("."));
});

// clean
// -----------------------------------------------------------------------------

task("clean", () => {
  return deleteAsync("css");
});

// build
// -----------------------------------------------------------------------------

task("build", () => {
  return src("scss/reset-grid.scss")
    .pipe(sourcemaps.init())
    .pipe(sass(options.sass))
    .pipe(postcss(options.postcss))
    .pipe(header(options.header))
    .pipe(stylelint(options.stylelint))
    .pipe(prettier(options.prettier))
    .pipe(sourcemaps.write("."))
    .pipe(dest("css"));
});

// minify
// -----------------------------------------------------------------------------

task("minify", () => {
  return src("css/reset-grid.css")
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(cleancss(options.cleancss))
    .pipe(rename(options.rename))
    .pipe(sourcemaps.write("."))
    .pipe(dest("css"));
});

// default
// -----------------------------------------------------------------------------

task("default", series("lint", "clean", "build", "minify"));
