import {
  defineComponent,
  inject,
  computed,
  ref,
  type Ref,
  type ComputedRef,
  type SetupContext,
  type DefineSetupFnComponent,
  type PropType,
} from "vue";
import { omitRWDispatcherState } from "../utils";
import type {
  RWDispatcherState,
  RWDispatcherProps,
  DefineRWDispatcherArgs,
} from "../types";

export function defineRWDispatcherStrict<
  Props extends Record<string, unknown> & RWDispatcherProps
>(args: DefineRWDispatcherArgs<Props>): DefineSetupFnComponent<Props>;

// eslint-disable-next-line
export function defineRWDispatcherStrict(
  args: any
): DefineSetupFnComponent<any>;

export function defineRWDispatcherStrict<
  Props extends Record<string, unknown> & RWDispatcherProps
>({
  writerFn,
  readerFn,
  name = "",
  props,
  options,
}: DefineRWDispatcherArgs<Props>) {
  return defineComponent<Props>({
    name,
    props: {
      rwDispatcherState: {
        type: String as PropType<RWDispatcherState>,
      },
      ...props,
    },
    setup(props: Record<string, unknown>, context: SetupContext) {
      const injectRWDispatcherState:
        | ComputedRef<RWDispatcherState>
        | Ref<RWDispatcherState> = inject("rwDispatcherState", ref("write"));
      const rwDispatcherState = computed(
        () => props.rwDispatcherState || injectRWDispatcherState?.value
      );
      const otherProps = omitRWDispatcherState(props);
      const { slots } = context;

      return () => {
        if (
          rwDispatcherState.value !== "read" &&
          rwDispatcherState.value !== "write"
        ) {
          throw new Error(
            `[RWDispatcher] rwDispatcherState is defined incorrect, please provide rwDispatcherState via props or context injection.`
          );
        }
        if (rwDispatcherState.value === "read") {
          return slots.reader
            ? slots.reader()
            : readerFn(otherProps as Omit<Props, "rwDispatcherState">, context);
        }
        if (rwDispatcherState.value === "write") {
          return slots.writer
            ? slots.writer()
            : writerFn(otherProps as Omit<Props, "rwDispatcherState">, context);
        }
      };
    },
    ...options,
  });
}
