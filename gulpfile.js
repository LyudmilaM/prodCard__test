/* eslint-disable prettier/prettier */
// Команды для консоли:
// node -v     посмотреть версию Node.js
// npm -v      посмотреть версию npm
// npm install npm@latest -g --no-optional  - установить последнюю версию npm без дополнительных зависимостей.
// Для установки новой версии  Node.js скачиваем установочный файл с их сайта.

// npm i name --save-dev   установка пакета с названием name
// Для работы ряда пакетов необходима установка дополнительных
// пакетов, не прописанных в импортах.

// !Запуск проекта

// npm init
// npm i gulp --save-dev
// npm i -g gulp-cli

// В образовавшийся файл package.json
// !Обязательно
// !дописываем "type": "module",
// будет примерно так:
// "main": "gulpfile.js",
// "type": "module",
// "scripts": {
// 		"test": "echo \"Error: no test specified\" && exit 1"
// },

// !Загружаем пакеты дальше:

// npm i sass gulp-sass --save-dev
// npm i pug-cli --g
// npm i pug --save-dev
// npm i gulp-pug --save-dev

// npm i browser-sync --save-dev
// npm i gulp-concat --save-dev
// npm i gulp-uglify --save-dev
// npm i gulp-clean-css --save-dev
// npm i gulp-rename --save-dev
// npm i gulp-autoprefixer --save-dev
// npm i gulp-notify --save-dev
// npm i gulp.spritesmith --save-dev
// npm i gulp-imagemin --save-dev
// npm i gulp-svgmin --save-dev
// npm i gulp-replace --save-dev
// npm i gulp-svg-sprite --save-dev
// npm i gulp-fonter --save-dev
// npm i gulp-ttf2woff --save-dev
// npm i gulp-ttf2woff2 --save-dev
// npm i del --save-dev

// npm i gulp-babel --save-dev
// npm i @babel/core --save-dev
// npm i @babel/plugin-transform-runtime --save-dev
// npm i @babel/preset-env --save-dev
// npm i @babel/runtime --save-dev

// npm i --save-dev gulp-plumber
// npm i --save-dev webpack-stream
// npm i --save-dev webpack
// npm i --save-dev babel-loader

// npm i --save-dev gulp-html-beautify

// ! Для генерации изображений в форматах .webp и .avif
// ! gulp-newer смотрит, какие есть уже сгенерированные картинки, чтобы не делать повторную генерацию

// npm i --save-dev gulp-webp gulp-avif gulp-newer

// ! Для генерации фавиконок:
// npm i --save-dev gulp-real-favicon

import gulp from "gulp";
import gulpsass from "gulp-sass";
import nodesass from "sass";
const sass = gulpsass(nodesass);
import sync from "browser-sync";
const browserSync = sync.create();
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import cleancss from "gulp-clean-css";
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer";
import notify from "gulp-notify";
import spritesmith from "gulp.spritesmith";
import imagemin from "gulp-imagemin";
import svgmin from "gulp-svgmin";
import replace from "gulp-replace";
import svgSprite from "gulp-svg-sprite";
// eslint-disable-next-line no-unused-vars
import babel from "gulp-babel";
import fonter from "gulp-fonter";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import pug from "gulp-pug";
import htmlbeautify from "gulp-html-beautify";

import { deleteAsync } from "del";
import webpackStream from "webpack-stream";
import plumber from "gulp-plumber";
import webp from "gulp-webp";
import avif from "gulp-avif";
import newer from "gulp-newer";
// Генерация фавиконок
import realFavicon from "gulp-real-favicon";
import fs from "fs";

let FAVICON_DATA_FILE = "faviconData.json";

gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "app/dist",
    },
  });
  gulp.watch(["app/src/scss/**/*.scss", "app/src/temp/**/*.scss"], gulp.series("style"));
  gulp.watch(["app/dist/*.html"]).on("change", browserSync.reload);
  gulp
    .watch([
      "app/src/js/components/*.js",
      "app/src/js/components/**/*.js",
      "app/src/js/_vars.js",
      "app/src/js/functions/*.js",
    ])
    .on("change", gulp.series("babel"));
  gulp.watch(["app/src/js/babel/common.js"], gulp.series("babel"));
  gulp.watch(["app/dist/libs/**/*.js", "app/dist/js/common.js"], gulp.series("js"));
  gulp.watch("app/src/js/isIE.js").on("change", gulp.series("jsIE"));
  gulp.watch(["app/src/**/*.pug"], gulp.series("pug"));
  gulp.watch(["app/src/help/pngToSprite/*.png"], gulp.series("sprpng"));
  gulp.watch(["app/src/help/pngSpriteToMin/*.png"], gulp.series("sprm"));
  gulp.watch(["app/src/help/pngSpriteToMin/*.scss"], gulp.series("sprSM"));
  gulp.watch(["app/src/help/svgToSprite_html/*.svg"], gulp.series(["svg_html_spr"]));
  gulp.watch(["app/src/help/svgToSprite_css/*.svg"], gulp.series(["svg_css_spr"]));
  gulp.watch(["app/dist/img/sprites/_svg-sprite.scss"], gulp.series(["destSvgScss"]));
  gulp.watch(["app/src/help/images/**"], gulp.series(["imgm"]));
});

// Генерация фавиконок, файлов browserconfig.xml и site.webmanifest
// Подробнее для Gulp на сайте
// https://realfavicongenerator.net/favicon_result?file_id=p1h4fk19lk81eocv1j2o1vqsiil6
// https://realfavicongenerator.net/api/non_interactive_api
gulp.task("generate-favicon", function (done) {
  realFavicon.generateFavicon({
    masterPicture: "app/src/help/imgForFavicon/img.png",
    dest: 'app/dist/img/favicon',
    iconsPath: 'img/favicon/',
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {
        design: 'raw'
      },
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE,
  });
  done();
});

// Генерация кода для получившихся фавиконок и файлов (для примера)
gulp.task('inject-favicon-markups', function () {
  return gulp.src(['app/src/help/imgForFavicon/test.html'])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('app/src/help/imgForFavicon/html'));
});

// Проверка обновлений в RealFaviconGenerator
gulp.task('check-for-favicon-update', function (done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
  done();
});

gulp.task("style", function (done) {
  gulp
    .src("app/src/scss/**/*.scss")
    .pipe(
      sass().on(
        "error",
        notify.onError({
          message: "Error: <%= error.message %>",
          title: "Scss error",
        })
      )
    )
    .pipe(gulp.dest("app/dist/css"))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 5 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest("app/dist/css"))
    .pipe(browserSync.stream());

  done();
});

gulp.task("babel", function (done) {
  gulp
    .src("app/src/js/babel/common.js")
    .pipe(
      plumber(
        notify.onError({
          message: "Error: <%= error.message %>",
          title: "JS",
        })
      )
    )
    .pipe(
      webpackStream({
        mode: "production",
        // mode: "development",
        optimization: {
          minimize: false
        },
        output: {
          filename: "common.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_nodules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        targets: "defaults",
                      },
                    ],
                  ],
                  plugins: ["@babel/transform-runtime"],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest("app/dist/js/"));

  done();
});

gulp.task("js", function (done) {
  gulp
    .src([
      // "app/dist/libs/vanilla-tabs/vanilla-tabs.min.js",
      "app/dist/js/common.js", // Always at the end
    ])
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("app/dist/js"))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(uglify()) // Mifify js (opt.)
    .pipe(gulp.dest("app/dist/js"))
    .pipe(browserSync.stream());

  done();
});

