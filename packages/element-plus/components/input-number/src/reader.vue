<template>
  <div
    :class="[
      nsInputNumber.b(),
      {
        [nsInputNumber.is('disabled')]: props.disabled,
        [nsInputNumber.m('large')]: props.size === 'large',
        [nsInputNumber.m('small')]: props.size === 'small',
      },
    ]"
  >
    <span v-if="$slots.prefix" :class="nsInputNumber.e('prefix')">
      <slot name="prefix"></slot>
    </span>

    <span>{{ value }}</span>

    <span v-if="$slots.suffix" :class="nsInputNumber.e('suffix')">
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

const nsInputNumber = useNamespace("input-number");

const value = computed(() => {
  const { modelValue, precision } = props;
  if (precision) {
    return parseFloat(modelValue).toFixed(precision);
  }
  return modelValue;
});
</script>
