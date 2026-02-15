import { ElDatePicker, type DatePickerProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import DatePickerReader from "./reader.vue";

export const ElDatePickerDispatcher = defineRWDispatcher<DatePickerProps>({
  name: "ElDatePickerDispatcher",
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
