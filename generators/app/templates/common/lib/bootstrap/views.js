'use strict';

var config = require('config');
var debug = require('debug')('lib/views');


module.exports = function views(app) {
  var engines;

  debug('initializing views');

  engines = config.get('view engines') || {};
  Object.keys(engines).forEach(function (ext) {
    var spec, module, args, engine;

    spec = engines[ext];
    module = require(spec.module);
    args = spec.arguments ? spec.arguments.slice() : [];

    if (spec.method) {
      engine = module[spec.method].apply(null, args);
    } else if (spec.arguments) {
      engine = module.apply(null, args);
    } else {
      engine = module;
    }

    debug(ext, engine);
    app.engine(ext, engine);
  });

  return app;
};
