export default class EventDispatcher {
  constructor() {
    this._EVENTS_ = {};
  }
  emit(type, data = null) {
    const self = this;
    const old = window.onload;
    window.onload = function () {
      old && old();
      var timer = setTimeout(() => {
        if (!self._EVENTS_ || !self._EVENTS_[type]) {
          timer = null;
          return;
        }
        var listeners = self._EVENTS_[type];
        for (var i = 0, n = listeners.length; i < n; i++) {
          var instance = listeners[i];
          var handler = instance.handler;
          var caller = instance.caller;
          var args = instance.args;
          args
            ? handler.apply(caller, [args, data])
            : handler.apply(caller, [data]);
        }
        timer = null;
      });
    };
  }
  on(type, caller, handler, args = null) {
    var listeners = this._EVENTS_[type];
    if (listeners === undefined) {
      listeners = [];
      this._EVENTS_[type] = listeners;
    }
    var instance = {
      handler: handler,
      caller: caller,
      args: args,
    };
    listeners.push(instance);
    return instance;
  }
  off(type, caller, handler) {
    var listeners = this._EVENTS_[type];
    if (listeners !== undefined) {
      for (var i = 0, n = listeners.length; i < n; i++) {
        var instance = listeners[i];
        if (instance.handler === handler && instance.caller === caller) {
          listeners.splice(i, 1);
          return;
        }
      }
    }
  }
  offAll(type) {
    if (!this._EVENTS_ || !this._EVENTS_[type]) return;
    delete this._EVENTS_[type];
  }
}
