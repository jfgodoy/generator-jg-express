'use strict';

var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');
var mv = require('broccoli-stew').mv;

var compileLess = require('broccoli-less-single');
var broccoliHandlebars = require('broccoli-handlebars-commonjs');
var fastBrowserify = require('broccoli-fast-browserify');
var uglifyJavaScript = require('broccoli-uglify-js');
var AssetRev = require('broccoli-asset-rev');
var env = require('broccoli-env').getEnv();

const PUBLIC = 'app/public';
const ISPRODUCTION = (env === 'production');
const ISDEVELOPMENT = (env === 'development');


/***************************************
 *               styles                *
 ***************************************/
function compileStyles() {
  var css, assets, modulesAssets;

  css = compileLess(PUBLIC, 'css/app.less', 'css/app.css',  {
    relativeUrls: true,
    compress: ISPRODUCTION
  });

  // include all assets in css folder
  assets = funnel(PUBLIC, {
    include: ['css/**/*{ico,gif,jpg,png,svg,woff,ttf}']
  });

  // include some assets from node_modules folder
  modulesAssets = funnel('node_modules', {
    include: [
      //'bootstrap/dist/fonts/**'
    ],
    destDir: 'node_modules'
  });

  return mergeTrees([css, assets, modulesAssets]);
}


/***************************************
 *               scripts               *
 ***************************************/
function compileScripts() {
  var scripts, libs;

  libs = [];

  // convertir templates handlebars a javascript
  scripts = broccoliHandlebars(PUBLIC, {
    srcDir: PUBLIC,
    runtimePath: PUBLIC + '/js/handlebarsRuntime.js'
  });

  scripts = fastBrowserify(scripts, {
    browserify: {
      debug: ISDEVELOPMENT
    },

    bundles: {
      'js/vendor.js': {
        require: libs
      },

      'js/app.js': {
        entryPoints: 'js/app.js',
        externals: libs,
        transform: [['babelify', {presets: ['es2015']}], ['loose-envify', {NODE_ENV: env}]]
      }
    }
  });

  if (ISPRODUCTION) {
    scripts = uglifyJavaScript(scripts, {
      mangle: true,
      compress: {
        drop_console: true
      }
    });
  }

  return scripts;
}


/***************************************
 *               images                *
 ***************************************/
function optimizeImages() {
  var images = funnel(PUBLIC, {
    include: ['favicon.ico', 'img/**']
  });

  return images;
}


/***************************************
 *               views                 *
 ***************************************/
function compileViews() {
  return funnel('app/views', {
    destDir: 'views'
  });
}


/***************************************
 *         assets revision             *
 ***************************************/
function addRevision(assets, views) {
 /**
  * Agregar firma a los archivos estaticos.
  * Para que las rutas queden correctas las vistas deben estar en el
  * mismo directorio que los assets
  */
  var assetsAndViews, publicOutput, viewsOutput

  assetsAndViews = mergeTrees([assets, views]);

  assetsAndViews = new AssetRev(assetsAndViews, {
    prepend: '',
    exclude: ['views'],
    replaceExtensions: ['hbs', 'html', 'css', 'js']
  });

  publicOutput = funnel(assetsAndViews, {
    destDir: 'public',
    exclude: ['views/**']
  });

  viewsOutput = funnel(assetsAndViews, {
    include: ['views/**']
  });

  return mergeTrees([publicOutput, viewsOutput]);
}


/***************************************
 *                build                *
 ***************************************/
function build() {
  var publicFolder, assets, views, buildFolder;

  views = compileViews();
  assets = mergeTrees([
    compileStyles(),
    compileScripts(),
    optimizeImages()
  ]);

  if (ISPRODUCTION) {
    buildFolder = addRevision(assets, views);
  } else {
    publicFolder = mv(assets, 'public');
    buildFolder = mergeTrees([publicFolder, views]);
  }

  return buildFolder;
}


module.exports = build();
