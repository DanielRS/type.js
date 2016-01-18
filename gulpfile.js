const gulp = require('gulp'),
			uglify = require('gulp-uglify'),
			rename = require('gulp-rename');

gulp.task('build', function() {
	return gulp
		.src('src/**/*.js')
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	return gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['watch', 'build']);
