<template>
  <div class="mt-16px">
    <el-date-picker-dispatcher
      v-model="value1"
      type="date"
      placeholder="Pick a day"
    >
      <template #[`${Config.namespace}Reader`]>
        <span style="color: green" key="reader">reader: {{ value1 }}</span>
      </template>
      <template #[`${Config.namespace}Writer`]>
        <span style="color: red" key="writer">writer: {{ value1 }}</span>
      </template>
    </el-date-picker-dispatcher>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Config } from "@vue-form-rw-dispatcher/element-plus";

const value1 = ref(new Date());
</script>
