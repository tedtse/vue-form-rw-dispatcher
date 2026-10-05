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
import {
  attachDispatcherRef,
  omitRWDispatcherState,
  hyphenate,
} from "../utils";
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
        return (
          Reflect.get(props, nsStateKey) ||
          Reflect.get(context.attrs, nsStateKey) ||
          // Template bindings like `:ns-state` are kept in attrs under the
          // original kebab key, so also probe the hyphenated spelling.
          Reflect.get(context.attrs, hyphenate(nsStateKey)) ||
          injectState?.value
        );
      });
      const otherProps = omitRWDispatcherState(
        props as Record<string, unknown> & RWDispatcherProps,
      );
      // Hand the writer/reader fns attrs with the (namespaced) state key
      // stripped, so it never leaks onto the rendered DOM under a custom
      // namespace where it can't be a declared prop.
      const renderContext = {
        ...context,
        attrs: omitRWDispatcherState(
          context.attrs as Record<string, unknown> & RWDispatcherProps,
        ),
      } as unknown as SetupContext;
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
        const readerSlotKey = `${Config.namespace}Reader`;
        const writerSlotKey = `${Config.namespace}Writer`;
        if (state.value === "read") {
          // Vue 3 keeps template slot names as-is (e.g. `#ns-reader`),
          // so also probe the hyphenated spelling.
          const readerSlot =
            slots[readerSlotKey] || slots[hyphenate(readerSlotKey)];
          return attachDispatcherRef(
            readerSlot
              ? readerSlot()
              : readerFn(otherProps as Omit<Props, StateKey>, renderContext),
            reader,
          );
        }
        if (state.value === "write") {
          const writerSlot =
            slots[writerSlotKey] || slots[hyphenate(writerSlotKey)];
          return attachDispatcherRef(
            writerSlot
              ? writerSlot()
              : writerFn(otherProps as Omit<Props, StateKey>, renderContext),
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
