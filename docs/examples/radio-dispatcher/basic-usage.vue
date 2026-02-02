<template>
  <div class="mb-16px">
    <el-radio-group-dispatcher v-model="radio1">
      <el-radio value="1" size="large">Option 1</el-radio>
      <el-radio value="2" size="large">Option 2</el-radio>
    </el-radio-group-dispatcher>
  </div>
  <div class="mb-16px">
    <el-radio-group-dispatcher v-model="radio2">
      <el-radio value="1">Option 1</el-radio>
      <el-radio value="2">Option 2</el-radio>
    </el-radio-group-dispatcher>
  </div>
  <div>
    <el-radio-group-dispatcher v-model="radio3">
      <el-radio value="1" size="small">Option 1</el-radio>
      <el-radio value="2" size="small">Option 2</el-radio>
    </el-radio-group-dispatcher>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const radio1 = ref("1");
const radio2 = ref("1");
const radio3 = ref("1");
</script>
