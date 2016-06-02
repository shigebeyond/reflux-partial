# reflux-partial

##What is it

Plugin for reflux-core to use part of state, extends at

#### 1. Reflux.connectPart(store, propNames)

You can connect part of state from store to component. Because the componet only care about part of state, just like you only care about one of many girls in your class.

你可以将store中的部分state连接到组件中，因为组件很可能只关心部分state，就好像你只关注你们班里的某个女孩。

#### 2. Store.triggerPart(partState)

You can update part of state, not full of state. This method will help you merge new part and old part in state, and update full of state automatically. For example, you have a state about user(include username, password, birthday, address), but you only change password, so just trigger password.

你可以更新部分state，而不是全部state。该方法可以帮你合并state中的新旧部分，从而自动更新全部state，保证旧部分的state不丢失。例如，你有一个关于用户的state(包含用户名、密码、生日、地址)，但是你只修改了密码，因此只需要触发密码的更新。

#### 3. Store.getState()

You can read the state by this.getState() in the store, just like this.state in the component.

你可以在store中用 this.getState() 来获得state，就好像你在组件中用 this.state 来获得state。

##How to use it

#### 1. Install

`npm install reflux-partial@latest --save`

#### 2. Extend Reflux

To install partial state functionality do the following in your application's bootstrapper or in a file:

```javascript
import Reflux from "reflux";
import RefluxPartial from "reflux-partial";

// Extend connect
Reflux.connectPart = RefluxPartial.connect;

// Extend store
Reflux.StoreMethods = Object.assign(Reflux.StoreMethods, RefluxPartial.StoreMethods);

export default Reflux;
```

#### 3. Store

Define a store, and use triggerPart() to update part of state, use getState() to get full of state.

```
import Reflux from '../reflux'; // The Reflux extends by Step 2
import { notification } from 'antd';

var MenuActions = require('../actions/menu');
import api from '../api';

var MenuStore = Reflux.createStore({
  // this will set up listeners to all publishers in UserActions, using onKeyname (or keyname) as callbacks
  listenables: [MenuActions],
  getInitialState: function() {
    return {
      currentIndex: 0, // 当前点击的菜单key
      items: [], // 两级的菜单，以children来关联
      navpath: [] // 打开的菜单路径
    };
  },
  // 获得菜单
  onGetAllMenu: function(){
    api.post('/menu')
      .then((data) => {
        this.triggerPart({items: data.menus}); // update part of state
    }).catch((e) => {
      notification.error({
          message: 'Get all menu fail',
          description: e
      });
    });
  },
  // 更新菜单路径
  onUpdateNavPath: function(navpath, key){
    const {items} = this.getState(); // get state in store
    this.triggerPart({
        currentIndex: key,
        navpath
    });
  },
});

module.exports = MenuStore;
```

#### 4. Component

Define a component, and connect store's state with this componet.

```
import React from 'react';
import ReactMixin from 'react-mixin';
import Reflux from '../../reflux'; // The Reflux extends by Step 2
import MenuActions from '../../actions/menu';
import MenuStore from '../../store/menu';

class Sidebar extends React.Component {

  componentDidMount () {
    MenuActions.getAllMenu();
  }

  render () {
    const { items, currentIndex } = this.state;
    return (
      <ol>
        {items.map((item, i) => {
          return <li>{item.name}</li>
        })}
      </ol>
    )
  }
}

// connect MenuStore's partial state('items' and 'currentIndex' property) with component Sidebar, so you can use this.state.items / this.state.currentIndex in component
// 将MenuStore中state的 'items' 与 'currentIndex' 属性，绑定到Sidebar组件中, 这样你就可以在组件中使用部分状态 this.state.items / this.state.currentIndex
ReactMixin.onClass(Sidebar, Reflux.connectPart(MenuStore,['items', 'currentIndex']));

export default Sidebar;
```
