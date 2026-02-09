<template>
  <div :class="nsText.b('container')">
    <div :class="[nsText.b(), { [nsText.is('disabled')]: props.disabled }]">
      <template v-if="radioSlot">
        <component v-if="props.value === modelValue" :is="radioSlot" />
      </template>

      <span v-else>{{ props.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance } from "vue";
import { type RadioProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<RadioProps>();

const nsText = useNamespace("el-text");
const instance = getCurrentInstance();

const radioSlot = computed(() => {
  return instance?.slots.default;
});
</script>
