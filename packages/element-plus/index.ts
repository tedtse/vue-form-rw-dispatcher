import { type App } from "vue";
import * as components from "./components";
export * from "./components";

export const DispatcherPlugin = (app: App) => {
  for (const key in components) {
    const component = (components as any)[key];
    app.component(component.name, component);
  }
};
