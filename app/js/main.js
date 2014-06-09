var _ = require('underscore');
var Engine = require('famous/core/Engine');
var View = require('famous/core/View');
var Transform = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');
var EventHandler      = require('famous/core/EventHandler');
var Draggable = require('famous/modifiers/Draggable');

var PhysicsEngine   = require('famous/physics/PhysicsEngine');
var Body            = require('famous/physics/bodies/Body');
var Rectangle          = require('famous/physics/bodies/Rectangle');
var Wall            = require('famous/physics/constraints/Wall');

var Whiteboard = require('./whiteboard');

var mainContext = Engine.createContext();

var physicsEngine = new PhysicsEngine();
var eventHandler = new EventHandler();
eventHandler.on('post-render', _buildWalls);

var boardSize = [3840, 2160];

var board = new Whiteboard({
    size:  boardSize,
    classes: ['board'],
});

board.body = new Rectangle({
    size: boardSize
});

physicsEngine.addBody(board.body);


var draggable = new Draggable({});
draggable.subscribe(board);

board.pipe(eventHandler);
var modifier = new StateModifier({
    origin: [0.5, 0.5]
});

var node = mainContext.add(modifier);
node.add(draggable).add(board);

function _buildWalls(data) {
    var contextSize = mainContext.getSize();
    var surfaceSize = data.getSize();

    var walls = [];
    walls.push(_wall([1, 0, 0], contextSize[0], surfaceSize[0]));
    walls.push(_wall([-1, 0, 0], contextSize[0], surfaceSize[0]));
    walls.push(_wall([0, 1, 0], contextSize[1], surfaceSize[1]));
    walls.push(_wall([0,-1, 0], contextSize[1], surfaceSize[1]));

    //physicsEngine.detachWalls();
    physicsEngine.attach( walls[0],  [board.body]);
    physicsEngine.attach( walls[1], [board.body]);
    physicsEngine.attach( walls[2],  [board.body]);
    physicsEngine.attach( walls[3], [board.body]);

    
    function _wall(normal, ctxSize, bfrSize) {
        var opts = {
            normal : normal,
            distance : (ctxSize/2.0) + bfrSize,
            restitution : 0.5
        };
        return new Wall(opts);
    }
}
