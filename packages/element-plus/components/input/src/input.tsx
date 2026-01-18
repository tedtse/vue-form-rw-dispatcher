import { ElInput, inputProps, type InputProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import InputReader from "./reader.vue";

export const ElInputDispatcher = defineRWDispatcher({
  name: "ElInputDispatcher",
  props: { ...inputProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<InputProps>(ElInput, props as InputProps, context),
  readerFn: (props, { attrs, slots }) => (
    <InputReader {...attrs} {...(props as InputProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
