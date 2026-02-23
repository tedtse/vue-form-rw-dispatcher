<template>
  <div class="m-4">
    <p>可筛选</p>
    <el-tree-select-dispatcher
      v-model="value"
      :data="data"
      filterable
      style="width: 240px"
    />
  </div>
  <div class="m-4">
    <p>filter method:</p>
    <el-tree-select-dispatcher
      v-model="value"
      :data="filteredData"
      :filter-method="filterMethod"
      filterable
      style="width: 240px"
    />
  </div>
  <div class="m-4">
    <p>filter node method:</p>
    <el-tree-select-dispatcher
      v-model="value"
      :data="data"
      :filter-node-method="filterNodeMethod"
      filterable
      style="width: 240px"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref();

const sourceData = [
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
  {
    value: "3",
    label: "Level one 3",
    children: [
      {
        value: "3-1",
        label: "Level two 3-1",
        children: [
          {
            value: "3-1-1",
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        value: "3-2",
        label: "Level two 3-2",
        children: [
          {
            value: "3-2-1",
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];

const data = ref(sourceData);
const filteredData = ref(sourceData);

const filterMethod = (value: string) => {
  filteredData.value = [...sourceData].filter((item) =>
    item.label.includes(value)
  );
};

const filterNodeMethod = (value: string, data: any) => {
  return data.label.includes(value);
};
</script>
