import { cloneVNode, isVNode, type Ref, type VNodeChild } from "vue";
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

export const attachDispatcherRef = (
  node: VNodeChild | undefined,
  target: Ref<unknown>,
) => {
  if (Array.isArray(node)) {
    return node.map((child, index) =>
      index === 0 && isVNode(child)
        ? cloneVNode(child, { ref: target }, true)
        : child,
    );
  }

  return isVNode(node) ? cloneVNode(node, { ref: target }, true) : node;
};
