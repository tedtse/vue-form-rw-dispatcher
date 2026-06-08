<template>
  <el-select-dispatcher
    v-model="value"
    placeholder="Select"
    style="width: 240px"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref("");

const options = [
  {
    value: "Value1",
    label: "Label1",
  },
  {
    value: "Value2",
    label: "Label2",
  },
  {
    value: "Value3",
    label: "Label3",
  },
  {
    value: "Value4",
    label: "Label4",
  },
  {
    value: "Value5",
    label: "Label5",
  },
];
</script>
