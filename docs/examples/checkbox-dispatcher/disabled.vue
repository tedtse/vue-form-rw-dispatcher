<template>
  <el-checkbox-dispatcher v-model="checked1" disabled
    >Disabled</el-checkbox-dispatcher
  >
  <el-checkbox-dispatcher v-model="checked2"
    >Not disabled</el-checkbox-dispatcher
  >
</template>

<script lang="ts" setup>
import { ref } from "vue";
const checked1 = ref(false);
const checked2 = ref(true);
</script>
