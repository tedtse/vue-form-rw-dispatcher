<template>
  <SliderDispatcher v-model="value" />
</template>

<script setup lang="tsx">
import { ref, defineComponent } from "vue";
import { ElSlider, sliderProps, type SliderProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";

const SliderReader = defineComponent<SliderProps>({
  name: "SliderReader",
  props: sliderProps,
  render: (props: SliderProps) => <span>slider: {props.modelValue}</span>,
});

const SliderDispatcher = defineRWDispatcher<SliderProps>({
  name: "SliderDispatcher",
  writerFn: (props, context) =>
    extendComponent<SliderProps>(ElSlider, props as SliderProps, context),
  readerFn: (props, context) =>
    extendComponent<SliderProps>(SliderReader, props as SliderProps, context),
});

const value = ref(0);
</script>
