var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('default', ['browserSync'], function() {
  
});

gulp.task('browserSync', function() {
    browserSync.init({
       server: {
          baseDir: 'src'
       },
    })
 })