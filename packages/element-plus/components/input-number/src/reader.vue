<template>
  <div
    :class="[
      nsText.b(),
      {
        [nsText.is('disabled')]: props.disabled,
        [nsText.m('large')]: props.size === 'large',
        [nsText.m('small')]: props.size === 'small',
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
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<InputNumberProps>();
defineOptions({
  name: "InputReader",
});

const nsText = useNamespace("el-text");

const value = computed(() => {
  const { modelValue, precision } = props;
  if (precision) {
    return parseFloat(modelValue).toFixed(precision);
  }
  return modelValue;
});
</script>