// Скрипты для определения IE и подключения
// библиотеки htmlSshiv и файла стилей для IE
gulp.task("jsIE", function (done) {
  gulp
    .src([
      "app/src/js/isIE.js", // Always at the end
    ])
    .pipe(uglify()) // Mifify js (opt.)
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(gulp.dest("app/dist/js"))
    .pipe(browserSync.stream());

  done();
});

// PNG sprite
// Строка imgPath: '../img/sprites/sprite.png'
// указывает на путь от main.css до файла со
// спрайтом, этот путь будет в миксине.

gulp.task("sprpng", function (done) {
  var spriteData = gulp.src("app/src/help/pngToSprite/*.png").pipe(
    spritesmith({
      imgName: "sprite.png",
      cssName: "_png-sprite.scss",
      imgPath: "../img/sprites/sprite.png",
      padding: 2,
    })
  );
  spriteData.pipe(gulp.dest("app/src/help/pngSpriteToMin"));

  done();
});

// gulp.task("sprpng", function (done) {
//   gulp.src("app/src/help/pngToSprite/*.png")
//     .pipe(spritesmith({
//       imgName: "sprite.png",
//       cssName: "_png-sprite.scss",
//       imgPath: "../img/sprites/sprite.png",
//       padding: 2,
//     }))
//     .pipe(gulp.dest("app/src/help/pngSpriteToMin"))
//     .pipe(gulp.src("app/src/help/pngSpriteToMin/*.png"))
//     .pipe(
//       imagemin({
//         progressive: true,
//         optimizationLevel: 5, // 0 to 7
//       })
//     )
//     .pipe(gulp.dest("app/dist/img/sprites"))
//     .pipe(gulp.src("app/src/help/pngSpriteToMin/*.scss"))
//     .pipe(gulp.dest("app/src/scss/sprites"))
//     .pipe(gulp.dest("app/dist/img/sprites"));

//   done();
// });

// Делает изображение в обычном размере
// и увеличенном в 2 раза для retina
// Различий при использовании увеличенного
// изображения для ретина не увидела.
gulp.task("sprpngr", function (done) {
  var spriteData = gulp.src("app/src/help/pngToSprite/*.png").pipe(
    spritesmith({
      retinaSrcFilter: ["app/src/help/pngToSprite/*@2x.png"],
      imgName: "sprite.png",
      retinaImgName: "sprite@2x.png",
      cssName: "_png-sprite.scss",
      imgPath: "../img/sprites/sprite.png",
      retinaImgPath: "../img/sprites/sprite@2x.png",
      padding: 2,
    })
  );
  spriteData.pipe(gulp.dest("app/src/help/pngSpriteToMin"));

  done();
});

// Minify PNG sprite
gulp.task("sprm", function (done) {
  gulp
    .src("app/src/help/pngSpriteToMin/*.png")
    .pipe(
      imagemin({
        progressive: true,
        optimizationLevel: 5, // 0 to 7
      })
    )
    .pipe(gulp.dest("app/dist/img/sprites"));

  done();
});

// Копирует файл _png-sprite.scss в папки:
// app/scss/helper - для работы с миксинами,
// app/dist/img/sprites - для клиентов.
gulp.task("sprSM", function (done) {
  gulp
    .src("app/src/help/pngSpriteToMin/*.scss")
    .pipe(gulp.dest("app/src/scss/sprites"))
    .pipe(gulp.dest("app/dist/img/sprites"));

  done();
});

// Для спрайта не делаю три задачи в один таск
// для gulp.watch, так как
// задачи выполняются асинхронно и недовыполняются в
// результате.
// gulp.task('sprPng', gulp.series(['sprpng', 'sprm', 'sprSM']));

// Удаление всех картинок из папки img2 при добавлении
// или удалении картинок из help/images
gulp.task("del1", function (done) {
  deleteAsync(["app/dist/img2/**"]);
  done();
});

// Вместо удаления всех картинок из папки
// app/dist/img2 используем плагин newer,
// который смотрит, что есть в этой папке,
// и если уже есть сжатые и сконвертированные
// изображения, то галп файл будет работать
// только с вновь добавленными изображениями.

