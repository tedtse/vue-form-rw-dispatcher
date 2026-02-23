<template>
  <el-cascader-dispatcher
    v-model="value"
    :options="options"
    style="width: 260px"
    clearable
  >
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">
        reader: {{ value }}
      </span>
    </template>
    <template #[`${Config.namespace}Writer`]>
      <span style="color: red" key="writer">
        writer: {{ value }}
      </span>
    </template>
  </el-cascader-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";

const value = ref<(string | number)[]>([]);

const options = [
  {
    value: "1",
    label: "Level one 1",
    children: [
      {
        value: "1-1",
        label: "Level two 1-1",
        children: [
          {
            value: "1-1-1",
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    value: "2",
    label: "Level one 2",
    children: [
      {
        value: "2-1",
        label: "Level two 2-1",
        children: [
          {
            value: "2-1-1",
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        value: "2-2",
        label: "Level two 2-2",
        children: [
          {
            value: "2-2-1",
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
];
</script>

