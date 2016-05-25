var express = require('express');
var IndexModel = require('../models/index');

var router = express.Router();
var model = new IndexModel();


router.get('/', function (req, res) {
  res.send(model);
});


module.exports = router;
