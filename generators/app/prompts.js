'use strict';


module.exports = [
  {
    message: 'Description',
    name: 'description',
    validate: function (str) {
      return !!str;
    }
  },

  {
    message: 'Author',
    name: 'author',
    validate: function (str) {
      return !!str;
    }
  }
];
