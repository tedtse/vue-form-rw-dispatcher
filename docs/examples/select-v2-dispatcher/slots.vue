<template>
  <el-select-dispatcher
    v-model="select"
    style="width: 240px"
    placeholder="Please input"
  >
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">reader: {{ select }}</span>
    </template>
    <template #[`${Config.namespace}Writer`]>
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
import { Config } from "@vue-form-rw-dispatcher/element-plus";

let index = 0;
const initials = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}));

const select = ref<string>(options[index].value);

const toggleValue = () => {
  const length = options.length;
  setTimeout(() => {
    index = (index + 1) % length;
    select.value = options[index].value;
    toggleValue();
  }, 2000);
};
toggleValue();
</script>
