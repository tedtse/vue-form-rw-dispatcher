import {
  defineComponent,
  inject,
  computed,
  ref,
  type Ref,
  type ComputedRef,
  type SetupContext,
  type ComponentObjectPropsOptions,
} from "vue";
import { attachDispatcherRef, omitRWDispatcherState } from "../utils";
import { Config } from "../config";
import type {
  StateKey,
  RWDispatcherState,
  DefineRWDispatcherArgs,
  RWDispatcherProps,
} from "../types";

const nsStateKey = `${Config.namespace}State`;

export function defineRWDispatcherGeneric<
  P extends Record<string, unknown>,
  E = RWDispatcherProps,
>({ writerFn, readerFn, name = "", options }: DefineRWDispatcherArgs) {
  return /*#__PURE__*/ defineComponent<Partial<P> & E>(
    <P, E>(props: P & E, context: SetupContext) => {
      const { attrs, slots, expose } = context;
      // Resolve the state key at setup time (not module load) so a runtime
      // `setConfig({ namespace })` performed by `DispatcherPlugin` is honoured
      // by components that were already imported.
      const stateKey = `${Config.namespace}State`;
      const injectState:
        | ComputedRef<RWDispatcherState>
        | Ref<RWDispatcherState> = inject(stateKey, ref("write"));
      const state = computed(() => {
        return (
          (props as Record<string, unknown> & RWDispatcherProps)[stateKey] ||
          (attrs as Record<string, unknown> & RWDispatcherProps)[stateKey] ||
          injectState?.value
        );
      });

      const otherStates = omitRWDispatcherState(
        attrs as Record<string, unknown> & RWDispatcherProps,
      );
      // Hand the writer/reader fns attrs with the (namespaced) state key
      // stripped, so it never leaks onto the rendered DOM under a custom
      // namespace where it can't be a declared prop.
      const renderContext = {
        ...context,
        attrs: otherStates,
      } as unknown as SetupContext;
      const reader = ref<unknown>();
      const writer = ref<unknown>();

      expose({
        reader,
        writer,
      });

      return () => {
        if (state.value !== "read" && state.value !== "write") {
          throw new Error(
            `[RWDispatcher] rwDispatcherState is defined incorrect, please provide rwDispatcherState via props or context injection.`,
          );
        }
        if (state.value === "read") {
          return attachDispatcherRef(
            slots[`${Config.namespace}Reader`]
              ? slots[`${Config.namespace}Reader`]?.()
              : readerFn(otherStates as Omit<P & E, StateKey>, renderContext),
            reader,
          );
        }
        if (state.value === "write") {
          return attachDispatcherRef(
            slots[`${Config.namespace}Writer`]
              ? slots[`${Config.namespace}Writer`]?.()
              : writerFn(otherStates as Omit<P & E, StateKey>, renderContext),
            writer,
          );
        }
      };
    },
    {
      name,
      props: {
        [nsStateKey]: { type: String },
      } as unknown as ComponentObjectPropsOptions<Partial<P> & E>,
      ...options,
    },
  );
}
