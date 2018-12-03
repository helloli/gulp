/**
 *  gulp构建工具
 *  @author: leesirbupt
 *  @created time: 2017年02月21日11:52:21
 *  @last modified: 2018年11月30日11:35:06
 *
 *  clean：清除dist文件夹
 *  babel：es6转为AMD格式的es5
 *  cached/progeny: 进行缓存增量编译
 *  less：less文件转为带prefix的css文件
 *  copy：所有非es6和less格式的文件直接复制到dist文件夹
 *  watch：监控任务，监控src文件夹内的文件变化，并根据增量执行任务
 *  plumber: 出错不停止watch
 *  browserSync: 热替换
 * 
 *  TODO: 
 *  1. 静态文件哈希
 *  2. gulp.pxTorem
 *  3. yaml 动态配置
 */

var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var cached = require('gulp-cached');
var progeny = require('gulp-progeny');
var sourcemaps = require('gulp-sourcemaps');
var gulpSequence = require('gulp-sequence');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();

// 清空dist文件夹
gulp.task('clean', function () {
  return del('./dist', {
    force: true
  });
});

// es6转es5
gulp.task('babel', function () {
  return gulp.src('./src/**/*.js')
    .pipe(plumber(function (e) {
      console.log(e);
    }))
    .pipe(cached('watchBabel'))
    .pipe(progeny())
    .pipe(eslint())
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .pipe(sourcemaps.init())
      .pipe(babel({
        'presets': ['es2015', 'stage-3'],
        'plugins': ['transform-runtime']
      }))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream:true}));
});

// less转css
gulp.task('less', function () {
  return gulp.src('./src/**/*.less')
    .pipe(plumber(function (e) {
      console.log(e);
    }))
    .pipe(cached('watchLess'))
    .pipe(progeny())
    .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))
      .pipe(cssmin())
      .pipe(rename({
        suffix: '.min'
      }))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream:true}));
});

// 将所有非less/js文件直接copy
gulp.task('copy', function () {
  return gulp.src(['./src/**/*', '!./src/**/*.js', '!./es6/**/*.less'])
    .pipe(cached('watchCopy'))
    .pipe(progeny())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream:true}));
});

// 监听文件变化，根据增量执行babel、less和copy。删除src文件夹中源码中的文件也会对dist文件夹中对应的文件进行删除
gulp.task('watch', function () {
  // 启动热加载服务，默认会打开localhost:2018，根目录为dist文件夹
  browserSync.init({
    port: 2018,
    server: {
      baseDir: ['dist']
    }
  });
  return gulp.watch(['src/**/*'], ['babel', 'less', 'copy'])
    .on('change', function (e) {
      if (e.type == 'deleted') {
        var fileType = e.path.match(/^.*\.([^.]*)$/)[1];
        switch (fileType) {
          case 'js':
            // 清除cached缓存
            delete cached.caches.watchBabel[e.path];
            delete cached.caches.watchLint[e.path];
            // 删除dist文件夹中对应的js文件
            del(e.path.replace(/\\/g, '/').replace(/\/src\//, '/dist/'), {
              force: true
            });
            break;
          case 'less':
            // 清除cached缓存
            delete cached.caches.watchLess[e.path];
            // 删除dist文件夹中对应的js文件
            del(e.path.replace(/\\/g, '/').replace(/\/src\//, '/dist/').replace(/\.less$/, '.min.css'), {
              force: true
            });
            break;
          default:
            // 清除cached缓存
            delete cached.caches.watchCopy[e.path];
            // 删除dist文件夹中对应的js文件
            del(e.path.replace(/\\/g, '/').replace(/\/src\//, '/dist/'), {
              force: true
            });
            break;
        }
      }
      console.log('File ' + e.path + ' was ' + e.type + ', running tasks...');
    });
});

// gulp会执行的默认任务
gulp.task('default', gulpSequence('clean', ['babel', 'less', 'copy'], 'watch'));