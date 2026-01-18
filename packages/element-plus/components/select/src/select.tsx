import { ElSelect, selectProps, type SelectProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import SelectReader from "./reader.vue";

export const ElSelectDispatcher = defineRWDispatcher({
  name: "ElSelectDispatcher",
  props: { ...selectProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<SelectProps>(ElSelect, props as SelectProps, context),
  readerFn: (props, { attrs, slots }) => (
    <SelectReader {...attrs} {...(props as SelectProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
