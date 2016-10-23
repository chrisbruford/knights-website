var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var autoprefixer = require('gulp-autoprefixer');

//browserify
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
    return browserify({
        entries: './public_src/es6/app.js',
        debug: true
        
    })
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public_src/js'));
});

 
gulp.task('autoprefixer', function () {
	return gulp.src('app/css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('sass',function(){
   return gulp.src('public_src/scss/**/*.scss')
   .pipe(sourcemaps.init())
   .pipe(sass({includePaths: ['public_src/lib/foundation-sites/scss','public_src/lib/motion-ui/src']}))
   .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
   .pipe(gulp.dest('public_src/css'))
   .pipe(browserSync.reload({
       stream: true
   }));
});

gulp.task('browserSync',function(){
    browserSync.init({
        server: {
            baseDir: 'public_src',
            routes: {
        '/bower_components': 'bower_components'
      }
        }
    })
});

gulp.task('watch',function(){
    gulp.watch('./public_src/scss/**/*.scss', ['sass']);
    gulp.watch('./public_src/es6/**/*.js', ['browserify']);
    gulp.watch('./public_src/*.html',browserSync.reload);
    gulp.watch('./public_src/js/**/*.js',browserSync.reload);    
});

gulp.task('useref', function(){
    return gulp.src('public_src/**/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css',cssnano()))
    .pipe(gulp.dest('public'));
});

gulp.task('images',function(){
   return gulp.src('public_src/images/**/*.+(jpg|gif|png|svg)')
   .pipe(cache(imagemin({
       interlaced: true
   })))
   .pipe(gulp.dest('public/images'));
});


gulp.task('fonts', function(){
   return gulp.src('public_src/font/**/*')
   .pipe(gulp.dest('public/font')); 
});

gulp.task('clean:dist',function(){
    return del.sync('public');
});

gulp.task('cache:clear',function(callback){
    return cache.clearAll(callback);
});

gulp.task('wiredep',function(){
    return gulp.src('public_src/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('public_src'));
});

gulp.task('build',function(callback){
    runSequence('clean:dist','wiredep', 'sass','browserify', 'autoprefixer',
    ['useref','images','fonts']);
});

gulp.task('default',function(){
    runSequence('sass','browserify','wiredep',['autoprefixer','browserSync','watch']);
});