<template>
  <div
    :class="[
      nsText.b(),
      {
        [nsText.is('disabled')]: props.disabled,
        [nsText.m('large')]: props.size === 'large',
        [nsText.m('small')]: props.size === 'small',
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
import { useNamespace } from "../../../composables/use-namespace";

const props = defineProps<TimeSelectProps>();
const nsText = useNamespace("el-text");
const { prefixIcon } = props;
</script>
