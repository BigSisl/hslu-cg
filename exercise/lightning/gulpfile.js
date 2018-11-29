var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('default', function() {
    gulp.src(['src/**'])
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch("src/**", ['default']);
});

gulp.task('browserSync', function() {
    browserSync.init({
       server: {
          baseDir: 'src'
       },
    })
})