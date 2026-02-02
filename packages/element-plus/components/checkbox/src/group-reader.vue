<template>
  <div :class="nsText.b('container')">
    <div :class="[nsText.b(), { [nsText.is('disabled')]: props.disabled }]">
      <template v-if="targetCheckboxSlot">
        <component :is="targetCheckboxSlot" />
      </template>

      <span v-else>{{ label }}</span>
    </div>

    <shadow-checkbox-group
      ref="shadowCheckboxGroupRef"
      v-bind="{ ...props, ...$attrs }"
      style="display: none"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope || {}"></slot>
      </template>
    </shadow-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect, type VNode } from "vue";
import { ElCheckboxGroup, type CheckboxGroupProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

type RawSlots = {
  [name: string]: unknown;
  $stable?: boolean;
};

const props = defineProps<CheckboxGroupProps>();
defineOptions({
  components: { ShadowCheckboxGroup: ElCheckboxGroup },
});

const nsText = useNamespace("el-text");
const elCheckboxes = ref<VNode[]>([]);
const shadowCheckboxGroupRef = ref<InstanceType<typeof ElCheckboxGroup>>();

const targetCheckbox = computed(() => {
  const { modelValue, props: properties } = props as any;
  return elCheckboxes.value.find((c) =>
    Array.isArray(modelValue)
      ? (modelValue as any[]).includes(c.props?.[properties?.value ?? "value"])
      : c.props?.[properties?.value ?? "value"] === modelValue,
  );
});

const targetCheckboxSlot = computed(() => {
  const checkbox = targetCheckbox.value;
  if (!checkbox) return null;
  return (checkbox.children as RawSlots)?.default;
});

const label = computed(() => {
  const { modelValue, options, props: properties } = props as any;
  if (options && options.length) {
    if (Array.isArray(modelValue)) {
      const option = options.find((opt) =>
        (modelValue as any[]).includes(opt[properties?.value ?? "value"]),
      );
      if (option) return option[properties?.label ?? "label"] ?? modelValue;
    }
  }

  if (!targetCheckbox.value) return modelValue ?? null;

  if (targetCheckbox.value.props?.[properties?.label ?? "label"] != null) {
    return targetCheckbox.value.props?.[properties?.label ?? "label"];
  }

  return (
    targetCheckbox.value.props?.[properties?.value ?? "value"] ??
    modelValue ??
    null
  );
});

watchEffect(() => {
  const slotDefault =
    shadowCheckboxGroupRef.value?.$slots?.default?.(props as any) || [];
  const traverse = (nodes: VNode[]) => {
    nodes.flatMap((node) => {
      if (
        ["ElCheckbox", "ElCheckboxButton"].includes(
          node.type && (node.type as any).name,
        )
      ) {
        elCheckboxes.value.push(node);
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
