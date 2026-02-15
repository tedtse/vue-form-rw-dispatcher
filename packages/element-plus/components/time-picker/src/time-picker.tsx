import { ElTimePicker, type TimePickerDefaultProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import TimePickerReader from "./reader.vue";

export const ElTimePickerDispatcher =
  defineRWDispatcher<TimePickerDefaultProps>({
    name: "ElTimePickerDispatcher",
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
