import {
  ElDatePicker,
  datePickerProps,
  type DatePickerProps,
} from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import DatePickerReader from "./reader.vue";

export const ElDatePickerDispatcher = defineRWDispatcher({
  name: "ElDatePickerDispatcher",
  props: { ...datePickerProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<DatePickerProps>(
      ElDatePicker,
      props as DatePickerProps,
      context,
    ),
  readerFn: (props, { attrs, slots }) => (
    <DatePickerReader
      {...attrs}
      {...(props as DatePickerProps)}
      v-slots={slots}
    />
  ),
  options: {
    inheritAttrs: false,
  },
});
