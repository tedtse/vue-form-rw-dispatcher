<template>
  <div
    :class="[
      nsTimeSelect.b(),
      {
        [nsTimeSelect.is('disabled')]: props.disabled,
        [nsTimeSelect.m('large')]: props.size === 'large',
        [nsTimeSelect.m('small')]: props.size === 'small',
      },
    ]"
  >
    <span>{{ props.modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { type TimeSelectProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<TimeSelectProps>();
const nsTimeSelect = useNamespace("time-select");
</script>
