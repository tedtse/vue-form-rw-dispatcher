import {
  defineComponent,
  computed,
  provide,
  ref,
  type ComponentObjectPropsOptions,
} from "vue";
import { ElForm, formProps, type FormProps } from "element-plus";
import {
  extendComponent,
  attachDispatcherRef,
  type RWDispatcherProps,
  type RWDispatcherState,
} from "@vue-form-rw-dispatcher/helper";
import {
  SIZE_CONTEXT_PROVIDER,
  SIZE,
  PROPS_SIZE,
  PROPS_DISABLED,
  DISABLED_CONTEXT_PROVIDER,
  TypeProvideMap,
  DispatcherTypeTag,
} from "@vue-form-rw-dispatcher/element-plus/constants";
import { type EPRWDispatcherProps } from "@vue-form-rw-dispatcher/element-plus/type";
import { Config } from "@vue-form-rw-dispatcher/element-plus/config";

const nsStateKey = `${Config.namespace}State`;

const ElFormDispatcher = defineComponent(
  (props, context) => {
    const state = computed(() => {
      return (
        (Reflect.get(
          props as FormProps & {
            [nsStateKey]: RWDispatcherProps;
            activeText: string;
            inactiveText: string;
          },
          nsStateKey,
        ) as unknown as RWDispatcherState) || "write"
      );
    });
    provide(nsStateKey, state);
    const size = computed(() => {
      return Reflect.get(props as FormProps, PROPS_SIZE) || SIZE.DEFAULT;
    });
    provide(SIZE_CONTEXT_PROVIDER, size);
    const disabled = computed(() => {
      return Reflect.get(props as FormProps, PROPS_DISABLED) || false;
    });
    provide(DISABLED_CONTEXT_PROVIDER, disabled);
    provide(
      TypeProvideMap[DispatcherTypeTag.Switch].provider,
      computed(() => ({
        activeText: props.activeText,
        inactiveText: props.inactiveText,
      })),
    );

    const reader = ref<unknown>();
    const writer = ref<unknown>();

    context.expose({
      reader,
      writer,
    });

    return () => {
      if (state.value !== "read" && state.value !== "write") {
        throw new Error(
          `[RWDispatcher] rwDispatcherState is defined incorrect, please provide rwDispatcherState via props or context injection.`,
        );
      }
      return attachDispatcherRef(
        extendComponent<FormProps>(ElForm, props as FormProps, context),
        state.value === "write" ? writer : reader,
      );
    };
  },
  {
    name: "ElFormDispatcher",
    props: {
      ...formProps,
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
    inheritAttrs: false,
  },
);

export default ElFormDispatcher;
