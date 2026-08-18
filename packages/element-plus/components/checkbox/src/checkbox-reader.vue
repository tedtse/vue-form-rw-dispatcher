<template>
  <div
    :class="[
      { [nsText.b('container')]: nsType === 'container' },
      { [nsText.b('item')]: nsType === 'item' },
    ]"
  >
    <div
      :class="[
        nsText.b(),
        {
          [nsText.is('disabled')]: disabled,
          [nsText.m('large')]: size === 'large',
          [nsText.m('small')]: size === 'small',
        },
      ]"
    >
      <template v-if="isTrue">
        <template v-if="checkboxSlot">
          <component :is="checkboxSlot" />
        </template>

        <span v-else>{{ text }}</span>
      </template>
      <span v-else></span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  inject,
  onMounted,
  ref,
  watchEffect,
  useAttrs,
} from "vue";
import { checkboxProps, type CheckboxProps } from "element-plus";
import { Config } from "@vue-form-rw-dispatcher/element-plus";
import { CHECKBOX_GROUP_KEY, type CheckboxGroupType } from "./use-reader";
import { useNamespace, useSize, useDisabled } from "../../../composables";

const Namespace = Config.namespace;

export default defineComponent({
  name: "CheckboxReader",
  props: {
    ...checkboxProps,
    [`${Namespace}State`]: {},
    [`${Namespace}Type`]: {
      type: String as () => "item" | "container",
      default: "container",
    },
  },
  setup(props, { slots }) {
    const parentCheckboxGroup = ref<CheckboxGroupType | null>(null);
    const isTrue = ref(false);
    const text = ref<
      string | number | boolean | Record<string, any> | undefined
    >("");

    const nsText = useNamespace("el-text");
    const disabled = useDisabled();
    const size = useSize();

    onMounted(() => {
      // Inject parent checkbox group instance
      parentCheckboxGroup.value = inject<CheckboxGroupType | null>(
        CHECKBOX_GROUP_KEY,
        null,
      );
    });

    const checkboxSlot = computed(() => slots.default);

    watchEffect(() => {
      const properties =
        parentCheckboxGroup.value?.instance?.$props?.props || {};
      const { modelValue, trueValue } = props as CheckboxProps;
      const _text =
        props[(properties?.value ?? "value") as keyof CheckboxProps];
      text.value =
        props[(properties?.label ?? "label") as keyof CheckboxProps] ?? _text;

      if (typeof trueValue !== "undefined") {
        isTrue.value = modelValue === trueValue || modelValue === true;
        return;
      }

      if (typeof _text !== "undefined") {
        isTrue.value = modelValue === _text || modelValue === true;
        return;
      }
      isTrue.value = modelValue === true;
    });

    const nsType = computed(
      () => (props as Record<string, unknown>)[`${Namespace}Type`],
    );

    return {
      props,
      nsText,
      Namespace,
      checkboxSlot,
      isTrue,
      disabled,
      text,
      size,
      nsType,
    };
  },
});
</script>
