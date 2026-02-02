import { ElRadio, radioProps, type RadioProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
  rwDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import RadioReader from "./radio-reader.vue";

export const ElRadioDispatcher = defineRWDispatcher({
  name: "ElRadioDispatcher",
  props: { ...radioProps, ...rwDispatcherProps },
  writerFn: (props, context) =>
    extendComponent<RadioProps>(ElRadio, props as RadioProps, context),
  readerFn: (props, { attrs, slots }) => (
    <RadioReader {...attrs} {...(props as RadioProps)} v-slots={slots} />
  ),
  options: {
    inheritAttrs: false,
  },
});
