import { ElSelectV2, type SelectV2Props } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";
import SelectReader from "./reader.vue";

export const ElSelectV2Dispatcher = defineRWDispatcher<SelectV2Props>({
  name: "ElSelectV2Dispatcher",
  writerFn: (props, context) =>
    extendComponent<SelectV2Props>(ElSelectV2, props as SelectV2Props, context),
  readerFn: (props, { attrs, slots }) => (
    <SelectReader {...attrs} {...(props as SelectV2Props)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
