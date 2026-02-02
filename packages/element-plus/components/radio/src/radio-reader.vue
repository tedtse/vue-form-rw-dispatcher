<template>
  <div :class="nsText.b('container')">
    <div :class="[nsText.b(), { [nsText.is('disabled')]: props.disabled }]">
      <template v-if="radioSlot">
        <component :is="radioSlot" />
      </template>

      <span v-else>{{ label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance } from "vue";
import { type RadioProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<RadioProps>();

const nsText = useNamespace("el-text");

const radioSlot = computed(() => {
  const instance = getCurrentInstance();
  return instance?.slots.default;
});

const label = computed(() => {
  const { modelValue, label } = props;
  return label || modelValue;
});
</script>
