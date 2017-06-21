// Include gulp and gulp 
var gulp = require('gulp'),
    //general
    ifelse = require('gulp-if-else'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    //html
    fileinclude = require('gulp-file-include'),
    htmlPrettify = require('gulp-html-prettify'),
    //css
	cssnano = require('gulp-cssnano'),
    //async
    async = require('async');

//initiate variables
var env,
	htmlSources,
	cssSources,
	outputDir;

var outputDir = 'build/'; //set output directory to production

componentSources = ['components/**/*'];
htmlSources = ['components/html/templates/**/*.html'];
templateSources = ['components/html/modules/**/*.html'];
cssSources = ['components/css/**/*.css'];

//HTML task
gulp.task('html', function(){
    async.series([
        function(next)
        {
            gulp.src(htmlSources)
                .pipe(fileinclude({
                  prefix: '@@',
                  basepath: '@file'
                }))
                .pipe(htmlPrettify({indent_char:' ',indent_size:4}))
                .pipe(gulp.dest(outputDir+'templates/'))
                .on('end',next);
        },
        function(next)
        {
            gulp.src(componentSources)
                .pipe(connect.reload());
        }
    ])
});

gulp.task('css', function(){
    async.series([ //development build functions
        function(next)
        {
            gulp.src(cssSources)
                .pipe(gulp.dest(outputDir+'css/'))
                .pipe(cssnano({zindex: false}))
                .pipe(rename({
                    suffix: ".min"
                }))
                .pipe(gulp.dest(outputDir+'css/'))
                .on('end',next);

        },
        function(next)
        {
            gulp.src(componentSources)
                .pipe(connect.reload());
        }
    ]);
});

gulp.task('watch', function() {
    gulp.watch(htmlSources,['html']);
    gulp.watch(templateSources,['html']);
    gulp.watch(cssSources,['css']);
});

gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

// Default Task
/*gulp.task('default', ['fileinclude','html','lint','css','scripts','watch']);*/

gulp.task('default',['html','css','connect','watch']);