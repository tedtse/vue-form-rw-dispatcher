import { defineComponent, computed, provide } from "vue";
import {
  Config,
  extendComponent,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import { ElForm, formProps, type FormProps } from "element-plus";

const nsStateKey = `${Config.namespace}State`;

const ElFormDispatcher = defineComponent(
  (props, context) => {
    const state = computed(() => {
      return (
        Reflect.get(
          props as FormProps & { [nsStateKey]: RWDispatcherProps },
          nsStateKey,
        ) || "write"
      );
    });
    provide(nsStateKey, state);

    return () =>
      extendComponent<FormProps>(ElForm, props as FormProps, context);
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
