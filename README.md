# reflux-part

##What is it

Plugin for reflux-core to use part of state, extends at

1. Reflux.connect(store, propNames)

you can connect part of state from store to component.

2. Store.triggerPart(partState)

you can trigger part of state, not the full of state

3. Store.getState()

you can read the state in the store

##How to use it

1. `npm install reflux-part@latest --save`

2. To install partial state functionality do the following in your application's bootstrapper:

```javascript

import Reflux from "reflux";

// Extend connect
Reflux.connect = require('./connect');

// Extend store
Reflux.StoreMethods = Object.assign(Reflux.StoreMethods, require('./StoreMethods'));

```

3. Usesage

```
ReactMixin.onClass(Sidebar, Reflux.connect(MenuStore,['items', 'currentIndex']));
```
