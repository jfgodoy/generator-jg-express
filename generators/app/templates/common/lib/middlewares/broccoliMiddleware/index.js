var broccoli = require('broccoli');
var tree = broccoli.loadBrocfile();
var builder = new broccoli.Builder(tree);
var watcher = new broccoli.Watcher(builder);
var broccoliMiddleware = broccoli.getMiddleware(watcher, {autoIndex: false});


module.exports = function (config) {
  config = config || {treePrefix: ''};

  return function(req, res, next) {
    var url = req.url;

    req.url = config.treePrefix + req.url;
    broccoliMiddleware(req, res, function() {
      req.url = url;
      next();
    });
  };
};
