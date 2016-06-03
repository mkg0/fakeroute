gulp= require('gulp');
sync = require('browser-sync').create();
plumber = require('gulp-plumber');
rename = require('gulp-rename');
sourcemaps  = require('gulp-sourcemaps');
uglify = require('gulp-uglify');
babel= require('gulp-babel');

gulp.task('script',function () {
    return gulp.src(['src/fakeroute.js','src/fakeroute.es6'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel({
        babelrc:false,
        presets: ['es2015']
    }))
    .pipe(rename({extname:'.js'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({stream:true}));
});

gulp.task('html',function () {
    sync.reload();
});


gulp.task('default',function () {
    serve();
    gulp.watch(['src/*.js','src/*.es6'],['script']);
    gulp.watch('*.html',['html']);
});


function serve() {
    sync.init({
        server: {
          baseDir: './'
        },
    });
}
