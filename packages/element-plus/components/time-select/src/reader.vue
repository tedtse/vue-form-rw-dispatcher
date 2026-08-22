<template>
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
    <span v-if="prefixIcon" :class="nsText.e('prefix')">
      <el-icon>
        <component :is="prefixIcon" />
      </el-icon>
    </span>

    <span>{{ props.modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { type TimeSelectProps } from "element-plus";
import { useNamespace, useSize, useDisabled } from "../../../composables";

const props = defineProps<TimeSelectProps>();
const nsText = useNamespace("el-text");
const size = useSize();
const disabled = useDisabled();

const { prefixIcon } = props;
</script>
