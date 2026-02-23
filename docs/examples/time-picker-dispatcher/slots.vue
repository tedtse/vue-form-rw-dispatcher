<template>
  <el-time-picker-dispatcher v-model="value1" placeholder="Arbitrary time">
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">reader: {{ value1 }}</span>
    </template>
    <template #[`${Config.namespace}Writer`]>
      <span style="color: red" key="writer">writer: {{ value1 }}</span>
    </template>
  </el-time-picker-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";

const value1 = ref(new Date(2016, 9, 10, 18, 30));
</script>
