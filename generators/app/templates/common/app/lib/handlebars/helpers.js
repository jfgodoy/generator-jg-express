
module.exports = {
  block: function block(name) {
    var blocks  = this._blocks,
        content = blocks && blocks[name];

    return content ? content.join('\n') : null;
  },

  contentFor: function contentFor(name, options) {
    var blocks = this._blocks || (this._blocks = {}),
        block  = blocks[name] || (blocks[name] = []);

    block.push(options.fn(this));
  }
};
