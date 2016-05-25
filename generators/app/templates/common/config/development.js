var path = require('path');
var tryRequire = require('try-require');
var winston = require('winston');
var PROJECT_ROOT = path.resolve(__dirname, '../');


module.exports = {
  'express': {
    'views': `${PROJECT_ROOT}/app/views`
  },

  'view engines': {
    'hbs': {
      'module': 'express-handlebars',
      'arguments': [{
        'extname': 'hbs',
        'layoutsDir': `${PROJECT_ROOT}/app/views/layouts`,
        'defaultLayout': 'main',
        'helpers': tryRequire(`${PROJECT_ROOT}/app/lib/handlebars/helpers`)
      }]
    }
  },

  'middlewares': {

    'compress': {
      'enabled': false,
      'priority': 10,
      'module': 'compression'
    },

    'favicon': {
      'enabled': true,
      'priority': 30,
      'module': {
        'name': 'serve-favicon',
        'arguments': [ `${PROJECT_ROOT}/app/public/favicon.ico` ]
      }
    },

    'static': {
      'module': {
        'name': `${PROJECT_ROOT}/lib/middlewares/broccoliMiddleware`,
        'arguments': [{"treePrefix": "public"}]
      }
    },

    'logger': {
      'enabled': true,
      'priority': 50,
      'module': {
        'name': 'express-winston',
        'method': 'logger',
        'arguments': [{
          transports: [
            new winston.transports.Console({})
          ],
          meta: false,
          expressFormat: true
        }]
      }
    },

    'errorLogger': {
      'enabled': true,
      'priority': 125,
      'module': {
        'name': 'express-winston',
        'method': 'errorLogger',
        'arguments': [{
          transports: [
            new winston.transports.Console({
              json: true,
              stringify: false,
              colorize: false
            })
          ],
          meta: true,
          msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms'
        }]
      }
    }

  }
};
