'use strict';
var yeoman = require('yeoman-generator');
var slugg = require('slugg');
var path = require('path');
var prompts = require('./prompts');

module.exports = yeoman.Base.extend({

  initializing: function() {
    // Read app name from CLI
    this.argument('name', { type: String, required: false });
  },

  prompting: {
    askAppNameEarly: function() {
      if (this.name) {
        return;
      }

      var next = this.async();

      // Handle setting the root early, so .yo-rc.json ends up the right place.
      this.prompt([{
        message: 'Name',
        name: 'name',
        validate: function (str) {
          return !!str;
        }
      }], function (props) {
        this.name = props.name;
        next();
      }.bind(this));
    },

    setAppName: function () {
      var oldRoot = this.destinationRoot();
      if (path.basename(oldRoot) !== this.name) {
        this.destinationRoot(path.join(oldRoot, this.name));
      }
    },

    askFor: function askFor() {
      var next = this.async();

      this.prompt(prompts, function (props) {
        for (var key in props) {
          if (props[key] != null) {
            this.config.set(key, props[key]);
          }
        }

        next();
      }.bind(this));
    }
  },

  writing: {
    files: function() {
      this.fs.copyTpl(
        this.templatePath('common/{**/.*,**/!(gitignore)}'),
        this.destinationPath(),
        this._getModel()
      );

      this.fs.copyTpl(
        this.templatePath('common/gitignore'),
        this.destinationPath('.gitignore'),
        this._getModel()
      );
    }
  },

  install: {
    installNpm: function installNpm() {
      if (this.options['skip-install-npm']) {
        return;
      }
      this.installDependencies({bower: false});
    }
  },

  _getModel: function getModel() {
    var model = {
      slugName: slugg(this.name),
      name: this.name
    };

    var conf = this.config.getAll();
    for (var k in conf) {
      model[k] = conf[k];
    }

    return model;
  }
});
