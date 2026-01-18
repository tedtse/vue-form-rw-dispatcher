import { ElSwitch, switchProps, type SwitchProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import SwitchReader from "./reader.vue";

export const ElSwitchDispatcher = defineRWDispatcher({
  name: "ElTimeSelectDispatcher",
  props: { ...switchProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<SwitchProps>(ElSwitch, props as SwitchProps, context),
  readerFn: (props, { attrs, slots }) => (
    <SwitchReader {...attrs} {...(props as SwitchProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
