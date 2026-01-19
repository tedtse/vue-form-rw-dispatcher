<template>
  <el-input-dispatcher
    v-model="input"
    style="width: 240px"
    placeholder="Please input"
  >
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">reader: {{ input }}</span>
    </template>
    <template #[`${Config.namespace}Writer`]>
      <span style="color: red" key="writer">writer: {{ input }}</span>
    </template>
  </el-input-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";
const input = ref("abc");
</script>
