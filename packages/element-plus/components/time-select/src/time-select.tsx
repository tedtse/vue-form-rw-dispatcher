import { ElTimeSelect, type TimeSelectProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import TimeSelectReader from "./reader.vue";

export const ElTimeSelectDispatcher = defineRWDispatcher<TimeSelectProps>({
  name: "ElTimeSelectDispatcher",
  writerFn: (props, context) =>
    extendComponent<TimeSelectProps>(
      ElTimeSelect,
      props as TimeSelectProps,
      context,
    ),
  readerFn: (props, { attrs, slots }) => (
    <TimeSelectReader
      {...attrs}
      {...(props as TimeSelectProps)}
      v-slots={slots}
    />
  ),
  options: {
    inheritAttrs: false,
  },
});
