<template>
  <div
    :class="[
      nsInput.b(),
      {
        [nsInput.is('disabled')]: props.disabled,
        [nsInput.m('large')]: props.size === 'large',
        [nsInput.m('small')]: props.size === 'small',
      },
    ]"
  >
    <span v-if="$slots.prepend" :class="nsInput.e('prepend')">
      <slot name="prepend"></slot>
    </span>

    <span v-if="$slots.prefix" :class="nsInput.e('prefix')">
      <slot name="prefix"></slot>
    </span>

    <el-icon v-if="prefixIcon" :class="nsInput.e('prefix')">
      <component :is="prefixIcon" />
    </el-icon>

    <span>{{ value }}</span>

    <el-icon v-if="suffixIcon" :class="nsInput.e('suffix')">
      <component :is="suffixIcon" />
    </el-icon>

    <span v-if="$slots.suffix" :class="nsInput.e('suffix')">
      <slot name="suffix"></slot>
    </span>

    <span v-if="$slots.append" :class="nsInput.e('append')">
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
