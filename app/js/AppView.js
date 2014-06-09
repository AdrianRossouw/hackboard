var View = require('famous/core/View');

function AppView(options) {
    View.apply(this, arguments);
}

AppView.prototype = Object.create(View.prototype);
AppView.prototype.constructor = AppView;

module.exports = AppView;
