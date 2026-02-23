<template>
  <el-checkbox-dispatcher
    v-model="checked"
    label="Option 1"
    size="large"
    disabled
  >
    <template #[`${Config.namespace}Reader`]>
      <span style="color: green" key="reader">reader: {{ checked }}</span>
    </template>
    <template #[`${Config.namespace}Writer`]>
      <span style="color: red" key="writer">writer: {{ checked }}</span>
    </template>
  </el-checkbox-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";
const checked = ref(true);
</script>
