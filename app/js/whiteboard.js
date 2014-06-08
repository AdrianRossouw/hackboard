var Surface = require('famous/core/Surface');

// We are creating a subclass to handle all our
// features.
//
// This is very much the recommended pattern of building
// views, components and layouts in famo.us, so it's
// something you will see often.
//
// We are doing this, partially, to work around this bug:
// http://stackoverflow.com/questions/23319496/how-can-we-get-the-size-of-a-surface-within-famo-us/23319702#23319702

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
