import { ElCheckboxGroup, type CheckboxGroupProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import CheckboxGroupReader from "./group-reader.vue";

export const ElCheckboxGroupDispatcher = defineRWDispatcher<CheckboxGroupProps>(
  {
    name: "ElCheckboxGroupDispatcher",
    writerFn: (props, context) =>
      extendComponent<CheckboxGroupProps>(
        ElCheckboxGroup,
        props as CheckboxGroupProps,
        context,
      ),
    readerFn: (props, { attrs, slots }) => (
      <CheckboxGroupReader
        {...attrs}
        {...(props as CheckboxGroupProps)}
        v-slots={slots}
      />
    ),
    options: {
      inheritAttrs: false,
    },
  },
);
