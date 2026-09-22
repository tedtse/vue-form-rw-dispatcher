import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus-form-dispatcher/theme/index.css";

import { DispatcherPlugin } from "element-plus-form-dispatcher";
import "element-plus-form-dispatcher/theme/index.css";

createApp(App).use(DispatcherPlugin, { namespace: "ns" }).mount("#app");
