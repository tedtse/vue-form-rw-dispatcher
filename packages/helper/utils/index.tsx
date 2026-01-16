import type { Component, SetupContext } from "vue";
import type { RWDispatcherProps } from "../types";

export const omitRWDispatcherState = <
  Props extends Record<string, unknown> & RWDispatcherProps
>(
  props: Props
) => {
  const rwDispatcherState = "rwDispatcherState"
  return new Proxy(props, {
    get(target, prop, receiver) {
      if (prop === rwDispatcherState) {
        return undefined;
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (prop === rwDispatcherState) {
        return false;
      }
      return Reflect.has(target, prop);
    },
    deleteProperty(target, prop) {
      if (prop === rwDispatcherState) {
        return true;
      }
      return Reflect.deleteProperty(target, prop);
    },
  });
};

export const extendComponent = <Props extends Record<string, unknown>>(
  widget: Component,
  props: Props,
  { attrs, slots }: SetupContext
) => {
  return <widget {...attrs} {...props} v-slots={slots} />;
};
