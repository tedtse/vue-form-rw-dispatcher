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
import { attachDispatcherRef, omitRWDispatcherState } from "../utils";
import { Config } from "../config";
import type {
  StateKey,
  RWDispatcherState,
  DefineRWDispatcherArgs,
  RWDispatcherProps,
} from "../types";

export function defineRWDispatcherPropType({
  writerFn,
  readerFn,
  name = "",
  props,
  options,
}: Omit<DefineRWDispatcherArgs, "props"> & {
  props: any;
}) {
  let _props: ComponentObjectPropsOptions<
    Record<string, unknown> & RWDispatcherProps
  > = {};
  if (Array.isArray(props)) {
    props.forEach((name) => {
      _props[
        name as keyof ComponentObjectPropsOptions<
          Record<string, unknown> & RWDispatcherProps
        >
      ] = { type: String, required: true };
    });
  } else {
    _props = props!;
  }

  type Props = ExtractPropTypes<typeof _props>;

  return /*#__PURE__*/ defineComponent({
    setup(props: Props, context: SetupContext) {
      const nsStateKey: StateKey = `${Config.namespace}State`;
      const injectState:
        | ComputedRef<RWDispatcherState>
        | Ref<RWDispatcherState> = inject(nsStateKey, ref("write"));
      const state = computed(() => {
        return Reflect.get(props, nsStateKey) || injectState?.value;
      });
      const otherProps = omitRWDispatcherState(
        props as Record<string, unknown> & RWDispatcherProps,
      );
      const { slots, expose } = context;
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
              : readerFn(otherProps as Omit<Props, StateKey>, context),
            reader,
          );
        }
        if (state.value === "write") {
          return attachDispatcherRef(
            slots[`${Config.namespace}Writer`]
              ? slots[`${Config.namespace}Writer`]?.()
              : writerFn(otherProps as Omit<Props, StateKey>, context),
            writer,
          );
        }
      };
    },
    name,
    props,
    ...options,
  });
}
