import EventDispatcher from "./export";
import Event from "./event";

if (!window.Signal) {
  window.Signal = new EventDispatcher();
  window.SignalEvent = Event;
}
