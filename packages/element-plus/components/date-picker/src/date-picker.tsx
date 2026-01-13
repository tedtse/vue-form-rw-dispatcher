import {
  ElDatePicker,
  datePickerProps,
  type DatePickerProps,
} from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import DatePickerReader from "./reader.vue";

export const ElDatePickerDispatcher = defineRWDispatcher<
  DatePickerProps & RWDispatcherProps
>({
  name: "ElDatePickerDispatcher",
  props: datePickerProps,
  writerFn: (props, context) =>
    extendComponent<DatePickerProps>(ElDatePicker, props, context),
  readerFn: (props, { attrs, slots }) => (
    <DatePickerReader {...attrs} {...props} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
