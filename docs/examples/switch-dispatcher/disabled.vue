<template>
  <el-switch-dispatcher v-model="value1" disabled />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value1 = ref(true);
</script>
