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

function App(options) {
    View.apply(this, arguments);
}

App.prototype = Object.create(View.prototype);
App.prototype.constructor = App;

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

eventHandler.on('post-render', _buildWalls);
var boardSize = [3840, 2160];


var surface = new Whiteboard({
    size: [3840, 2160],
    classes: ['board'],
});

surface.pipe(eventHandler);
var modifier = new StateModifier({
    origin: [0.5, 0.5]
});

var draggable = new Draggable({});
draggable.subscribe(surface);

var node = mainContext.add(modifier);
node.add(draggable).add(surface);

function _buildWalls(data) {
    var contextSize = mainContext.getSize();
    var surfaceSize = data.getSize();

    var walls = [];
    walls.push(_wall([1, 0, 0], contextSize[0], surfaceSize[0]));
    walls.push(_wall([-1, 0, 0], contextSize[0], surfaceSize[0]));
    walls.push(_wall([0, 1, 0], contextSize[1], surfaceSize[1]));
    walls.push(_wall([0,-1, 0], contextSize[1], surfaceSize[1]));

    function _wall(normal, ctxSize, bfrSize) {
        var opts = {
            normal : [-1,0,0],
            distance : (ctxSize/2.0) + bfrSize,
            restitution : 0.5
        };
        console.log(opts);
        return new Wall(opts);
    }
}

