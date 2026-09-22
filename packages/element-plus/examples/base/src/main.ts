import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import { DispatcherPlugin } from "element-plus-form-dispatcher";
import "element-plus-form-dispatcher/theme/index.css";
import "./style.css";
import App from "./App.vue";
import router from "./router";

createApp(App).use(ElementPlus).use(DispatcherPlugin).use(router).mount("#app");
