
module.exports = function(template) {
  return function serverError(err, req, res, next) {
    var model = {
      url: req.url,
      err: err,
      statusCode: 500,
      isDevelopment: req.app.get('env') === 'development'
    };

    if (req.xhr) {
      res.status(500).send(model);
    } else {
      res.status(500);
      res.render(template, model);
    }
  };
};
