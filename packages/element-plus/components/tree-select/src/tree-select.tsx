import { ElTreeSelect } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "element-plus-form-dispatcher/helper";
import TreeSelectReader from "./reader.vue";
import type { TreeSelectProps } from "./types";

export const ElTreeSelectDispatcher = defineRWDispatcher<TreeSelectProps>({
  name: "ElTreeSelectDispatcher",
  writerFn: (props, context) =>
    extendComponent<TreeSelectProps>(
      ElTreeSelect,
      props as TreeSelectProps,
      context,
    ),
  readerFn: (props, { attrs, slots }) => (
    <TreeSelectReader
      {...attrs}
      {...(props as TreeSelectProps)}
      v-slots={slots}
    />
  ),
  options: {
    inheritAttrs: false,
  },
});
