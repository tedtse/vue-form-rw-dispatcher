import { ElInput, inputProps, type InputProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import InputReader from "./reader.vue";

export const ElInputDispatcher = defineRWDispatcher<
  InputProps & RWDispatcherProps
>({
  name: "ElInputDispatcher",
  props: inputProps,
  writerFn: (props, context) =>
    extendComponent<InputProps>(ElInput, props, context),
  readerFn: (props, { attrs, slots }) => (
    <InputReader {...attrs} {...props} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
