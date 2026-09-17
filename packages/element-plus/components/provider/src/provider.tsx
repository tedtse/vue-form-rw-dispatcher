import {
  defineComponent,
  computed,
  provide,
  reactive,
  type ComponentObjectPropsOptions,
} from "vue";
import { formContextKey, type FormContext } from "element-plus";
import { type RWDispatcherState } from "element-plus-form-dispatcher/helper";
import { Config } from "element-plus-form-dispatcher/config";
import { type EPRWDispatcherProps } from "element-plus-form-dispatcher/type";
import {
  SIZE_CONTEXT_PROVIDER,
  SIZE,
  PROPS_SIZE,
  PROPS_DISABLED,
  DISABLED_CONTEXT_PROVIDER,
  TypeProvideMap,
  DispatcherTypeTag,
} from "element-plus-form-dispatcher/constants";

const nsStateKey = `${Config.namespace}State`;

const ElDispatcherProvider = defineComponent(
  (props, { attrs, slots }) => {
    const state = computed(() => {
      return (
        (Reflect.get(props, nsStateKey) as unknown as RWDispatcherState) ||
        "write"
      );
    });
    provide(nsStateKey, state);
    const size = computed(() => {
      return Reflect.get(props, PROPS_SIZE) || SIZE.DEFAULT;
    });
    provide(SIZE_CONTEXT_PROVIDER, size);
    const disabled = computed(() => {
      return Reflect.get(props, PROPS_DISABLED) || false;
    });
    provide(DISABLED_CONTEXT_PROVIDER, disabled);
    provide(
      TypeProvideMap[DispatcherTypeTag.Switch].provider,
      computed(() => ({
        activeText: props.activeText,
        inactiveText: props.inactiveText,
      })),
    );
    // Provide a form context so native element-plus controls (ElFormItem, inputs,
    // selects, ...) placed under the provider still inherit `size` / `disabled`.
    // This provider is NOT a real <ElForm>, but ElFormItem unconditionally calls
    // `formContext.removeField(ctx)` in `onBeforeUnmount` (and `addField` when a
    // `prop` is set, plus `emit`/validation hooks). Without those methods the
    // injected context crashes on route change, which then leaves the subtree
    // half-unmounted and surfaces as `Cannot read properties of null
    // (reading 'type')` during the parent patch. Supply safe no-op methods.
    provide(
      formContextKey,
      reactive({
        size,
        disabled,
        emit: () => {},
        getField: () => undefined,
        addField: () => {},
        removeField: () => {},
        resetFields: () => {},
        clearValidate: () => {},
        validateField: () => Promise.resolve(true),
      }) as unknown as FormContext,
    );

    return () => {
      if (state.value !== "read" && state.value !== "write") {
        throw new Error(
          `[RWDispatcher] rwDispatcherState is defined incorrect, please provide rwDispatcherState via props or context injection.`,
        );
      }
      return <div {...attrs}>{slots.default?.()}</div>;
    };
  },
  {
    name: "ElDispatcherProvider",
    inheritAttrs: false,
    props: {
      [PROPS_SIZE]: { type: String },
      [PROPS_DISABLED]: { type: Boolean },
      [nsStateKey]: {
        type: String,
        default: "write",
        required: false,
        validator: (value: string) => ["read", "write"].includes(value),
      },
      activeText: { type: String, required: false, default: Config.activeText },
      inactiveText: {
        type: String,
        required: false,
        default: Config.inactiveText,
      },
    } as unknown as ComponentObjectPropsOptions<EPRWDispatcherProps>,
  },
);

export default ElDispatcherProvider;
