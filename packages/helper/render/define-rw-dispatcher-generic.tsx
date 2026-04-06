import {
  defineComponent,
  inject,
  computed,
  ref,
  type Ref,
  type ComputedRef,
  type SetupContext,
} from "vue";
import { camelCase, kebabCase, pascalCase } from "change-case";
import { omitRWDispatcherState } from "../utils";
import { Config } from "../config";
import type {
  StateKey,
  RWDispatcherState,
  DefineRWDispatcherArgs,
  RWDispatcherProps,
} from "../types";

export function defineRWDispatcherGeneric<P, E = RWDispatcherState>({
  writerFn,
  readerFn,
  name = "",
  options,
}: DefineRWDispatcherArgs) {
  return /*#__PURE__*/ defineComponent(
    <P, E>(_: P & E, context: SetupContext) => {
      const { attrs, slots } = context;
      const nsStateKey: StateKey = `${Config.namespace}State`;
      const injectState:
        | ComputedRef<RWDispatcherState>
        | Ref<RWDispatcherState> = inject(nsStateKey, ref("write"));
      const state = computed(() => {
        return (
          Reflect.get(
            attrs as Record<string, unknown>,
            camelCase(nsStateKey) as string,
          ) ||
          Reflect.get(
            attrs as Record<string, unknown>,
            kebabCase(nsStateKey as string),
          ) ||
          Reflect.get(
            attrs as Record<string, unknown>,
            pascalCase(nsStateKey as string),
          ) ||
          injectState?.value
        );
      });
      const otherStates = omitRWDispatcherState(
        attrs as Record<string, unknown> & RWDispatcherProps,
      );

      return () => {
        if (state.value !== "read" && state.value !== "write") {
          throw new Error(
            `[RWDispatcher] rwDispatcherState is defined incorrect, please provide rwDispatcherState via props or context injection.`,
          );
        }
        if (state.value === "read") {
          return slots[`${Config.namespace}Reader`]
            ? slots[`${Config.namespace}Reader`]?.()
            : readerFn(otherStates as Omit<P & E, StateKey>, context);
        }
        if (state.value === "write") {
          return slots[`${Config.namespace}Writer`]
            ? slots[`${Config.namespace}Writer`]?.()
            : writerFn(otherStates as Omit<P & E, StateKey>, context);
        }
      };
    },
    {
      name,
      ...options,
    },
  );
}
