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
          {{ opt[labelKey] }}
        </el-tag>
      </div>
      <span v-else>{{ label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { ElTag } from "element-plus";
import type { SelectV2Props } from "element-plus/es/components/select-v2/src/defaults";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<Partial<SelectV2Props>>();

const nsText = useNamespace("el-text");
const nsSelect = useNamespace("el-select");
const nsTag = useNamespace("el-tag");

const valueKey = computed(
  () => props.props?.value || props.valueKey || "value",
);
const labelKey = computed(() => props.props?.label || "label");

const label = computed(() => {
  const { modelValue, options, allowCreate } = props;
  if (allowCreate) {
    return (
      options?.find((opt) => opt[valueKey.value] === modelValue)?.[
        labelKey.value
      ] || modelValue
    );
  }
  const option = options?.find((opt) => opt[valueKey.value] === modelValue);
  return option?.[labelKey.value];
});

const selectedOptions = computed(() => {
  const { modelValue, options, allowCreate } = props;
  if (allowCreate) {
    const result: Record<string, unknown>[] = [];
    modelValue.forEach((val: string) => {
      const option = options?.find((opt) => opt[valueKey.value] === val);
      if (option) {
        result.push(option);
      } else {
        result.push({ [valueKey.value]: val, [labelKey.value]: val });
      }
    });
    return result;
  }
  return options?.filter((opt) => modelValue.includes(opt[valueKey.value]));
});
</script>
