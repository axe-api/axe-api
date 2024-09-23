import { h } from "vue";
import Theme from "vitepress/theme";
import CustomIndex from "./CustomIndex.vue";
import FloatingVue from "floating-vue";

import "./styles/vars.css";
import "floating-vue/dist/style.css";

export default {
  extends: Theme,
  Layout: CustomIndex,
  async enhanceApp(params) {
    const { app } = params;
    await Theme.enhanceApp(params);
    app.use(FloatingVue);
  },
};
