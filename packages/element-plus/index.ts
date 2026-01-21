import { type App } from "vue";
import { DEFAULT_NAMESPACE } from "@vue-form-rw-dispatcher/helper";
import { setConfig } from './config'
import * as components from "./components";

export * from "./components";
export { Config } from './config'

export const DispatcherPlugin = (
  app: App,
  namespace: string = DEFAULT_NAMESPACE,
) => {
  setConfig({ namespace });
  for (const key in components) {
    const component = (components as any)[key];
    app.component(component.name, component);
  }
};
