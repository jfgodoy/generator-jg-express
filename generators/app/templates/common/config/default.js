var path = require('path');
var tryRequire = require('try-require');
var winston = require('winston');
var PROJECT_ROOT = path.resolve(__dirname, '../');

module.exports = {
  'express': {
    'port': process.env.PORT || 8000,
    'view engine': 'hbs',
    'views': `${PROJECT_ROOT}/build/views`,
    'x-powered-by': false
  },

  'view engines': {
    'hbs': {
      'module': 'express-handlebars',
      'arguments': [{
        'extname': 'hbs',
        'layoutsDir': `${PROJECT_ROOT}/build/views/layouts`,
        'defaultLayout': 'main',
        'helpers': tryRequire(`${PROJECT_ROOT}/app/lib/handlebars/helpers`)
      }]
    }
  },

  'middlewares': {

    'compress': {
      'enabled': true,
      'priority': 10,
      'module': 'compression'
    },

    'favicon': {
      'enabled': true,
      'priority': 30,
      'module': {
        'name': 'serve-favicon',
        'arguments': [ `${PROJECT_ROOT}/build/public/favicon.ico` ]
      }
    },

    'static': {
      'enabled': true,
      'priority': 40,
      'module': {
        'name': 'serve-static',
        'arguments': [ `${PROJECT_ROOT}/build/public` ]
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
            new winston.transports.Console({
              json: true,
              stringify: true,
              colorize: false
            })
          ],
          meta: true,
          msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms'
        }]
      }
    },

    'json': {
      'enabled': true,
      'priority': 60,
      'module': {
        'name': 'body-parser',
        'method': 'json'
      }
    },

    'urlencoded': {
      'enabled': true,
      'priority': 70,
      'module': {
        'name': 'body-parser',
        'method': 'urlencoded',
        'arguments': [{ 'extended': true }]
      }
    },

    'multipart': {
      'enabled': true,
      'priority': 80,
      'module': `${PROJECT_ROOT}/lib/middlewares/multipart`
    },

    'session': {
      'enabled': true,
      'priority': 100,
      'module': {
        'name': 'express-session',
        'arguments': [
          {
            'secret': 'keyboard cat',
            'cookie': {
              'path': '/',
              'httpOnly': true,
              'maxAge': null
            },
            'resave': true,
            'saveUninitialized': true,
            'proxy': null
          }
        ]
      }
    },


    'router': {
      'enabled': true,
      'priority': 120,
      'module': {
        'name': `${PROJECT_ROOT}/app/controllers/index`
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
              stringify: true,
              colorize: false
            })
          ],
          meta: true,
          msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms'
        }]
      }
    },

    'error404': {
      'enabled': true,
      'priority': 130,
      'module': {
        'name': `${PROJECT_ROOT}/app/lib/middlewares/404`,
        'arguments': ['errors/404']
      }
    },

    'error500': {
      'enabled': true,
      'priority': 140,
      'module': {
        'name': `${PROJECT_ROOT}/app/lib/middlewares/500`,
        'arguments': ['errors/500']
      }
    }

  }
};
