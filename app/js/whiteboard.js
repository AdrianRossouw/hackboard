var CanvasSurface = require('famous/surfaces/CanvasSurface');

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
    CanvasSurface.apply(this, arguments);
    this._superDeploy = CanvasSurface.prototype.deploy;
}

Whiteboard.prototype = Object.create(CanvasSurface.prototype);
Whiteboard.prototype.constructor = Whiteboard;

Whiteboard.prototype.deploy = function deploy(target) {
    this._superDeploy(target);
    this.eventHandler.trigger('post-render', this);
};

Whiteboard.prototype.draw = function(data) {
    var ctx = this.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(20,20);
    ctx.lineTo(20,100);
    ctx.lineTo(70,100);
    ctx.strokeStyle="red";
    ctx.stroke();
};


module.exports = Whiteboard;
