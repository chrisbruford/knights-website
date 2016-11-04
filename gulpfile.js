"use strict";
let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync').create();
let useref = require('gulp-useref');
let uglify = require('gulp-uglify');
let gulpIf = require('gulp-if');
let cssnano = require('gulp-cssnano');
let imagemin = require('gulp-imagemin');
let del = require('del');
let cache = require('gulp-cache');
let runSequence = require('run-sequence');
let wiredep = require('wiredep').stream;
let autoprefixer = require('gulp-autoprefixer');
let nodemon = require('gulp-nodemon');


//browserify
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let gutil = require('gulp-util');
let sourcemaps = require('gulp-sourcemaps');
let babelify = require('babelify');

gulp.task('browserify', function () {
    // set up the browserify instance on a task basis
    return browserify({
        entries: './public/assets/es6/app.js',
        debug: true

    })
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('sass', function () {
    return gulp.src('public/assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                'node_modules/foundation-sites/scss/',
                'node_modules/motion-ui/src'
            ]
        }))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', ['nodemon'], function () {

    browserSync.init({
        port: 3876,
        proxy: {
            target: 'localhost:3000',
            ws: true
        }
    })
});

gulp.task('nodemon', function () {
    return nodemon({
        script: './bin/www',
        ext: 'js html',
        ignore: [
            'gulpfile.js',
            'node_modules/'
        ],
        watch: [
            "*.*",
            "routes",
            "modules"
        ]
    }).on('start', function () {
        if (!called) {
            called = true;
            cb();
        }
    });
})

gulp.task('watch', function () {
    gulp.watch('./public/assets/scss/**/*.scss', ['sass']);
    gulp.watch('./public/assets/es6/**/*.js', ['browserify',browserSync.reload]);
    gulp.watch('./public/modules/**/*.js', ['browserify',browserSync.reload]);
    gulp.watch('./public/*.html', browserSync.reload);
    gulp.watch('./public/routes/*.html', browserSync.reload);
    gulp.watch('./public/modules/**/*.html', browserSync.reload);
});

gulp.task('images', function () {
    return gulp.src('public/assets/images/**/*.+(jpg|gif|png|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('public/images'));
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback);
});

gulp.task('default', function () {
    runSequence(['sass', 'browserify','images'], 'browserSync', 'watch');
});