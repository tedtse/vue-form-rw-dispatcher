<template>
  <el-time-select-dispatcher
    v-model="value"
    style="width: 240px"
    start="08:30"
    step="00:15"
    end="18:30"
    placeholder="Select time"
  >
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">reader: {{ value }}</span>
    </template>
    <template #[`${Config.namespace}Writer`]>
      <span style="color: red" key="writer">writer: {{ value }}</span>
    </template>
  </el-time-select-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";

const value = ref("");
</script>
