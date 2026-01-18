import {
  ElInputNumber,
  inputNumberProps,
  type InputNumberProps,
} from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import InputNumberReader from "./reader.vue";

export const ElInputNumberDispatcher = defineRWDispatcher({
  name: "ElInputNumberDispatcher",
  props: { ...inputNumberProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<InputNumberProps>(
      ElInputNumber,
      props as InputNumberProps,
      context,
    ),
  readerFn: (props, { attrs, slots }) => (
    <InputNumberReader
      {...attrs}
      {...(props as InputNumberProps)}
      v-slots={slots}
    />
  ),
  options: {
    inheritAttrs: false,
  },
});
