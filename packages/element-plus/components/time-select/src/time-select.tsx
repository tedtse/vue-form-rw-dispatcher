import { ElTimeSelect, timeSelectProps, type TimeSelectProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import TimeSelectReader from "./reader.vue";

export const ElTimeSelectDispatcher = defineRWDispatcher<
  TimeSelectProps & RWDispatcherProps
>({
  name: "ElTimeSelectDispatcher",
  props: timeSelectProps,
  writerFn: (props, context) =>
    extendComponent<TimeSelectProps>(ElTimeSelect, props, context),
  readerFn: (props, { attrs, slots }) => (
    <TimeSelectReader {...attrs} {...props} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
