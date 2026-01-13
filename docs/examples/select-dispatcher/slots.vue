<template>
  <el-select-dispatcher
    v-model="select"
    style="width: 240px"
    placeholder="Please input"
  >
    <template #reader>
      <span style="color: green" key="reader">reader: {{ select }}</span>
    </template>
    <template #writer>
      <span style="color: red" key="writer">writer: {{ select }}</span>
    </template>
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

let index = 0
const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];

const select = ref<string>(options[index].value);

const toggleValue = () => {
  const length = options.length
  setTimeout(() => {
    index = (index + 1) % length
    select.value = options[index].value
    toggleValue()
  }, 2000)
}
toggleValue()
</script>
