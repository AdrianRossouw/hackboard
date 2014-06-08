var Engine = require('famous/core/Engine');
var View = require('famous/core/View');
var Transform = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');
var EventHandler      = require('famous/core/EventHandler');
var Whiteboard = require('./whiteboard');

var mainContext = Engine.createContext();

var eventHandler = new EventHandler();

eventHandler.on('post-render', _boardSize);

// this is to handle resize events, but it needs debounce
// Engine.on('resize', _boardSize);

var surface = new Whiteboard({
    size: [800, 600],
    classes: ['board'],
});

surface.pipe(eventHandler);

var modifier = new StateModifier({
    origin: [0.5, 0.5]
});

var node = mainContext.add(modifier).add(surface);

function _boardSize(board) {
    var contextSize = mainContext.getSize();
    //board.setSize(contextSize);
    console.log('board set to ', contextSize);
}
