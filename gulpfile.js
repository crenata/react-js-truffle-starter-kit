const gulp = require("gulp");
const cssMinifier = require("gulp-csso");
const jsMinifier = require("gulp-uglify");

gulp.task("css-minifier", () => {
	return gulp.src("./build/css/**/*.css").pipe(cssMinifier()).pipe(gulp.dest("./build/css"));
});

gulp.task("js-minifier", () => {
	return gulp.src("./build/js/**/*.js").pipe(jsMinifier()).pipe(gulp.dest("./build/js"));
});