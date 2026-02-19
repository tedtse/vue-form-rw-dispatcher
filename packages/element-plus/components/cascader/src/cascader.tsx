import type { ExtractPropTypes } from "vue";
import { ElCascader, cascaderProps } from "element-plus";
import {
  defineRWDispatcherPropType,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import CascaderReader from "./reader.vue";

type CascaderProps = ExtractPropTypes<typeof cascaderProps>;

export const ElCascaderDispatcher = defineRWDispatcherPropType({
  name: "ElCascaderDispatcher",
  props: { ...cascaderProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<CascaderProps>(ElCascader, props as CascaderProps, context),
  readerFn: (props, { attrs, slots }) => (
    <CascaderReader {...attrs} {...(props as CascaderProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
