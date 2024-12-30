import { createApp, defineComponent } from "vue";
import Main from "./main";
export default class {
  constructor(props = {}) {
    this.el = createApp(defineComponent(Main), props);
  }

  mount(el) {
    if (el) {
      return this.el.mount(el);
    } else {
      el = document.createElement("div");
      document.body.appendChild(el);
      return this.el.mount(el);
    }
  }
}