// Конвертирование в формат webp, svg не конвертирует,
// поэтому не делаем выборку, как с avif
gulp.task("webp", function (done) {
  gulp.src(["app/src/help/images/*.*"])
    .pipe(newer("app/dist/img2/"))
    .pipe(webp())
    .pipe(gulp.dest("app/dist/img2/"));
  done();
});

// Конвертирование в формат avif
gulp.task("avif", function (done) {
  gulp.src(["app/src/help/images/*.*", "!app/src/help/images/*.svg"])
    .pipe(newer("app/dist/img2/"))
    .pipe(avif({ quality: 50 }))
    .pipe(gulp.dest("app/dist/img2/"));
  done();
});

// Minify PNG, JPEG, GIF, SVG
// Не работает со спрайтами svg, но хорошо сжимает отдельные svg
// ! НЕ ХОРОШО СЖИМАЕТ SVG

gulp.task("imgMinimum", function (done) {
  gulp
    .src("app/src/help/images/**")
    // .pipe(newer("app/dist/img2/"))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [
          {
            removeViewBox: false,
            removeHiddenElems: false,
            removeUnusedNS: false,
            removeUselessDefs: false,
            collapseGroups: false,
            cleanupIDs: false,
            removeEmptyContainers: false,
          },
        ],
        interlaced: true,
        optimizationLevel: 3, // 0 to 7
      })
    )
    .pipe(gulp.dest("app/dist/img2/"));

  done();
});

// Если накосячить и ненужные изображения
// окажутся в app/dist/img2, то, наверно,
// удалить все из этой папки с помощью таска
// gulp del1 и заново
// вручную сделать таск imgm

// gulp.task("imgm", gulp.series(["del1", "imgMinimum", "webp", "avif"]));
// ! Пока убираем конвертацию в "webp" и "avif"
gulp.task("imgm", gulp.series(["del1", "imgMinimum"]));
// gulp.task("imgm", gulp.series(["imgMinimum", "webp", "avif"]));


// SVG sprites
// Сначала минифицируем, затем собираем спрайт
// replace('xmlns="http://www.w3.org/2000/svg"', '') делаем,
// чтобы в каждом теге symbol не было этой ссылки

gulp.task("svg_html_spr", function (done) {
  gulp
    .src("app/src/help/svgToSprite_html/*.svg")
    .pipe(
      svgmin({
        multipass: true,
        js2svg: {
          pretty: true,
          indent: 2,
        },
        plugins: ["removeDoctype", "removeXMLNS", "sortAttrs"],
      })
    )
    .pipe(replace('xmlns="http://www.w3.org/2000/svg"', ""))
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          symbol: true,
          inline: true
        },
        svg: {
          xmlDeclaration: false
        }
      })
    )
    // .pipe(replace('fill="none"', ""))
    // .pipe(replace(/fill="([^"]*)"/g, 'fill="currentColor"'))
    .pipe(gulp.dest("app/dist/img/sprites/"));

  done();
});

gulp.task("svg_css_spr", function (done) {
  gulp
    .src("app/src/help/svgToSprite_css/*.svg")
    .pipe(
      svgmin({
        multipass: true,
        js2svg: {
          pretty: true,
          indent: 2,
        },
        plugins: ["removeDoctype", "removeXMLNS", "sortAttrs"],
      })
    )
    .pipe(replace('xmlns="http://www.w3.org/2000/svg"', ""))
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          css: {
            dest: "./",
            bust: false,
            render: {
              scss: {
                dest: "_svg-sprite.scss",
                template: "app/src/scss/sprites/_svg-sprite-template.scss"
              }
            }
          }
        },
        svg: {
          precision: 3,
          xmlDeclaration: false
        },
        variables: {
          mapname: "icons"
        }
      })
    )
    .pipe(gulp.dest("app/dist/img/sprites/"));

  done();
});

