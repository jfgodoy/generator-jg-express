var meddleware = require('meddleware');
var config = require('config');
var settings = require('./settings');
var views = require('./views');


module.exports = function bootstrap(app, options) {
  app = settings(app);
  app = views(app);
  app.use(meddleware(config.get('middlewares')));
  return app;
};
