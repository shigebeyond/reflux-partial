'use strict';

var ListenerMethods = require('reflux-core/lib/ListenerMethods');

var _require = require('reflux');

var ListenerMixin = _require.ListenerMixin;
var _ = require('reflux-core/lib/utils');

// Retrieves multiple keys and values / subset from an object
function extract() {
    var keys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var obj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!(keys instanceof Array)) {
        keys = [keys];
    }
    var result = {};
    for (var i in keys) {
        result[keys[i]] = obj[keys[i]];
    }
    return result;
}

module.exports = function (listenable, keys) {

    _.throwIf(typeof keys === 'undefined', 'Reflux.connect() requires keys.');

    return {
        getInitialState: function getInitialState() {
            if (!_.isFunction(listenable.getInitialState)) {
                return {};
            }

            // get sub state
            var newState = extract(keys, listenable.getInitialState());
            // console.log(this.constructor.displayName + ':' + JSON.stringify(newState));
            return newState;
        },
        componentDidMount: function componentDidMount() {
            var me = this;

            _.extend(me, ListenerMethods);

            this.listenTo(listenable, function (v) {
                // set sub state
                var newState = extract(keys, v);
                // console.log(this.constructor.displayName + ': ' + JSON.stringify(newState));
                me.setState(newState);
            });
        },
        componentWillUnmount: ListenerMixin.componentWillUnmount
    };
};