<template>
  <div
    :class="[
      nsText.b(),
      nsInput.b(),
      {
        [nsText.is('disabled')]: props.disabled,
        [nsText.m('large')]: props.size === 'large',
        [nsText.m('small')]: props.size === 'small',
      },
    ]"
  >
    <span v-if="$slots.prepend" :class="nsText.e('prepend')">
      <slot name="prepend"></slot>
    </span>

    <span v-if="$slots.prefix" :class="nsText.e('prefix')">
      <slot name="prefix"></slot>
    </span>

    <span v-if="prefixIcon" :class="nsText.e('prefix')">
      <el-icon>
        <component :is="prefixIcon" />
      </el-icon>
    </span>

    <span>{{ value }}</span>

    <span v-if="suffixIcon" :class="nsText.e('suffix')">
      <el-icon>
        <component :is="suffixIcon" />
      </el-icon>
    </span>

    <span v-if="$slots.suffix" :class="nsText.e('suffix')">
      <slot name="suffix"></slot>
    </span>

    <span v-if="$slots.append" :class="nsText.e('append')">
      <slot name="append"></slot>
    </span>

    <el-icon
      v-if="props.showPassword"
      :class="nsInput.e('password')"
      @click="passwordVisible = !passwordVisible"
      ><PasswordIcon
    /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { ElIcon, type InputProps, type InputType } from "element-plus";
import { Hide, View } from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<InputProps>();
defineOptions({
  name: "InputReader",
});

const { prefixIcon, suffixIcon } = props;
const nsText = useNamespace("text");
const nsInput = useNamespace("input");
const passwordVisible = ref(false);

const PasswordIcon = computed(() => (passwordVisible.value ? View : Hide));

const value = computed(() => {
  const { formatter, modelValue } = props;
  if (typeof formatter === "function") {
    return formatter(modelValue);
  }
  if (
    (props.type as unknown as InputType) === "password" &&
    !passwordVisible.value
  ) {
    return "•".repeat(String(modelValue).length);
  }
  return modelValue;
});
</script>
