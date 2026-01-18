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
    <span v-if="props.prefixIcon" :class="nsText.e('prefix')">
      <props.prefixIcon />
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
import { dayjs, type DatePickerProps } from "element-plus";
import { DEFAULT_FORMATS_DATEPICKER } from "../../../constants";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<DatePickerProps>();
defineOptions({
  name: "DatePickerReader",
});

const nsText = useNamespace("el-text");
const nsRange = useNamespace("el-range");

const value = computed(() => {
  const { modelValue, format, type } = props;
  if (Array.isArray(modelValue)) {
    return modelValue
      .map((date) => {
        if (date) {
          return dayjs(date).format(format ?? DEFAULT_FORMATS_DATEPICKER[type]);
        }
        return date;
      })
      .join(", ");
  } else if (modelValue) {
    return dayjs(modelValue).format(format ?? DEFAULT_FORMATS_DATEPICKER[type]);
  }
  return modelValue;
});

const isRange = computed(() => {
  const { modelValue, type } = props;
  return (
    Array.isArray(modelValue) &&
    modelValue.filter(Boolean).length &&
    ["datetimerange", "daterange", "monthrange", "yearrange"].includes(type)
  );
});

const RangeRender = () => {
  if (!isRange.value) return null;
  const { modelValue, rangeSeparator, format, type } = props;
  const source = (modelValue as string[] | number[] | Date[]).filter(Boolean);
  const nodes = source
    .flatMap((date, i) => {
      const txt = dayjs(date).format(
        format ?? DEFAULT_FORMATS_DATEPICKER[type],
      );
      return [
        h("span", txt),
        i < source.length - 1
          ? h("span", { class: nsRange.b("separator") }, rangeSeparator)
          : null,
      ];
    })
    .filter(Boolean);
  return h(Fragment, null, nodes);
};
</script>
