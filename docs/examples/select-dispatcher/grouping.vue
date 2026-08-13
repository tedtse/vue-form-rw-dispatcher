<template>
  <el-select-dispatcher
    v-model="value"
    placeholder="Select"
    style="width: 240px"
  >
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-option-group>
  </el-select-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref("");
const options = [
  {
    label: "Popular cities",
    options: [
      {
        value: "1",
        label: "Shanghai",
      },
      {
        value: "2",
        label: "Beijing",
      },
    ],
  },
  {
    label: "City name",
    options: [
      {
        value: "3",
        label: "Chengdu",
      },
      {
        value: "4",
        label: "Shenzhen",
      },
      {
        value: "5",
        label: "Guangzhou",
      },
      {
        value: "6",
        label: "Dalian",
      },
    ],
  },
];
</script>
