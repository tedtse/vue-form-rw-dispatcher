import {
  defineComponent,
  inject,
  computed,
  ref,
  type Ref,
  type ComputedRef,
  type SetupContext,
  type ExtractPropTypes,
} from "vue";
import { omitRWDispatcherState } from "../utils";
import { Config } from "../config";
import type {
  StateKey,
  RWDispatcherState,
  DefineRWDispatcherArgs,
} from "../types";

// export function defineRWDispatcher<
//   Props extends Record<string, unknown> & RWDispatcherProps,
// >(args: DefineRWDispatcherArgs<Props>): DefineSetupFnComponent<Props>;

// eslint-disable-next-line
// export function defineRWDispatcher(args: any): DefineSetupFnComponent<any>;

export function defineRWDispatcher({
  writerFn,
  readerFn,
  name = "",
  props,
  options,
}: DefineRWDispatcherArgs) {
  type Props = ExtractPropTypes<typeof props>;

  return defineComponent({
    setup(props: Props, context: SetupContext) {
      const nsStateKey = `${Config.namespace}State` as StateKey;
      const injectState:
        | ComputedRef<RWDispatcherState>
        | Ref<RWDispatcherState> = inject(nsStateKey, ref("write"));
      const state = computed(() => {
        return Reflect.get(props, nsStateKey) || injectState?.value;
      });
      const otherProps = omitRWDispatcherState(props);
      const { slots } = context;

      return () => {
        if (state.value !== "read" && state.value !== "write") {
          throw new Error(
            `[RWDispatcher] rwDispatcherState is defined incorrect, please provide rwDispatcherState via props or context injection.`,
          );
        }
        if (state.value === "read") {
          return slots.reader
            ? slots.reader()
            : readerFn(otherProps as Omit<Props, StateKey>, context);
        }
        if (state.value === "write") {
          return slots.writer
            ? slots.writer()
            : writerFn(otherProps as Omit<Props, StateKey>, context);
        }
      };
    },
    name,
    props,
    ...options,
  });
}
