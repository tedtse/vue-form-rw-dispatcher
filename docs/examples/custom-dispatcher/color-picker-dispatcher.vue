<template>
  <ColorPickerDispatcher v-model="color" />
</template>

<script setup lang="tsx">
import { ref } from "vue";
import { ElColorPicker, type ColorPickerProps } from "element-plus";
import {
  defineRWDispatcher,
  extendComponent,
} from "@vue-form-rw-dispatcher/helper";

const ColorPickerDispatcher = defineRWDispatcher<ColorPickerProps>({
  name: "ColorPickerDispatcher",
  writerFn: (props, context) =>
    extendComponent<ColorPickerProps>(
      ElColorPicker,
      props as ColorPickerProps,
      context,
    ),
  readerFn: (props) => {
    const { modelValue } = props as ColorPickerProps;
    return (
      <span
        style={`display: inline-block; width: 20px; height: 20px; backgroundColor: ${modelValue}`}
      ></span>
    );
  },
});

const color = ref("#ff0000");
</script>
