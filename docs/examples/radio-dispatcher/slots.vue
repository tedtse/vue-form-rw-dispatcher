<template>
  <el-radio-group-dispatcher v-model="radio1">
    <el-radio value="1">Option 1</el-radio>
    <el-radio value="2">Option 2</el-radio>
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">reader: {{ radio1 }}</span>
    </template>
    <template #[`${Config.namespace}Writer`]>
      <span style="color: red" key="writer">writer: {{ radio1 }}</span>
    </template>
  </el-radio-group-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";

const radio1 = ref("1");
</script>
