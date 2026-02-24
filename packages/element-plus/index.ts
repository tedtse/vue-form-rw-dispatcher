import { type App, type Component } from "vue";
import { setConfig, DEFAULT_NAMESPACE } from "./config";
import * as components from "./components";

export * from "./components";
export { Config } from "./config";

type DispatcherPluginOptions =
  | string
  | { namespace?: string; pick?: string[]; omit?: string[] };

export const DispatcherPlugin = (
  app: App,
  options?: DispatcherPluginOptions,
) => {
  let _options: DispatcherPluginOptions = {};
  if (typeof options === "string") {
    _options = { namespace: options };
  }
  const {
    namespace = DEFAULT_NAMESPACE,
    pick = [],
    omit = [],
  } = _options || {};
  setConfig({ namespace });
  for (const key in components) {
    if (pick.length > 0 && !pick.includes(key)) {
      continue;
    }
    if (omit.length > 0 && omit.includes(key)) {
      continue;
    }
    const component = (components as Record<string, Component>)[key];
    app.component(component!.name as string, component!);
  }
};
