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
    <span>{{ props.modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { type TimeSelectProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<TimeSelectProps>();
const nsText = useNamespace("el-text");
</script>
