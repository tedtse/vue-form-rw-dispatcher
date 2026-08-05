<template>
  <div :class="nsText.b('container')">
    <div
      :class="[
        {
          [nsText.is('disabled')]: disabled,
          [nsText.m('large')]: size === 'large',
          [nsText.m('small')]: size === 'small',
        },
      ]"
    >
      <template v-if="targetCheckboxes.length">
        <checkbox-reader
          v-for="(item, index) in targetCheckboxes"
          :key="index"
          v-model="targetModelValues[index]"
          v-bind="{
            ...(item.props as CheckboxProps),
            [`${Config.namespace}Type`]: 'item',
          }"
        />
      </template>
      <template v-if="targetOptions?.length">
        <checkbox-reader
          v-for="(option, index) in targetOptions"
          :key="index"
          v-model="targetModelValues[index]"
          v-bind="{
            ...option,
            [`${Config.namespace}Type`]: 'item',
          }"
        />
      </template>
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
import { computed, ref, watchEffect, provide, type VNode } from "vue";
import {
  ElCheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
} from "element-plus";
import checkboxReader from "./checkbox-reader.vue";
import { Config } from "@vue-form-rw-dispatcher/helper";
import { CHECKBOX_GROUP_KEY } from "./use-reader";
import { useNamespace, useSize, useDisabled } from "../../../composables";

type RawSlots = {
  [name: string]: unknown;
  $stable?: boolean;
};

const props = defineProps<CheckboxGroupProps>();
defineOptions({
  components: { ShadowCheckboxGroup: ElCheckboxGroup },
});

const nsText = useNamespace("el-text");
const disabled = useDisabled();
const size = useSize();
const elCheckboxes = ref<VNode[]>([]);
const shadowCheckboxGroupRef = ref<InstanceType<typeof ElCheckboxGroup>>();

provide(CHECKBOX_GROUP_KEY, {
  instance: shadowCheckboxGroupRef,
});

const targetCheckboxes = computed(() => {
  const { modelValue, props: properties } = props;
  return elCheckboxes.value.filter((c) =>
    modelValue.includes(c.props?.[properties?.value ?? "value"]),
  );
});

const targetOptions = computed(() => {
  const { modelValue, props: properties } = props;
  return props.options?.filter((option) =>
    modelValue.includes(option[properties?.value ?? "value"]),
  );
});

const targetModelValues = computed(() => {
  const values: (string | number | boolean)[] = [];
  const { modelValue, props: properties } = props;
  if (targetCheckboxes.value.length) {
    targetCheckboxes.value.forEach((checkbox, index) => {
      const item = targetCheckboxes.value.find(
        (c) => c.props?.[properties?.value ?? "value"] === modelValue[index],
      );
      const value = item?.props?.[properties?.value ?? "value"];
      if (value !== undefined) {
        values.push(item?.props?.trueValue ?? true);
      }
    });
  }
  if (props.options?.length) {
    props.options.forEach((option, index) => {
      if (modelValue.includes(option[properties?.value ?? "value"])) {
        values.push(option[properties?.value ?? "value"]);
      }
    });
  }
  return values;
});

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
