'use strict';

var handlebars = require('handlebars/dist/handlebars.runtime');

handlebars.registerHelper('upper', function(value) {
  return value.toUpperCase();
});

module.exports = handlebars;
