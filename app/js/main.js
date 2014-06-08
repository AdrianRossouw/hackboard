var Engine = require('famous/core/Engine');
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');
var Draggable = require('famous/modifiers/Draggable');
var EventHandler      = require('famous/core/EventHandler');

var PhysicsEngine   = require('famous/physics/PhysicsEngine');
var Body            = require('famous/physics/bodies/Body');
var Rectangle          = require('famous/physics/bodies/Rectangle');
var Wall            = require('famous/physics/constraints/Wall');

var mainContext = Engine.createContext();

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

var eventHandler = new EventHandler();

eventHandler.on('post-render', _boardSize);

// this is to handle resize events, but it needs debounce
// Engine.on('resize', _boardSize);


var surface = new Whiteboard({
    size: [100, 100],
    classes: ['board'],
});

surface.pipe(eventHandler);

var modifier = new StateModifier({
    origin: [0.5, 0.5]
});

var node = mainContext.add(modifier).add(surface);

function _boardSize(data) {
    var contextSize = mainContext.getSize();
    surface.setSize(contextSize);
    console.log('board set to ', contextSize);
}
