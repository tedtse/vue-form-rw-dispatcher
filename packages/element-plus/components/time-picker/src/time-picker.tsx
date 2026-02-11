import {
  ElTimePicker,
  timePickerDefaultProps,
  type TimePickerDefaultProps,
} from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import TimePickerReader from "./reader.vue";

export const ElTimePickerDispatcher = defineRWDispatcher({
  name: "ElTimePickerDispatcher",
  props: { ...timePickerDefaultProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<TimePickerDefaultProps>(
      ElTimePicker,
      props as TimePickerDefaultProps,
      context,
    ),
  readerFn: (props, { attrs, slots }) => (
    <TimePickerReader
      {...attrs}
      {...(props as TimePickerDefaultProps)}
      v-slots={slots}
    />
  ),
  options: {
    inheritAttrs: false,
  },
});
