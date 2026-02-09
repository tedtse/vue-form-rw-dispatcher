<template>
  <div :class="nsText.b('container')">
    <div :class="[{ [nsText.is('disabled')]: props.disabled }]">
      <checkbox-reader
        v-for="(item, index) in targetCheckboxs"
        :key="index"
        v-model="targetModelValues[index]"
        v-bind="item.props as CheckboxProps"
      />
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
import {
  ElCheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
} from "element-plus";
import checkboxReader from "./checkbox-reader.vue";
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

const targetCheckboxs = computed(() => {
  const { modelValue, props: properties } = props;
  return elCheckboxes.value.filter((c) =>
    modelValue.includes(c.props?.[properties?.value ?? "value"]),
  );
});

const targetModelValues = computed(() => {
  const values: (string | number | boolean)[] = [];
  const { modelValue, props: properties } = props;
  targetCheckboxs.value.forEach((checkbox, index) => {
    const item = targetCheckboxs.value.find(
      (c) => c.props?.[properties?.value ?? "value"] === modelValue[index],
    );
    const value = item?.props?.[properties?.value ?? "value"];
    if (value !== undefined) {
      values.push(item?.props?.trueValue ?? true);
    }
  });
  return values;
});

// const targetCheckboxSlots = computed(() => {
//   const checkboxs = targetCheckboxs.value;
//   if (!checkboxs.length) return null;
//   return (checkbox.children as RawSlots)?.default;
// });

// const NodeRender = (node: VNode) => {
//   const hasSlot = (node.children as RawSlots)?.default;
//   if (hasSlot) {
//     return (node.children as { default(): VNode[] }).default();
//   }
//   return node.props?.label;
// };

// const label = computed(() => {
//   const { modelValue, options, props: properties } = props;
//   if (options && options.length) {
//     if (Array.isArray(modelValue)) {
//       const option = options.find((opt) =>
//         modelValue.includes(opt[properties?.value ?? "value"]),
//       );
//       if (option) return option[properties?.label ?? "label"] ?? modelValue;
//     }
//   }

//   if (!targetCheckbox.value) return modelValue ?? null;

//   if (targetCheckbox.value.props?.[properties?.label ?? "label"] != null) {
//     return targetCheckbox.value.props?.[properties?.label ?? "label"];
//   }

//   return (
//     targetCheckbox.value.props?.[properties?.value ?? "value"] ??
//     modelValue ??
//     null
//   );
// });

watchEffect(() => {
  const slotDefault =
    shadowCheckboxGroupRef.value?.$slots?.default?.(props) || [];
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
