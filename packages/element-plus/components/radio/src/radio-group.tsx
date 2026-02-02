import {
  ElRadioGroup,
  radioGroupProps,
  type RadioGroupProps,
} from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import RadioGroupReader from "./group-reader.vue";

export const ElRadioGroupDispatcher = defineRWDispatcher({
  name: "ElRadioGroupDispatcher",
  props: { ...radioGroupProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<RadioGroupProps>(
      ElRadioGroup,
      props as RadioGroupProps,
      context,
    ),
  readerFn: (props, { attrs, slots }) => (
    <RadioGroupReader
      {...attrs}
      {...(props as RadioGroupProps)}
      v-slots={slots}
    />
  ),
  options: {
    inheritAttrs: false,
  },
});
