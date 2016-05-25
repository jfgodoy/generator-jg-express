var express = require('express'),
    bootstrap = require('./lib/bootstrap'),
    app;

app = express();
bootstrap(app);


module.exports = app;
