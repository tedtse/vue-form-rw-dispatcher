import { App } from "Vue";
import DefaultTheme from "vitepress/theme";
import "element-plus/dist/index.css";
// if you just want to import css
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus-form-dispatcher/theme/dist/index.css";
import { DispatcherPlugin } from "element-plus-form-dispatcher";
import "./index.scss";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.use(ElementPlus);
    app.use(DispatcherPlugin);
  },
};
