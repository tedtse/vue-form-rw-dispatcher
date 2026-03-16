import { Config } from "../config";
import type { RWDispatcherProps } from "../types";

export const omitRWDispatcherState = <
  Props extends Record<string, unknown> & RWDispatcherProps,
>(
  props: Props,
) => {
  const state = `${Config.namespace}State`;
  return new Proxy(props, {
    get(target, prop, receiver) {
      if (prop === state) {
        return undefined;
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (prop === state) {
        return false;
      }
      return Reflect.has(target, prop);
    },
    deleteProperty(target, prop) {
      if (prop === state) {
        return true;
      }
      return Reflect.deleteProperty(target, prop);
    },
  });
};
