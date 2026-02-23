<template>
  <el-switch-dispatcher v-model="value">
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">reader: {{ value }}</span>
    </template>
    <template #[`${Config.namespace}Writer`]>
      <span style="color: red" key="writer">writer: {{ value }}</span>
    </template>
  </el-switch-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";
const value = ref(false);
</script>
