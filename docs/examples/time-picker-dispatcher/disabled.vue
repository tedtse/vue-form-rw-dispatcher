<template>
  <el-time-picker-dispatcher v-model="time" disabled />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const time = ref(Date.now());
</script>
