import { h } from "vue";
import Theme from "vitepress/theme";
import SpecialLayout from "./SpecialLayout.vue";
import FloatingVue from "floating-vue";

import "./styles/vars.css";
import "floating-vue/dist/style.css";

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      "home-hero-after": () => h(SpecialLayout),
    });
  },
  async enhanceApp(params) {
    const { app } = params;
    await Theme.enhanceApp(params);
    app.use(FloatingVue);
  },
};
