
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
  throw new Error('test error');
});


module.exports = router;
