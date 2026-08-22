<template>
  <div
    :class="[
      nsText.b(),
      nsSwitch.b(),
      {
        [nsText.is('disabled')]: disabled,
        [nsText.m('large')]: size === 'large',
        [nsText.m('small')]: size === 'small',
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
import {
  useSize,
  useNamespace,
  useDisabled,
  useDispatcherConfig,
} from "../../../composables";
import { DispatcherTypeTag } from "../../../constants";
import type { SwitchConfigType } from "../../../type.d";

const props = defineProps<SwitchProps>();
defineOptions({ name: "SwitchReader" });

const nsText = useNamespace("el-text");
const nsSwitch = useNamespace("el-switch");
const size = useSize();
const disabled = useDisabled();
const switchConfig = useDispatcherConfig<SwitchConfigType>(
  DispatcherTypeTag.Switch,
);

const isActive = computed(() => {
  const { modelValue, activeValue } = props;
  return typeof modelValue === "boolean"
    ? modelValue
    : modelValue === activeValue;
});

const label = computed(() => {
  const { modelValue, activeValue, inactiveValue } = props;
  const { activeText, inactiveText } = switchConfig.value;
  if ([undefined, null, ""].includes(modelValue as string | undefined | null))
    return "";
  if (isActive.value)
    return (
      props.activeText ||
      (activeValue !== true && activeValue) ||
      String(activeText)
    );
  return (
    props.inactiveText ||
    (inactiveValue !== false && inactiveValue) ||
    String(inactiveText)
  );
});
</script>
