'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var include      = require('gulp-include');
var exec         = require('child_process').exec;

gulp.task('css', () => {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/assets/css'));
});

gulp.task('js', () => {
  return gulp.src('./src/js/*.js')
    .pipe(include())
    .pipe(gulp.dest('./app/assets/js'));
});

gulp.task('assets', gulp.parallel('css', 'js'));

gulp.task('watch', gulp.series('assets', () => {
  gulp.watch('./src/scss/**/*.scss', ['css']);
  gulp.watch('./src/js/**/*.js', ['js']);
}));

gulp.task('app', gulp.series('assets', callback => {
  exec('electron app', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(error);
  });
}));

gulp.task('prepare', gulp.series('assets', callback => {
  exec('electron-builder build --dir', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(error);
  });
}));

gulp.task('build', gulp.series('assets', callback => {
  exec('electron-builder build', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(error);
  });
}));

gulp.task('default', gulp.series('build'));

