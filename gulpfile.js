/**
 *  gulp构建工具
 *  @author: leesirbupt
 *  @time: 2017年02月21日11:52:21
 *
 *  clean：清除amd文件夹
 *  babel：es6转为AMD格式的es5
 *  cached/progeny: 进行缓存增量编译
 *  less：less文件转为带prefix的css文件
 *  copy：所有非es6和less格式的文件直接复制到amd文件夹
 *  watch：监控任务，监控es6文件夹内的文件变化，并根据增量执行任务
 *  plumber: 出错不停止watch
 *  browserSync: 热替换
 */

var gulp = require('gulp'),
    del = require('del'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    cached = require('gulp-cached'),
    progeny = require('gulp-progeny'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpSequence = require('gulp-sequence'),
    plumber = require('gulp-plumber'),
    browserSync = require("browser-sync").create();

// 清空amd文件夹
gulp.task('clean', function () {
    return del('./amd', {
        force: true
    });
});

// es6转AMD格式的es5
gulp.task('babel', function () {
    return gulp.src('./es6/**/*.es6')
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
                // 默认转为commonjs，这个插件是转换为AMD的，这样才能让require使用
                // 'plugins': ['transform-es2015-modules-amd', 'transform-runtime'],
                // es6转es5
                'presets': ['es2015', 'stage-3'],
                'plugins': ['transform-runtime']
            }))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest('./amd'))
        .pipe(browserSync.reload({stream:true}));
});

// less转css
gulp.task('less', function () {
    return gulp.src('./es6/**/*.less')
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
        .pipe(gulp.dest('./amd'))
        .pipe(browserSync.reload({stream:true}));
});

// 将所有非less/es6文件直接copy
gulp.task('copy', function () {
    return gulp.src(['./es6/**/*', '!./es6/**/*.es6', '!./es6/**/*.less'])
        .pipe(cached('watchCopy'))
        .pipe(progeny())
        .pipe(gulp.dest('./amd'))
        .pipe(browserSync.reload({stream:true}));
});

// 监听文件变化，根据增量执行babel、less和copy。删除es6文件夹中源码中的文件也会对amd文件夹中对应的文件进行删除
gulp.task('watch', function () {
    browserSync.init({
        port: 2017,
        server: {
            baseDir: ['amd']
        }
    });
    return gulp.watch(['es6/**/*'], ['babel', 'less', 'copy'])
        .on('change', function (e) {
            if (e.type == 'deleted') {
                var fileType = e.path.match(/^.*\.([^.]*)$/)[1];
                switch (fileType) {
                    case 'es6':
                        // 清除cached缓存
                        delete cached.caches.watchBabel[e.path];
                        delete cached.caches.watchLint[e.path];
                        // 删除amd文件夹中对应的js文件
                        del(e.path.replace(/\\/g, '/').replace(/\/es6\//, '/amd/').replace(/\.es6$/, '.js'), {
                            force: true
                        });
                        break;
                    case 'less':
                        // 清除cached缓存
                        delete cached.caches.watchLess[e.path];
                        // 删除amd文件夹中对应的js文件
                        del(e.path.replace(/\\/g, '/').replace(/\/es6\//, '/amd/').replace(/\.less$/, '.min.css'), {
                            force: true
                        });
                        break;
                    default:
                        // 清除cached缓存
                        delete cached.caches.watchCopy[e.path];
                        // 删除amd文件夹中对应的js文件
                        del(e.path.replace(/\\/g, '/').replace(/\/es6\//, '/amd/'), {
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
