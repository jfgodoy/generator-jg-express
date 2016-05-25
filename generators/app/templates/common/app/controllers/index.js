
var express = require('express');
var router = express.Router();

router.use('/api', require('./api'));
router.use('/error', require('./error'));
router.use('/', require('./home'));

module.exports = function create() {
  return router;
};
