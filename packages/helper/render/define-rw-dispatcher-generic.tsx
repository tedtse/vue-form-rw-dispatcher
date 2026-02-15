import {
  defineComponent,
  inject,
  computed,
  ref,
  type Ref,
  type ComputedRef,
  type SetupContext,
} from "vue";
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
    <P, E>(props: P & E, context: SetupContext) => {
      const nsStateKey: StateKey = `${Config.namespace}State`;
      const injectState:
        | ComputedRef<RWDispatcherState>
        | Ref<RWDispatcherState> = inject(nsStateKey, ref("write"));
      const state = computed(() => {
        return (
          Reflect.get(
            props as Record<string, unknown> & RWDispatcherProps,
            nsStateKey,
          ) || injectState?.value
        );
      });
      const otherProps = omitRWDispatcherState(
        props as Record<string, unknown> & RWDispatcherProps,
      );
      const { slots } = context;

      return () => {
        if (state.value !== "read" && state.value !== "write") {
          throw new Error(
            `[RWDispatcher] rwDispatcherState is defined incorrect, please provide rwDispatcherState via props or context injection.`,
          );
        }
        if (state.value === "read") {
          return slots[`${Config.namespace}Reader`]
            ? slots[`${Config.namespace}Reader`]?.()
            : readerFn(otherProps as Omit<P & E, StateKey>, context);
        }
        if (state.value === "write") {
          return slots[`${Config.namespace}Writer`]
            ? slots[`${Config.namespace}Writer`]?.()
            : writerFn(otherProps as Omit<P & E, StateKey>, context);
        }
      };
    },
    {
      name,
      ...options,
    },
  );
}
