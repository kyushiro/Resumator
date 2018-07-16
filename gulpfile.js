var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(){
  return gulp.src('assets/theme/common/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('assets/theme/common/css'))
    // .pipe(browserSync.reload({
    //   stream: true
    // }))
});

gulp.task('sass-theme', function(){
  return gulp.src('assets/theme/**/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('assets/theme/**/css'));
});

//gulp watch

gulp.task('watch', ['sass', 'sass-theme'], function(){
  gulp.watch('assets/theme/common/scss/**/*.scss', ['sass']);
  gulp.watch('assets/theme/**/scss/**/*.scss', ['sass-theme']);
  //gulp.watch('app/js/**/*.js', browserSync.reload);
});