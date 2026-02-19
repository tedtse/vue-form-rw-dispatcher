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
      <div v-if="$slots.tag" :class="nsSelect.b('tags')">
        <slot name="tag" :data="tags"></slot>
      </div>
      <template v-else>
        <div v-if="props.props.multiple" :class="nsSelect.b('selection')">
          <el-tag v-for="(item, index) in getDisplayValue" :key="index">{{
            item
          }}</el-tag>
        </div>
        <span v-else>{{ getDisplayValue }}</span>
      </template>
    </div>

    <shadow-cascader
      ref="shadowCascaderRef"
      v-bind="{ ...props, ...$attrs }"
      style="display: none"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope || {}"></slot>
      </template>
    </shadow-cascader>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComputedRef } from "vue";
import {
  ElTag,
  ElCascader,
  cascaderProps,
  type CascaderOption,
  type CascaderNode,
  type Tag,
} from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps(cascaderProps);
defineOptions({
  name: "CascaderReader",
  components: { ShadowCascader: ElCascader },
});

const { modelValue } = props;
const nsText = useNamespace("el-text");
const nsSelect = useNamespace("el-select");
const shadowCascaderRef = ref<InstanceType<typeof ElCascader>>();
const tags = ref<Tag[]>([]);

const getDisplayValue = computed(() => {
  const { showAllLevels = true, showCheckedStrategy, options, props: properties } = props;

  const findLabelByValue = (val: unknown, opts: CascaderOption[] = options) => {
    if (!Array.isArray(val)) return val;

    const labels: string[] = [];
    let currentOptions = opts;

    for (const v of val) {
      const found = currentOptions.find((opt) => opt.value === v);
      if (found) {
        labels.push(found.label as string);
        currentOptions = found.children || [];
      }
    }

    if (showCheckedStrategy === "parent") {
      return labels[0];
    }
    return showAllLevels ? labels.join(" / ") : labels[labels.length - 1];
  };

  if (Array.isArray(modelValue)) {
    if (modelValue.length === 0) return "";
    if (properties.multiple) {
      // 多选模式
      return modelValue.map((item) => findLabelByValue(item));
    } else {
      // 单选模式
      return findLabelByValue(modelValue);
    }
  }
  return modelValue;
});

const checkedNodes: ComputedRef<CascaderNode[]> = computed(
  () => shadowCascaderRef.value?.cascaderPanelRef?.checkedNodes || [],
);

const genTag = (node: CascaderNode): Tag => {
  const { showAllLevels, separator } = props;
  return {
    node,
    key: node.uid,
    text: node.calcText(showAllLevels, separator),
    hitState: false,
    closable: false,
  };
};

const getStrategyCheckedNodes = (): CascaderNode[] => {
  switch (props.showCheckedStrategy) {
    case "child":
      return checkedNodes.value;
    case "parent": {
      const clickedNodes =
        shadowCascaderRef.value?.getCheckedNodes(false) || [];
      const clickedNodesValue = clickedNodes!.map((o) => o.value);
      const parentNodes = clickedNodes!.filter(
        (o) => !o.parent || !clickedNodesValue.includes(o.parent.value),
      );
      return parentNodes;
    }
    default:
      return [];
  }
};

const calculatePresentTags = () => {
  if (!props.props.multiple) return;

  const nodes = getStrategyCheckedNodes();

  const allTags: Tag[] = [];
  nodes.forEach((node) => allTags.push(genTag(node)));
  tags.value = allTags;
};

watch(checkedNodes, calculatePresentTags);
</script>
