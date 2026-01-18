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

    <shadow-select
      ref="shadowSelectRef"
      v-bind="{ ...props, ...$attrs }"
      style="display: none"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope || {}"></slot>
      </template>
    </shadow-select>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect, type VNode } from "vue";
import { ElSelect, ElTag, type SelectProps } from "element-plus";
import { useNamespace } from "../../../composables/use-namespace";

type OptionType = {
  label: string;
  value: string | number;
  disabled?: boolean;
} & Record<string, unknown>;

const props = defineProps<SelectProps>();
defineOptions({
  components: { ShadowSelect: ElSelect },
});

const nsText = useNamespace("el-text");
const nsSelect = useNamespace("el-select");
const nsTag = useNamespace("el-tag");
const shadowSelectRef = ref<InstanceType<typeof ElSelect>>();
const options = ref<OptionType[]>([]);

const value = computed(() => {
  const { modelValue, valueKey } = props;
  let option;
  if (Object.prototype.toString.call(modelValue) === "[object Object]") {
    option = options.value.find(
      (opt) =>
        opt[valueKey as string] ===
        (modelValue as Record<string, unknown>)[valueKey as string]
    );
    return (modelValue as OptionType).label;
  }
  option = options.value.find((opt) => opt[valueKey] === modelValue);
  return option?.label || modelValue;
});

const selectedOptions = computed(() => {
  const { modelValue, valueKey } = props;
  if (Array.isArray(modelValue)) {
    return options.value.filter((opt) =>
      modelValue.includes(opt[valueKey] as string | number)
    );
  } else {
    return options.value.filter((opt) => opt[valueKey] === modelValue);
  }
  return [];
});

watchEffect(() => {
  if (shadowSelectRef.value?.$slots.default) {
    const slotDefault = shadowSelectRef.value?.$slots.default?.() || [];
    const elOptions: VNode[] = [];
    const traverse = (nodes: VNode[] | any[]) => {
      nodes.flatMap((node) => {
        if (node.type && (node.type as any).name === "ElOption") {
          elOptions.push(node);
        } else if (node.children?.default) {
          traverse(node.children.default() as VNode[]);
        } else {
          traverse((node.children as VNode[]) || []);
        }
      });
    };
    traverse(slotDefault);
    options.value = elOptions.map((vnode) => vnode.props || {}) as OptionType[];
  } else {
    options.value = (props.options as OptionType[]) || [];
  }
});
</script>
