import { ElCheckbox, type CheckboxProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import CheckboxReader from "./checkbox-reader.vue";

export const ElCheckboxDispatcher = defineRWDispatcher<CheckboxProps>({
  name: "ElCheckboxDispatcher",
  writerFn: (props, context) =>
    extendComponent<CheckboxProps>(ElCheckbox, props as CheckboxProps, context),
  readerFn: (props, { attrs, slots }) => (
    <CheckboxReader {...attrs} {...(props as CheckboxProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
