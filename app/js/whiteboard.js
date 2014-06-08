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

    var ctx = this.getContext('2d');
    ctx.fillStyle = "solid";
    ctx.strokeStyle = "#bada55";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    // simplest way i could think of.
    // go look here first :
    // http://famo.us/docs/0.2.0/inputs/GenericSync/
    // http://famo.us/docs/0.2.0/inputs/MouseSync
    this.eventHandler.on('mousedown', drawEvent.bind(this, 'start'));
    this.eventHandler.on('mousemove', drawEvent.bind(this, 'move'));
    this.eventHandler.on('mouseup', drawEvent.bind(this, 'end'));

    function drawEvent(type, evt) {
        this.draw(evt.offsetX, evt.offsetY, type);
    }
}

Whiteboard.prototype = Object.create(CanvasSurface.prototype);
Whiteboard.prototype.constructor = Whiteboard;

Whiteboard.prototype.deploy = function deploy(target) {
    this._superDeploy(target);
    this.eventHandler.trigger('post-render', this);
};

Whiteboard.prototype.draw = function(x, y, type) {
    var ctx = this.getContext('2d');
    if (type === "start") {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (type === "move") {
        ctx.lineTo(x, y);
        ctx.stroke();
    } else {
        ctx.closePath();
    }
};

// READ THE EVENT TUTORIAL FOR A BETTER INSIGHT INTO THIS STUFF

module.exports = Whiteboard;
