import { ElInputNumber, inputNumberProps, type InputNumberProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import InputReader from "./reader.vue";

export const ElInputNumberDispatcher = defineRWDispatcher<
  InputNumberProps & RWDispatcherProps
>({
  name: "ElInputNumberDispatcher",
  props: inputNumberProps,
  writerFn: (props, context) =>
    extendComponent<InputNumberProps>(ElInputNumber, props, context),
  readerFn: (props, { attrs, slots }) => (
    <InputReader {...attrs} {...props} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
