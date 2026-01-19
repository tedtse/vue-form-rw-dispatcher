import {
  defineComponent,
  inject,
  computed,
  ref,
  type Ref,
  type ComputedRef,
  type SetupContext,
  type ExtractPropTypes,
  type ComponentObjectPropsOptions,
} from "vue";
import { omitRWDispatcherState } from "../utils";
import { Config } from "../config";
import type {
  StateKey,
  RWDispatcherState,
  DefineRWDispatcherArgs,
  RWDispatcherProps,
} from "../types";

export function defineRWDispatcher({
  writerFn,
  readerFn,
  name = "",
  props,
  options,
}: DefineRWDispatcherArgs) {
  let _props: ComponentObjectPropsOptions<
    Record<string, unknown> & RWDispatcherProps
  > = {};
  if (Array.isArray(props)) {
    props.forEach((name) => {
      _props[name] = { type: String, required: true };
    });
  } else {
    _props = props;
  }

  type Props = ExtractPropTypes<typeof props>;

  return /*#__PURE__*/ defineComponent({
    setup(props: Props, context: SetupContext) {
      const nsStateKey: StateKey = `${Config.namespace}State`;
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
          return slots[`${Config.namespace}Reader`]
            ? slots[`${Config.namespace}Reader`]?.()
            : readerFn(otherProps as Omit<Props, StateKey>, context);
        }
        if (state.value === "write") {
          return slots[`${Config.namespace}Writer`]
            ? slots[`${Config.namespace}Writer`]?.()
            : writerFn(otherProps as Omit<Props, StateKey>, context);
        }
      };
    },
    name,
    props,
    ...options,
  });
}
