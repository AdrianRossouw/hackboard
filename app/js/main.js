var _ = require('underscore');
var Engine = require('famous/core/Engine');
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');

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

var boardSize = [384, 216];
var boardBorder = [boardSize[0] + 300, boardSize[1] + 300];

var area = new Surface({
    size: boardBorder,
    properties: {
        backgroundColor: 'red'
    }
});


var board = new Whiteboard({
    size:  boardSize,
    classes: ['board'],
});

board.body = new Rectangle({
    size: boardSize
});

physicsEngine.addBody(board.body);

board.state = new StateModifier({origin:[0.5,0.5]});

board.on("click",function(){
    console.log(arguments);
   board.body.setVelocity([1,1,0]);
});

var draggable = new Draggable({});
draggable.subscribe(board);

draggable.on('update', function(e) {
    console.log(e);
});
board.pipe(eventHandler);
var modifier = new StateModifier({
    origin: [0.5, 0.5]
});

var node = mainContext.add(modifier);
node.add(area);
node.add(board.state).add(draggable).add(board);

function _buildWalls(data) {
    var contextSize = mainContext.getSize();
    var surfaceSize = data.getSize();

    surfaceSize = boardBorder;
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
