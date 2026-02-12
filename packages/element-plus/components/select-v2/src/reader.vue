<template>
  <div :class="nsText.b('container')">
    <div
      :class="[
        nsSelect.b(),
        nsText.b(),
        {
          [nsText.is('disabled')]: props.disabled,
          [nsText.m('large')]: props.size === 'large',
          [nsText.m('small')]: props.size === 'small',
        },
      ]"
    >
      <div v-if="$slots.tag" :class="nsSelect.b('selection')">
        <slot name="tag"></slot>
      </div>
      <div
        v-else-if="$slots.label"
        :class="{ [nsSelect.b('selection')]: props.multiple }"
      >
        <template v-if="props.multiple">
          <el-tag
            v-for="(opt, index) in selectedOptions"
            :class="nsTag.b('bg-color')"
            :key="index"
          >
            <slot name="label" v-bind="{ ...opt }"></slot>
          </el-tag>
        </template>
        <template v-else-if="selectedOptions?.[0]">
          <slot name="label" v-bind="{ ...selectedOptions?.[0] }"></slot>
        </template>
      </div>
      <div v-else-if="props.multiple" :class="nsSelect.b('selection')">
        <el-tag
          v-for="(opt, index) in selectedOptions"
          :class="nsTag.b('bg-color')"
          :key="index"
        >
          {{ opt.label }}
        </el-tag>
      </div>
      <span v-else>{{ value }}</span>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { ElTag, type SelectProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

type OptionType = {
  label: string;
  value: string | number;
  disabled?: boolean;
} & Record<string, unknown>;

const props = defineProps<SelectProps>();

const nsText = useNamespace("el-text");
const nsSelect = useNamespace("el-select");
const nsTag = useNamespace("el-tag");

const value = computed(() => {
  const { modelValue, valueKey } = props;
  let option;
  if (Object.prototype.toString.call(modelValue) === "[object Object]") {
    option = props.options?.find(
      (opt) =>
        opt[valueKey as string] ===
        (modelValue as Record<string, unknown>)[valueKey as string],
    );
    return (modelValue as OptionType).label;
  }
  option = props.options?.find((opt) => opt[valueKey] === modelValue);
  return option?.label || modelValue;
});

const selectedOptions = computed(() => {
  const { modelValue, valueKey } = props;
  if (Array.isArray(modelValue)) {
    return props.options?.filter((opt) =>
      modelValue.includes(opt[valueKey] as string | number),
    );
  } else {
    return props.options?.filter((opt) => opt[valueKey] === modelValue);
  }
});

</script>
