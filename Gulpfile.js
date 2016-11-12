'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var include      = require('gulp-include');
var exec         = require('child_process').exec;

gulp.task('default', ['build']);

gulp.task('run', ['assets'], callback => {
  exec('electron app', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(error);
  });
});

gulp.task('pack', ['assets'], callback => {
  exec('build --dir', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(error);
  });
});

gulp.task('dist', ['assets'], callback => {
  exec('build', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(error);
  });
});

gulp.task('assets', ['css', 'js']);

gulp.task('watch', ['assets'], () => {
  gulp.watch('./src/scss/**/*.scss', ['css']);
  gulp.watch('./src/js/**/*.js', ['js']);
});

gulp.task('css', () => {
  gulp.src('./src/scss/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
    }))
    .pipe(gulp.dest('./app/assets/css'));
});

gulp.task('js', () => {
  gulp.src('./src/js/*.js')
    .pipe(include())
    .pipe(gulp.dest('./app/assets/js'));
});

