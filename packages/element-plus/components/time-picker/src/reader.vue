<template>
  <div
    :class="[
      nsText.b(),
      {
        [nsText.is('disabled')]: props.disabled,
        [nsText.m('large')]: size === 'large',
        [nsText.m('small')]: size === 'small',
      },
    ]"
  >
    <span v-if="prefixIcon" :class="nsText.e('prefix')">
      <el-icon>
        <component :is="prefixIcon" />
      </el-icon>
    </span>

    <template v-if="isRange">
      <range-render />
    </template>
    <template v-else>
      <span>{{ value }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, h, Fragment } from "vue";
import { dayjs, ElIcon, type TimePickerDefaultProps } from "element-plus";
import { Clock } from "@element-plus/icons-vue";
import { DEFAULT_FORMATS_TIME } from "../../../constants";
import { useNamespace, useSize } from "../../../composables";

const props = defineProps<TimePickerDefaultProps>();
defineOptions({
  name: "TimePickerReader",
});

const nsText = useNamespace("el-text");
const size = useSize();

const value = computed(() => {
  const { modelValue, format } = props as any;
  if (Array.isArray(modelValue)) {
    return modelValue
      .map((v: any) =>
        v ? dayjs(v).format(format ?? DEFAULT_FORMATS_TIME) : v,
      )
      .join(", ");
  }
  if (modelValue) {
    return dayjs(modelValue).format(format ?? DEFAULT_FORMATS_TIME);
  }
  return modelValue;
});

const prefixIcon = computed(() => {
  if ((props as any).prefixIcon) return (props as any).prefixIcon;
  return Clock;
});

const isRange = computed(() => {
  const { modelValue, isRange } = props as any;
  return (
    Array.isArray(modelValue) && modelValue.filter(Boolean).length && !!isRange
  );
});

const RangeRender = () => {
  if (!isRange.value) return null;
  const { modelValue, rangeSeparator, format } = props as any;
  const source = (modelValue as any[]).filter(Boolean);
  const nodes = source
    .flatMap((date: any, i: number) => {
      const txt = dayjs(date).format(format ?? DEFAULT_FORMATS_TIME);
      return [
        h("span", txt),
        i < source.length - 1
          ? h("span", { class: nsText.b("separator") }, rangeSeparator)
          : null,
      ];
    })
    .filter(Boolean);
  return h(Fragment, null, nodes);
};
</script>
