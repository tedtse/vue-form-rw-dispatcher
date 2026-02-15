import { ElSelect, type SelectProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import SelectReader from "./reader.vue";

export const ElSelectDispatcher = defineRWDispatcher<SelectProps>({
  name: "ElSelectDispatcher",
  writerFn: (props, context) =>
    extendComponent<SelectProps>(ElSelect, props as SelectProps, context),
  readerFn: (props, { attrs, slots }) => (
    <SelectReader {...attrs} {...(props as SelectProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
