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
    <span
      v-if="props.modelValue && props.activeIcon"
      :class="nsText.e('prefix')"
    >
      <el-icon style="color: var(--el-switch-on-color)">
        <component :is="props.activeIcon" />
      </el-icon>
    </span>

    <span
      v-if="props.modelValue && props.activeActionIcon"
      :class="nsText.e('prefix')"
    >
      <el-icon style="color: var(--el-switch-on-color)">
        <component :is="props.activeActionIcon" />
      </el-icon>
    </span>

    <span
      v-if="!props.modelValue && props.inactiveIcon"
      :class="nsText.e('prefix')"
    >
      <el-icon style="color: var(--el-switch-off-color)">
        <component :is="props.inactiveIcon" />
      </el-icon>
    </span>

    <span
      v-if="!props.modelValue && props.inactiveActionIcon"
      :class="nsText.e('prefix')"
    >
      <el-icon style="color: var(--el-switch-off-color)">
        <component :is="props.inactiveActionIcon" />
      </el-icon>
    </span>

    <span
      v-if="
        (props.modelValue && !props.activeIcon && !props.activeActionIcon) ||
        (!props.modelValue && !props.inactiveIcon && !props.inactiveActionIcon)
      "
      >{{ label }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { ElIcon, type SwitchProps } from "element-plus";
import { computed } from "vue";
import { Config } from "../../../config";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<SwitchProps>();
defineOptions({ name: "SwitchReader" });

const nsText = useNamespace("el-text");
const nsSwitch = useNamespace("el-switch");

const isActive = computed(() => {
  const { modelValue, activeValue } = props;
  return typeof modelValue === "boolean"
    ? modelValue
    : modelValue === activeValue;
});

const label = computed(() => {
  const { modelValue, activeText, inactiveText, activeValue, inactiveValue } =
    props;
  if ([undefined, null, ""].includes(modelValue as string | undefined | null))
    return "";
  if (isActive.value)
    return (
      activeText ||
      (activeValue !== true && activeValue) ||
      String(Config.activeText)
    );
  return (
    inactiveText ||
    (inactiveValue !== false && inactiveValue) ||
    String(Config.inactiveText)
  );
});
</script>
