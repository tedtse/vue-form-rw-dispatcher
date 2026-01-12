<template>
  <el-input-dispatcher
    v-model="input"
    style="width: 240px"
    placeholder="Please input"
  >
    <template #reader>
      <span style="color: green" key="reader">reader: {{ input }}</span>
    </template>
    <template #writer>
      <span style="color: red" key="writer">writer: {{ input }}</span>
    </template>
  </el-input-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const input = ref("abc");
</script>
