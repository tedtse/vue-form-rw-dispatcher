<template>
  <div
    :class="[
      nsText.b(),
      nsSwitch.b(),
      {
        [nsText.is('disabled')]: props.disabled,
        [nsText.m('large')]: props.size === 'large',
        [nsText.m('small')]: props.size === 'small',
      },
    ]"
  >
    <span v-if="props.modelValue && props.activeIcon" :class="nsText.e('prefix')">
      <el-icon>
        <component :is="props.activeIcon" />
      </el-icon>
    </span>

    <span v-else-if="!props.modelValue && props.inactiveIcon" :class="nsText.e('prefix')">
      <el-icon>
        <component :is="props.inactiveIcon" />
      </el-icon>
    </span>

    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ElIcon, type SwitchProps } from "element-plus";
import { computed } from "vue";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<SwitchProps>();
defineOptions({ name: "SwitchReader" });

const nsText = useNamespace("el-text");
const nsSwitch = useNamespace("el-switch");

const label = computed(() => {
  const { modelValue, activeText, inactiveText } = props as any;
  if (modelValue === undefined || modelValue === null) return '';
  if (modelValue) return activeText ?? String(modelValue);
  return inactiveText ?? String(modelValue);
});
</script>
