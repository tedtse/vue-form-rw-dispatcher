<template>
  <el-radio-group v-model="size" aria-label="size control">
    <el-radio-button value="large">large</el-radio-button>
    <el-radio-button value="default">default</el-radio-button>
    <el-radio-button value="small">small</el-radio-button>
  </el-radio-group>
  <div class="mt-16px">
    <el-date-picker-dispatcher
      v-model="value1"
      type="date"
      placeholder="Pick a day"
      :disabled-date="disabledDate"
      :size="size"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const size = ref<"default" | "large" | "small">("default");

const value1 = ref("");

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
</script>