gulp.task("destSvgScss", function (done) {
  gulp
    .src("app/dist/img/sprites/_svg-sprite.scss")
    .pipe(gulp.dest("app/src/scss/sprites"));

  done();
});

// .otf to .ttf
// gulp.task('tottf', function(done){
// 	gulp.src('app/src/help/fonts/*.otf')
//     .pipe(fonter({
// 			formats: ['ttf']
// 		}))
//     .pipe(gulp.dest('app/src/help/fonts/'));
//
// 		done();
// });

// Просто перемещает шрифт .ttf из папки help в app/dist/fonts/
gulp.task("tof", function (done) {
  gulp
    .src("app/src/help/fonts/*.ttf")
    .pipe(gulp.dest("app/dist/fonts/"));

  done();
});

// .ttf to .eot
gulp.task("toe", function (done) {
  gulp
    .src("app/src/help/fonts/*.ttf")
    .pipe(
      fonter({
        formats: ["eot"],
      })
    )
    .pipe(gulp.dest("app/dist/fonts/"));

  done();
});

// .ttf to .woff
gulp.task("tow", function (done) {
  gulp
    .src("app/src/help/fonts/*.ttf")
    .pipe(ttf2woff())
    .pipe(gulp.dest("app/dist/fonts/"));

  done();
});

// .ttf to .woff2
gulp.task("tow2", function (done) {
  gulp
    .src("app/src/help/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("app/dist/fonts/"));

  done();
});

gulp.task("f", gulp.series(["toe", "tow", "tow2", "tof"]));

gulp.task("pug", function (done) {
  gulp
    .src(["app/src/*.pug", "!app/src/project-content.pug", "!app/src/include.pug"])
    .pipe(
      pug({ pretty: true }).on(
        "error",
        notify.onError({
          message: "Error: <%= error.message %>",
          title: "Pug error",
        })
      )
    )
    .pipe(htmlbeautify({
      indent_size: 2,
    }))
    .pipe(gulp.dest("app/dist"));

  done();
});

// task watch - изменения, внесенные в проект, когда не запущен галп,
// будут осуществлены при запуске галп.
gulp.task(
  "watch",
  gulp.series("style", "babel", "js", "pug", "browser-sync"),
  function () {
    gulp.watch(["app/src/scss/**/*.scss", "app/src/temp/**/*.scss"], gulp.series("style"));
    gulp.watch(["app/src/js/babel/common.js"], gulp.series("babel"));
    gulp.watch(["dist/libs/**/*.js", "app/dist/js/common.js"], gulp.series("js"));
    gulp.watch(["app/src/**/*.pug"], gulp.series("pug"));
    gulp.watch(["app/src/help/pngToSprite/*.png"], gulp.series("sprpng"));
    gulp.watch(["app/src/help/pngSpriteToMin/*.png"], gulp.series("sprm"));
    gulp.watch(["app/src/help/pngSpriteToMin/*.scss"], gulp.series("sprSM"));
    gulp.watch(["app/src/help/svgToSprite_html/*.svg"], gulp.series(["svg_html_spr"]));
    gulp.watch(["app/src/help/svgToSprite_css/*.svg"], gulp.series(["svg_css_spr"]));
    gulp.watch(["app/dist/img/sprites/_svg-sprite.scss"], gulp.series(["destSvgScss"]));
    gulp.watch(["app/src/help/images/**"], gulp.series(["imgm"]));
    gulp.watch("app/dist/*.html").on("change", browserSync.reload);
    gulp
      .watch([
        "app/src/js/components/*.js",
        "app/src/js/components/**/*.js",
        "app/src/js/_vars.js",
        "app/src/js/functions/*.js",
      ])
      .on("change", gulp.series("babel"));
    gulp.watch("app/src/js/isIE.js").on("change", gulp.series("jsIE"));
  }
);

gulp.task("default", gulp.series("watch"));
