<template>
  <div :class="nsText.b('container')">
    <div
      :class="[
        nsSelect.b(),
        nsText.b(),
        {
          [nsText.is('disabled')]: disabled,
          [nsText.m('large')]: size === 'large',
          [nsText.m('small')]: size === 'small',
        },
      ]"
    >
      <div v-if="$slots.tag" :class="nsSelect.b('selection')">
        <slot name="tag" :data="selectedNodes"></slot>
      </div>
      <div v-else-if="props.multiple" :class="nsSelect.b('selection')">
        <el-tag
          v-for="(label, index) in displayLabels"
          :class="nsTag.b('bg-color')"
          :key="index"
        >
          {{ label }}
        </el-tag>
      </div>
      <span v-else>{{ displayText }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, type Ref } from "vue";
import { ElTag, type TreeNodeData } from "element-plus";
import { useNamespace, useSize, useDisabled } from "../../../composables";
import type { TreeSelectProps } from "./types";

const props = defineProps<TreeSelectProps>();
defineOptions({
  name: "TreeSelectReader",
});

const nsText = useNamespace("el-text");
const nsSelect = useNamespace("el-select");
const nsTag = useNamespace("el-tag");
const size = useSize();
const disabled = useDisabled();

const valueKey = computed(() => props.nodeKey ?? props.valueKey ?? "value");
const labelKey = computed(
  () =>
    (props.props && typeof props.props === "object" && "label" in props.props
      ? (props.props as { label?: string }).label
      : "label") as string,
);
const childrenKey = computed(
  () =>
    (props.props && typeof props.props === "object" && "children" in props.props
      ? (props.props as { children?: string }).children
      : "children") as string,
);

function findNodeByValue(
  data: TreeNodeData[] | undefined,
  value: string | number,
  valueK: string,
  labelK: string,
  childrenK: string,
): { label: string; node: TreeNodeData } | null {
  if (!data || !Array.isArray(data)) return null;
  for (const node of data) {
    const nodeValue = (node as Record<string, unknown>)[valueK];
    if (nodeValue === value) {
      const label = (node as Record<string, unknown>)[labelK];
      return {
        label: typeof label === "string" ? label : String(label ?? value),
        node,
      };
    }
    const children = (node as Record<string, unknown>)[childrenK];
    if (Array.isArray(children)) {
      const found = findNodeByValue(
        children as TreeNodeData[],
        value,
        valueK,
        labelK,
        childrenK,
      );
      if (found) return found;
    }
  }
  return null;
}

const selectedNodes: Ref<{ label: string; value: string | number }[]> = ref([]);

const displayLabels = computed(() => {
  const { modelValue, data } = props;
  const vk = valueKey.value;
  const lk = labelKey.value;
  const ck = childrenKey.value;

  if (Array.isArray(modelValue)) {
    const labels: string[] = [];
    const nodes: { label: string; value: string | number }[] = [];
    for (const v of modelValue) {
      const found = findNodeByValue(data, v, vk, lk, ck);
      if (found) {
        labels.push(found.label);
        nodes.push({ label: found.label, value: v as string | number });
      }
    }
    selectedNodes.value = nodes;
    return labels;
  }
  if (modelValue !== undefined && modelValue !== null && modelValue !== "") {
    const found = findNodeByValue(
      data,
      modelValue as string | number,
      vk,
      lk,
      ck,
    );
    if (found) {
      selectedNodes.value = [
        { label: found.label, value: modelValue as string | number },
      ];
      return [found.label];
    }
  }
  selectedNodes.value = [];
  return [];
});

const displayText = computed(() => {
  const labels = displayLabels.value;
  return labels.length > 0 ? labels[0] : "";
});
</script>
