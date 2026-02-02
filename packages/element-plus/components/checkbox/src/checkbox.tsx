import { ElCheckbox, checkboxProps, type CheckboxProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import CheckboxReader from "./checkbox-reader.vue";

export const ElCheckboxDispatcher = defineRWDispatcher({
  name: "ElCheckboxDispatcher",
  props: { ...checkboxProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<CheckboxProps>(ElCheckbox, props as CheckboxProps, context),
  readerFn: (props, { attrs, slots }) => (
    <CheckboxReader {...attrs} {...(props as CheckboxProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
