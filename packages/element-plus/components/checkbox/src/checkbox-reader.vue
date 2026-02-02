<template>
  <div :class="nsText.b('container')">
    <div :class="[nsText.b(), { [nsText.is('disabled')]: props.disabled }]">
      <template v-if="isTrue">
        <template v-if="checkboxSlot">
          <component :is="checkboxSlot" />
        </template>

        <span v-else>{{ label }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance } from "vue";
import { type CheckboxProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<CheckboxProps>();

const nsText = useNamespace("el-text");

const checkboxSlot = computed(() => {
  const instance = getCurrentInstance();
  return instance?.slots.default;
});

const isTrue = computed(() => {
  const { modelValue, trueValue } = props;
  if (typeof trueValue === "undefined") {
    return modelValue === trueValue;
  }
  return modelValue;
});

const values = computed(() => {
  const { modelValue } = props;
  return Array.isArray(modelValue) ? modelValue : [modelValue];
});

const label = computed(() => {
  const { modelValue, label } = props;
  if (isTrue.value) {
    return label;
  }
  return label || modelValue;
});
</script>
