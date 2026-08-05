<template>
  <div :class="nsText.b('container')">
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
      <template v-if="targetRadioSlot">
        <component :is="targetRadioSlot" />
      </template>

      <span v-else>{{ label }}</span>
    </div>

    <shadow-radio-group
      ref="shadowRadioGroupRef"
      v-bind="{ ...props, ...$attrs }"
      style="display: none"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope || {}"></slot>
      </template>
    </shadow-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect, type VNode } from "vue";
import { ElRadioGroup, type RadioGroupProps } from "element-plus";
import { useNamespace, useSize } from "../../../composables";

type RawSlots = {
  [name: string]: unknown;
  $stable?: boolean;
};

const props = defineProps<RadioGroupProps>();
defineOptions({
  components: { ShadowRadioGroup: ElRadioGroup },
});

const size = useSize();
const nsText = useNamespace("el-text");
const elRadios = ref<VNode[]>([]);
const shadowRadioGroupRef = ref<InstanceType<typeof ElRadioGroup>>();

const targetRadio = computed(() => {
  const { modelValue, props: properties } = props;
  return elRadios.value.find(
    (r) => r.props?.[properties?.value ?? "value"] === modelValue,
  );
});

const targetRadioSlot = computed(() => {
  const radio = targetRadio.value;
  if (!radio) return null;
  return (radio.children as RawSlots)?.default;
});

const label = computed(() => {
  const { modelValue, options, props: properties } = props;
  if (options && options.length) {
    const option = options.find(
      (opt) => opt[properties?.value ?? "value"] === modelValue,
    );
    if (option) {
      return option[properties?.label ?? "label"] ?? modelValue ?? null;
    }
  }

  if (!targetRadio.value) return modelValue ?? null;

  // prefer explicit label prop
  if (targetRadio.value.props?.[properties?.label ?? "label"] != null) {
    return targetRadio.value.props[properties?.label ?? "label"];
  }

  return (
    targetRadio.value.props?.[properties?.value ?? "value"] ??
    modelValue ??
    null
  );
});

watchEffect(() => {
  const slotDefault = shadowRadioGroupRef.value?.$slots?.default?.(props) || [];
  const traverse = (nodes: VNode[]) => {
    nodes.flatMap((node) => {
      if (
        ["ElRadio", "ElRadioButton"].includes(
          node.type && (node.type as any).name,
        )
      ) {
        elRadios.value.push(node);
      } else if ((node.children as RawSlots).default) {
        traverse((node.children as { default(): VNode[] }).default());
      } else {
        traverse((node.children as VNode[]) || []);
      }
    });
  };
  traverse(slotDefault as VNode[]);
});
</script>
