<template>
  <el-checkbox-group-dispatcher
    v-model="check"
    :options="options"
    :props="props"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const check = ref([3]);
const props = { value: "id", label: "name", disabled: "unable" };
const options = [
  { id: 3, name: "Option A" },
  { id: 6, name: "Option B" },
  { id: 9, name: "Option C", unable: true },
];
</script>
