import { ElSwitch, switchProps, type SwitchProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import SwitchReader from "./reader.vue";

export const ElSwitchDispatcher = defineRWDispatcher<
  SwitchProps & RWDispatcherProps
>({
  name: "ElTimeSelectDispatcher",
  props: switchProps,
  writerFn: (props, context) =>
    extendComponent<SwitchProps>(ElSwitch, props, context),
  readerFn: (props, { attrs, slots }) => (
    <SwitchReader {...attrs} {...props} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
