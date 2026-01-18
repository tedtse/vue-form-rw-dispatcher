import {
  ElTimeSelect,
  timeSelectProps,
  type TimeSelectProps,
} from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import TimeSelectReader from "./reader.vue";

export const ElTimeSelectDispatcher = defineRWDispatcher({
  name: "ElTimeSelectDispatcher",
  props: { ...timeSelectProps, ...rwDispatcherProps },
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
