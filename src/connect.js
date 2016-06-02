var ListenerMethods = require('reflux-core/lib/ListenerMethods'),
    {ListenerMixin} = require('reflux'),
    _ = require('reflux-core/lib/utils');

// Retrieves multiple keys and values / subset from an object
function extract(keys = [], obj = {}){
  if(!(keys instanceof Array)){
    keys = [keys];
  }
  let result = {};
  for(let i in keys){
    result[keys[i]] = obj[keys[i]];
  }
  return result;
}

module.exports = function(listenable, keys) {

    _.throwIf(typeof(keys) === 'undefined', 'Reflux.connect() requires keys.');

    return {
        getInitialState: function() {
            if (!_.isFunction(listenable.getInitialState)) {
                return {};
            }

            // get sub state
            let newState = extract(keys, listenable.getInitialState());
            // console.log(this.constructor.displayName + ':' + JSON.stringify(newState));
            return newState;
        },
        componentDidMount: function() {
            var me = this;

            _.extend(me, ListenerMethods);

            this.listenTo(listenable, function(v) {
                // set sub state
                let newState = extract(keys, v);
                // console.log(this.constructor.displayName + ': ' + JSON.stringify(newState));
                me.setState(newState);
            });
        },
        componentWillUnmount: ListenerMixin.componentWillUnmount
    };
};
