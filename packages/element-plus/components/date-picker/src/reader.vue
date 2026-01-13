<template>
  <div
    :class="[
      nsDatePicker.b(),
      {
        [nsDatePicker.is('disabled')]: props.disabled,
        [nsDatePicker.m('large')]: props.size === 'large',
        [nsDatePicker.m('small')]: props.size === 'small',
      },
    ]"
  >
    <span>{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  dayjs,
  DEFAULT_FORMATS_DATEPICKER,
  type DatePickerProps,
} from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<DatePickerProps>();
defineOptions({
  name: "DatePickerReader",
});

const nsDatePicker = useNamespace("date-picker");

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
</script>
