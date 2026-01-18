import DefaultTheme from "vitepress/theme";
import "element-plus/dist/index.css";
// if you just want to import css
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@vue-form-rw-dispatcher/element-plus-theme/dist/index.css";
import { DispatcherPlugin } from "@vue-form-rw-dispatcher/element-plus";
import "./index.scss";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus);
    app.use(DispatcherPlugin);
  },
};
