<template>
  <el-date-picker-dispatcher
    v-model="value1"
    type="daterange"
    range-separator="To"
    start-placeholder="Start date"
    end-placeholder="End date"
    :size="size"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value1 = ref("");
</script>
