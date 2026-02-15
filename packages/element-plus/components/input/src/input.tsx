import { ElInput, type InputProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import InputReader from "./reader.vue";

export const ElInputDispatcher = defineRWDispatcher<InputProps>({
  name: "ElInputDispatcher",
  writerFn: (props, context) =>
    extendComponent<InputProps>(ElInput, props as InputProps, context),
  readerFn: (props, { attrs, slots }) => (
    <InputReader {...attrs} {...(props as InputProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
