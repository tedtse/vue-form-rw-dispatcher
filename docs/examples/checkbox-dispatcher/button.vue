<template>
  <el-checkbox-group-dispatcher v-model="check">
    <el-checkbox-button label="A">A</el-checkbox-button>
    <el-checkbox-button label="B">B</el-checkbox-button>
    <el-checkbox-button label="C">C</el-checkbox-button>
  </el-checkbox-group-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const check = ref(["A"]);
</script>
