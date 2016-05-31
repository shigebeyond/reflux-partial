export default {
  // 状态
  state: null,
  // 获得状态
  getState: function(){
    if(this.state === null)
      this.state = this.getInitialState();
    return this.state;
  },
  // 触发部分状态改变：支持与原来状态合并，只覆盖最新的部分
  triggerPart: function(partState){
    this.state = Object.assign({}, this.getState(), partState);
    this.trigger(this.state);
  }
};
