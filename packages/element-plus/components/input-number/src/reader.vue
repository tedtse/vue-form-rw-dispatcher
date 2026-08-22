<template>
  <div
    :class="[
      nsText.b(),
      {
        [nsText.is('disabled')]: disabled,
        [nsText.m('large')]: size === 'large',
        [nsText.m('small')]: size === 'small',
      },
    ]"
  >
    <span v-if="$slots.prefix" :class="nsText.e('prefix')">
      <slot name="prefix"></slot>
    </span>

    <span>{{ value }}</span>

    <span v-if="$slots.suffix" :class="nsText.e('suffix')">
      <slot name="suffix"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type InputNumberProps } from "element-plus";
import { useSize, useNamespace, useDisabled } from "../../../composables";

const props = defineProps<InputNumberProps>();
defineOptions({
  name: "InputReader",
});

const nsText = useNamespace("el-text");
const size = useSize();
const disabled = useDisabled();

const value = computed(() => {
  const { modelValue, precision } = props;
  if (precision) {
    return parseFloat(modelValue).toFixed(precision);
  }
  return modelValue;
});
</script>
