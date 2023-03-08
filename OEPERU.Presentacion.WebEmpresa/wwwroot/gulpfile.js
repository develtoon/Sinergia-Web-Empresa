const path = require('path');
const { src, watch, dest } = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('autoprefixer-stylus');
const sourcemaps = require('gulp-sourcemaps');
const notify = require("gulp-notify");

const concat = require('gulp-concat');

// const fs   = require('fs');
// const exec = require('child_process').exec;
// const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
var strip = require('gulp-strip-comments');

const BABELCONFIG = {
    "presets": [
        ["@babel/preset-env", {
            "targets": { "browsers": ["ie >= 11"] }
        }]
    ],
    // "plugins": [
    //     ["polyfill-corejs3", {
    //         "method": "usage-pure",
    //         "targets": { "browsers": ["ie >= 11"] }
    //     }]
    // ]
}
function styles(file) {
    console.log(file);
    return src('./src/styl/main.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true,
            use: [autoprefixer('iOS >= 7', 'last 1 Chrome version')]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(rename(function (file) {
            file.basename += "-min";
        }))
        .pipe(dest('./css'))
        /*.pipe(notify('Stylus compilado: '))*/
}

function style() {
    return src('./src/styl/styles.styl')
        .pipe(stylus({
            compress: true,
            use: [autoprefixer()]
        }))
        .pipe(dest('./css'))
}

function handleError(error) {
    console.log('---ERROR---', error.toString());
    notify('---ERROR---');
    this.emit('end');
}

const stylusConf = [
    './src/styl/settings/_colors.styl',
    './node_modules/stylus-mq/mq.styl',
    './src/styl/settings/_breakpoints.styl',
    './src/styl/tools/_functions.styl'
]

function oneStyle(file) {
    let divider = file.indexOf('/') > -1 ? '/' : '\\';
    var bundle = file.split(divider);
    var output = bundle.slice(2, bundle.length - 1);
    output.unshift('./css');
    output = output.join('/');

    console.log("compilando css", file);

    return src([...stylusConf, file])
        .pipe(concat(file))
        .pipe(stylus({
            compress: true,
            use: [autoprefixer()]
        }))
        .pipe(rename(function (file) {
            file.dirname = path.dirname(file.basename);
            file.basename += "-min";
            file.extname = ".css";
        }))
        .pipe(dest(output))
    //.pipe(notify('ESTILOS: ' + bundle.slice(2).join('/') + ' transpilado'))
}


function scripts(file) {
    let divider = file.indexOf('/') > -1 ? '/' : '\\';
    var bundle = file.split(divider);
    var output = bundle.slice(2, bundle.length - 1);
    output.unshift('./js');
    output = output.join('/');

    console.log("compilando", file);

    return src(file)
        .pipe(strip())
        .pipe(babel(BABELCONFIG))
        .on('error', handleError)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(rename({ suffix: "-min" }))
        .pipe(rename(function (file) {
            file.dirname = path.dirname(file.basename);
            file.basename += "-min";
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(output))
    //.pipe(notify('SCRIPT: ' + bundle.slice(2).join('/') + ' compilado'))
}

function defaultTask() {
    watch('./src/styl/**/*.styl', { ignoreInitial: false }, styles);
    watch('./src/styl/styles.styl', { ignoreInitial: false }, style);
    watch('./src/scripts/**/*.js').on("change", scripts);
    watch('./src/styles/**/*.styl').on("change", oneStyle);
};

// function clean () {
//     return del(['dist/**', '!dist'], {force:true});
// }

function buidCss() {
}
function buidJs() {
    return src('./src/scripts/**/*.js')
        .pipe(strip())
        .pipe(babel(BABELCONFIG))
        .on('error', handleError)
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(rename(function (file) {
        //     // file.dirname = path.dirname(file.basename);
        //     file.basename += "-min";
        // }))
        // .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(notify('script: Compilado for prod'))
}

function buidCore() {
    src('./src/scripts/**/*.js')
}


exports.buidCore = buidCore;
exports.buildJs = buidJs;
exports.buildCss = buidCss;

exports.default = defaultTask
