import { ElSwitch, type SwitchProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import SwitchReader from "./reader.vue";

export const ElSwitchDispatcher = defineRWDispatcher<SwitchProps>({
  name: "ElSwitchDispatcher",
  writerFn: (props, context) =>
    extendComponent<SwitchProps>(ElSwitch, props as SwitchProps, context),
  readerFn: (props, { attrs, slots }) => (
    <SwitchReader {...attrs} {...(props as SwitchProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
