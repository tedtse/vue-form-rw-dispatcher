import {
  defineComponent,
  computed,
  provide,
  type ComponentObjectPropsOptions,
} from "vue";
import { type RWDispatcherState } from "@vue-form-rw-dispatcher/helper";
import { Config } from "@vue-form-rw-dispatcher/element-plus/config";
import { type EPRWDispatcherProps } from "@vue-form-rw-dispatcher/element-plus/type";
import {
  SIZE_CONTEXT_PROVIDER,
  SIZE,
  PROPS_SIZE,
  PROPS_DISABLED,
  DISABLED_CONTEXT_PROVIDER,
  TypeProvideMap,
  DispatcherTypeTag,
} from "@vue-form-rw-dispatcher/element-plus/constants";

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
