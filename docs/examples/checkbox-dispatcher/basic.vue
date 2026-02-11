<template>
  <div>
    <el-checkbox-dispatcher
      v-model="checked1"
      label="Option 1"
      size="large"
      disabled
    />
    <el-checkbox-dispatcher v-model="checked2" label="Option 2" size="large" />
  </div>
  <div class="my-2">
    <el-checkbox-dispatcher v-model="checked3" label="Option 1" />
    <el-checkbox-dispatcher v-model="checked4" label="Option 2" />
  </div>
  <div class="mt-2">
    <el-checkbox-dispatcher v-model="checked5" label="Option 1" size="small" />
    <el-checkbox-dispatcher v-model="checked6" label="Option 2" size="small" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const checked1 = ref(true);
const checked2 = ref(false);
const checked3 = ref(false);
const checked4 = ref(false);
const checked5 = ref(false);
const checked6 = ref(false);
</script>
