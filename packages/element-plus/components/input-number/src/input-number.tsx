import { ElInputNumber, type InputNumberProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import InputNumberReader from "./reader.vue";

export const ElInputNumberDispatcher = defineRWDispatcher<InputNumberProps>({
  name: "ElInputNumberDispatcher",
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
