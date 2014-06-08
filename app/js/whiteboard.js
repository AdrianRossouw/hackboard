var Surface = require('famous/core/Surface');

function Whiteboard(options) {
    Surface.apply(this, arguments);
    this._superDeploy = Surface.prototype.deploy;
}

Whiteboard.prototype = Object.create(Surface.prototype);
Whiteboard.prototype.constructor = Whiteboard;

Whiteboard.prototype.deploy = function deploy(target) {
    this._superDeploy(target);
    this.eventHandler.trigger('post-render', this);
};

module.exports = Whiteboard;
