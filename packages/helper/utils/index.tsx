import { cloneVNode, isVNode, type Ref, type VNodeChild } from "vue";
import { Config } from "../config";
import type { RWDispatcherProps } from "../types";

// Convert a camelCase key to its kebab-case form (mirrors @vue/shared's
// `hyphenate`). Vue keeps template bindings such as `:ns-state` in `attrs`
// under the original kebab key, while the code resolves a camelCase
// `stateKey`, so both spellings must be considered.
export const hyphenate = (str: string): string =>
  str.replace(/\B([A-Z])/g, "-$1").toLowerCase();

export const omitRWDispatcherState = <
  Props extends Record<string, unknown> & RWDispatcherProps,
>(
  props: Props,
) => {
  const state = `${Config.namespace}State`;
  // The template binding may land in attrs under the kebab-case spelling
  // (`ns-state`), so strip both forms to avoid leaking onto the DOM.
  const stateKebab = hyphenate(state);
  const isStateKey = (prop: string | symbol): boolean =>
    prop === state || prop === stateKebab;
  return new Proxy(props, {
    get(target, prop, receiver) {
      if (isStateKey(prop)) {
        return undefined;
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (isStateKey(prop)) {
        return false;
      }
      return Reflect.has(target, prop);
    },
    deleteProperty(target, prop) {
      if (isStateKey(prop)) {
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
