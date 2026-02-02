<template>
  <el-checkbox-dispatcher v-model="check" disabled label="disabled"
    >Disabled</el-checkbox-dispatcher
  >
  <el-checkbox-dispatcher v-model="check" disabled label="selected and disabled"
    >Selected and Disabled</el-checkbox-dispatcher
  >
</template>

<script lang="ts" setup>
import { ref } from "vue";

const check = ref(["selected and disabled"]);
</script>
