import gulp from "gulp";
import concat from "gulp-concat";
import rename from "gulp-rename";

import uglify from "gulp-uglify";
import jsvalidate from "gulp-jsvalidate";
import notify from "gulp-notify";
import babel from "gulp-babel";
import minimist from "minimist";
import webserver from "gulp-webserver";

let knownOptions = {
	string : 'dev',
	default: {env: process.env.NODE_ENV || 'dev'}
};

let options = minimist(process.argv.slice(2), knownOptions);



gulp.task('default', ['build'], function () {

});

// 生成最终文件，并清空生成的中间文件.
gulp.task('build', ['js'], function () {

});
gulp.task('pro',['js'],function(){
	console.log("compile js for production.");
	gulp.src('require.js').pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('.'));
});
// 合并js文件
gulp.task('js', [], function () {
	console.log("compile js.");
	let js = gulp.src([
		'src/**/*.js',
	])
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(jsvalidate())
		.on('error', notify.onError(e => e.message))
		.pipe(concat('require.js'))
		.pipe(gulp.dest('.'));

	if (options.env === 'pro')
		return js.pipe(uglify())
			.pipe(rename({
				extname: '.min.js'
			}))
			.pipe(gulp.dest('js'));
});

gulp.task('watch', ['build'], function () {
	options.env = 'dev';
	gulp.src('.').pipe(webserver({
		open: 'demo/',
		fallback: '404.html'
	}));
	gulp.watch(['src/**'], ['js']);
});