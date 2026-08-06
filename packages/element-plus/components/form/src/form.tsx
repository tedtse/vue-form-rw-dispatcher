import { defineComponent, computed, provide, ref } from "vue";
import {
  Config,
  extendComponent,
  attachDispatcherRef,
  type RWDispatcherProps,
  type RWDispatcherState,
} from "@vue-form-rw-dispatcher/helper";
import {
  SIZE_CONTEXT_PROVIDER,
  SIZE,
} from "@vue-form-rw-dispatcher/element-plus/constants";
import { ElForm, formProps, type FormProps } from "element-plus";

const nsStateKey = `${Config.namespace}State`;

const ElFormDispatcher = defineComponent(
  (props, context) => {
    const state = computed(() => {
      return (
        (Reflect.get(
          props as FormProps & { [nsStateKey]: RWDispatcherProps },
          nsStateKey,
        ) as unknown as RWDispatcherState) || "write"
      );
    });
    provide(nsStateKey, state);
    const size = computed(() => {
      return Reflect.get(props as FormProps, "size") || SIZE.DEFAULT;
    });
    provide(SIZE_CONTEXT_PROVIDER, size);

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
    },
    inheritAttrs: false,
  },
);

export default ElFormDispatcher;
