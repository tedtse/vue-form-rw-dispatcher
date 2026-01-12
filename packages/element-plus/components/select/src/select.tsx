import { ElSelect, selectProps, type SelectProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import SelectReader from "./reader.vue";

export const ElSelectDispatcher = defineRWDispatcher<
  SelectProps & RWDispatcherProps
>({
  name: "ElSelectDispatcher",
  props: selectProps,
  writerFn: (props, context) =>
    extendComponent<SelectProps>(ElSelect, props, context),
  readerFn: (props, { attrs, slots }) => (
    <SelectReader {...attrs} {...props} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
