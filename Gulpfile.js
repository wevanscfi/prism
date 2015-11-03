var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

gulp.task('js', function(){
    return gulp.src([
          'jssrc/prism.js',
          'jssrc/helpers.js',
          'jssrc/utils/tooltip.js',
          'jssrc/charts/base.js',
          'jssrc/charts/axis.js',
          'jssrc/charts/barchart.js',
          'jssrc/charts/barchartmulti.js',
          'jssrc/charts/compoundbar.js',
          'jssrc/charts/piechart.js',
          'jssrc/charts/doughnut.js',
          'jssrc/widgets/base.js',
          'jssrc/widgets/testlist.js',
          'jssrc/pages/base.js',
          'jssrc/pages/resultsdash.js',
          'jssrc/pages/sampledash.js',
        ])
        .pipe(gp_concat('concat.js'))
        .pipe(gp_rename('prism.js'))
        .pipe(gulp.dest('js'))
        .pipe(gp_uglify())
        .pipe(gp_rename('prism.min.js'))
        .pipe(gulp.dest('js'));
});

//Watch all less files, and recompile css on change
gulp.task('watch', function () {
    gulp.watch('jssrc/**/*.js', ['js']);
});

gulp.task('default', ['js', 'watch']);