var config = require('config');

module.exports = function configure(app) {
  var settings = config.get('express');

  Object.keys(settings).forEach(function (name) {
    app.set(name, settings[name]);
  });

  return app;
};
