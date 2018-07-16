var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');
var debug = require('gulp-debug');

gulp.task('sass', function(){
  return gulp.src('assets/common/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('assets/common/css'));

    // .pipe(browserSync.reload({
    //   stream: true
    // }))
});

gulp.task('sass-theme', function(){
  return gulp.src('assets/theme/simple/scss/*.scss')
    .pipe(debug({path: path}))
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('assets/theme/simple/css'))
    .pipe(debug({path2: path}));
});

//gulp watch

gulp.task('watch', ['sass', 'sass-theme'], function(){
  gulp.watch('assets/common/scss/**/*.scss', ['sass']);
  //gulp.watch('app/js/**/*.js', browserSync.reload);
});